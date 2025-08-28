import { currentCategory } from "./sidebar.js";

let db = null;

document.addEventListener("DOMContentLoaded", async () => {
  await initDatabase();
  refreshKanban();
});

document
  .querySelector('[data-tab="kanban"]')
  .addEventListener("click", refreshKanban);

async function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("Main", 3);

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve();
    };

    request.onerror = (event) => {
      console.error("Failed to open database:", event.target.error);
      reject(event.target.error);
    };
  });
}

async function refreshKanban() {
  if (!db) {
    console.warn("Database not ready yet.");
    return;
  }

  try {
    const categoryIds = await getAllCategoryIds();
    console.log("Existing categories:", categoryIds);

    const activeCategory = currentCategory || categoryIds[0];

    const todosByStatus = await getKanbanTodos(activeCategory);
    clearKanbanItems();
    Object.values(todosByStatus).flat().forEach(renderKanbanItem);

    console.log("Todos loaded:", todosByStatus);
  } catch (err) {
    console.error("Error loading todos:", err);
  }
}

function clearKanbanItems() {
  ["#done", "#pending", "#ongoing"].forEach((selector) => {
    document
      .querySelectorAll(`${selector} .list`)
      .forEach((item) => item.remove());
  });
}

function getAllCategoryIds() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("Todos", "readonly");
    const store = transaction.objectStore("Todos");
    const request = store.getAll();

    request.onsuccess = (event) => {
      const todos = event.target.result;
      const categoryIds = [...new Set(todos.map((todo) => todo.categoryId))];
      resolve(categoryIds);
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

export function getKanbanTodos(categoryId) {
  return new Promise((resolve, reject) => {
    const todosByStatus = { pending: [], ongoing: [], done: [] };
    const transaction = db.transaction("Todos", "readonly");
    const store = transaction.objectStore("Todos");
    const index = store.index("categoryId");

    const request = index.getAll(IDBKeyRange.only(categoryId));

    request.onsuccess = (event) => {
      event.target.result.forEach((todo) => {
        todosByStatus[todo.status].push(todo);
      });
      resolve(todosByStatus);
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

export function renderKanbanItem(kanbanItem) {
  const containerMap = {
    pending: document.querySelector("#pending"),
    ongoing: document.querySelector("#ongoing"),
    done: document.querySelector("#done"),
  };

  const list = document.createElement("div");
  const item = document.createElement("div");
  const kanbanTask = document.createElement("p");
  const timeLeft = document.createElement("div");
  const kanbanTime = document.createElement("p");

  list.appendChild(item);
  list.classList.add("list");
  item.classList.add("item");
  kanbanTask.classList.add("kanban-task");
  timeLeft.classList.add("time-left");
  kanbanTime.classList.add("kanban-time");

  list.dataset.id = kanbanItem.id;
  list.draggable = true;
  item.appendChild(kanbanTask);
  item.appendChild(timeLeft);
  timeLeft.appendChild(kanbanTime);

  timeLeft.innerHTML = `
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M9 17C13.1421 17 16.5 13.6422 16.5 9.50005C16.5 5.35791 13.1421 
      2.00005 9 2.00005C4.85786 2.00005 1.5 5.35791 1.5 9.50005C1.5 13.6422 
      4.85786 17 9 17Z" stroke="#E5715C" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 5V9.5L12 11" stroke="#E5715C" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  kanbanTask.textContent = kanbanItem.taskName || "";

  containerMap[kanbanItem.status]?.appendChild(list);
}

// Drag and Drop
const container = document.querySelector(".mode-container--kanban");
let draggedList = null;

container.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("list")) {
    draggedList = e.target;
    setTimeout(() => (draggedList.style.opacity = "0.5"), 0);
  }
});

container.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("list")) {
    draggedList.style.opacity = "1";
    draggedList = null;
  }
});

document.querySelectorAll(".status").forEach((status) => {
  status.addEventListener("dragover", (e) => e.preventDefault());

  status.addEventListener("drop", async () => {
    if (draggedList) {
      const todoId = draggedList.dataset.id;
      const newStatus = status.id;

      status.appendChild(draggedList);

      try {
        await updateTodoStatus(todoId, newStatus);
        document.dispatchEvent(
          new CustomEvent("todos-updated", { detail: { source: "kanban" } })
        );

        await refreshKanban?.();
        console.log(`Todo ${todoId} status updated to ${newStatus}`);
        await refreshKanban();
      } catch (err) {
        console.error("Failed to update todo status:", err);
      }
    }
  });
});

function updateTodoStatus(todoId, newStatus) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("Todos", "readwrite");
    const store = transaction.objectStore("Todos");

    const request = store.get(todoId);

    request.onsuccess = (event) => {
      const todo = event.target.result;
      if (!todo) return reject("Todo not found");

      todo.status = newStatus;

      const updateRequest = store.put(todo);

      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = (e) => reject(e.target.error);
    };

    request.onerror = (e) => reject(e.target.error);
  });
}

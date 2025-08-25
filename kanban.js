import { currentCategory } from "./sidebar.js";
import { getKanbanTodos as getTodosFromIndex } from "./index.js";

let db;

document
  .querySelector('[data-tab="kanban"]')
  .addEventListener("click", openKanban);

async function openKanban() {
  const request = indexedDB.open("Main", 3);

  request.onsuccess = async (event) => {
    db = event.target.result;

    try {
      const categoryIds = await getAllCategoryIds();
      console.log("Existing categories:", categoryIds);

      const activeCategory = currentCategory || categoryIds[1];

      const todosByStatus = await getKanbanTodos(activeCategory);
      console.log("Todos loaded:", todosByStatus);

      Object.values(todosByStatus).flat().forEach(renderKanbanItem);
    } catch (err) {
      console.error("Error loading todos:", err);
    }
  };

  request.onerror = (event) => {
    console.error("Failed to open database:", event.target.error);
  };
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
  const doneContainer = document.querySelector("#done");
  const pendingContainer = document.querySelector("#pending");
  const ongoingContainer = document.querySelector("#ongoing");

  const list = document.createElement("div");
  const item = document.createElement("div");
  const kanbanTask = document.createElement("p");
  const timeLeft = document.createElement("div");
  const kanbanTime = document.createElement("p");

  list.appendChild(item);

  item.classList.add("item");
  kanbanTask.classList.add("kanban_task");
  timeLeft.classList.add("time_left");
  kanbanTime.classList.add("kanban_time");

  item.appendChild(kanbanTask);
  item.appendChild(timeLeft);
  timeLeft.appendChild(kanbanTime);

  timeLeft.innerHTML = `
    <svg
    width="18"
    height="19"
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 17C13.1421 17 16.5 13.6422 16.5 9.50005C16.5 5.35791 13.1421 2.00005 9 2.00005C4.85786 2.00005 1.5 5.35791 1.5 9.50005C1.5 13.6422 4.85786 17 9 17Z"
      stroke="#E5715C"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 5V9.5L12 11"
      stroke="#E5715C"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>`;

  kanbanTask.textContent = kanbanItem.taskName || "";

  if (kanbanItem.status == "pending") {
    pendingContainer.appendChild(list);
  } else if (kanbanItem.status == "ongoing") {
    ongoingContainer.appendChild(list);
  } else if (kanbanItem.status == "done") {
    doneContainer.appendChild(list);
  }
}

// Drag and Drop
const lists = document.querySelectorAll(".list");
const statuses = document.querySelectorAll(".status");

let draggedList = null;

lists.forEach((list) => {
  list.addEventListener("dragstart", () => {
    draggedList = list;
    setTimeout(() => (list.style.opacity = "none"), 0);
  });

  list.addEventListener("dragend", () => {
    draggedList.style.display = "block";
    draggedList = null;
  });
});

statuses.forEach((status) => {
  status.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  status.addEventListener("drop", () => {
    if (draggedList) {
      status.appendChild(draggedList);
    }
  });
});

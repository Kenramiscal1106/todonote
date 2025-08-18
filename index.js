"use strict";

import { openModal } from "./modal.js";
import { renderToast } from "./toast.js";
import { renderTodo } from "./todos.js";

let idDelete = "";

/**
 * @type {IDBDatabase | null}
 */
let db;

/**
 * @type {IDBDatabase | null}
 */
const request = window.indexedDB.open("Main", 3);

request.onsuccess = () => {
  db = request.result;

  const categoriesStore = db
    .transaction("Categories", "readwrite")
    .objectStore("Categories");

  // console.log(categoriesStore);
  // for (let i = 0; i < 4; i++) {
  //   /**
  //    * @type {{
  //    * id: string,
  //    * name: string,
  //    * categoryIcon: string,
  //    * order: string[]
  //    * }}
  //    */
  //   const newData = {
  //     categoryIcon: "",
  //     id: crypto.randomUUID(),
  //     name: "Home",
  //     order: [],
  //   };

  //   categoriesStore.add(newData);
  // }
  const data = categoriesStore.getAll();

  data.onsuccess = (event) => {
    renderToast({
      message: "Data successfully loaded",
      type: "success",
    });
    console.log(event.target.result);
    // event.target.result.forEach((todo) => {
    //   renderTodo(todo);
    // });
  };

  data.onerror = (event) => {
    renderToast({
      message: event.target.error?.message,
      type: "alert",
    });
  };
};

request.onerror = (event) => {
  renderToast({
    message: event.target.error?.message,
    type: "alert",
  });
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const todoStore = db.createObjectStore("Todos", { keyPath: "id" });
  db.createObjectStore("Categories", { keyPath: "id" });

  todoStore.createIndex("status", "status");
  todoStore.createIndex("categoryId", "categoryId");
  todoStore.createIndex("deadline", "deadline");

  renderToast({
    message: "DB upgraded successfully",
    type: "success",
  });
};

export function addTodo() {
  const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");
  /**
   * @type {{
   * id: string,
   * taskName: string,
   * deadline: string,
   * categoryId: string,
   * status: "pending" | "ongoing" | "done"
   * }}
   */
  const newTodo = {
    id: crypto.randomUUID(),
    taskName: "Hello, todo",
    deadline: new Date().toISOString(),
    categoryId: crypto.randomUUID(),
    status: "pending",
  };
  const action = todoStore.add(newTodo);
  action.onsuccess = () => {
    renderToast({
      message: "Todo successfully added",
      type: "success",
    });
    renderTodo(newTodo);
  };
}

export function deleteTodo(event) {
  const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");

  const todoId = event.target.getAttribute("data-task-id");
  idDelete = todoId;
  openModal();
  const action = todoStore.delete(todoId);
  action.onsuccess = () => {
    renderToast({
      type: "success",
      message: "Todo successfully deleted",
    });
  };
  document.body.removeChild(event.target.parentElement);
}

export function updateTodo(newData) {
  return (event) => {
    const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");
    const todoId = event.target.getAttribute("data-task-id");

    const oldData = todoStore.get(todoId);
    const action = todoStore.put({ ...oldData, newData });
    action.onsuccess = (event) => {
      renderToast({
        message: "Todo updated successfully",
        type: "success",
      });
    };
    action.onerror = (event) => {
      renderToast({
        message: event.target.error?.message,
        type: "error",
      });
    };
  };
}

/**
 * Gets all the todos
 * @param {string} categoryId
 * @returns {{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
 * }}
 */
export function getCategoryTodos(categoryId) {
  let todos = [];
  const todoStore = db.transaction("Todos", "readonly").objectStore("Todos");
  const indexSearch = todoStore.index("categoryId");

  const data = indexSearch.getAll(IDBKeyRange.only(categoryId));

  data.onsuccess = (event) => {
    todos = event.target.result;
  };
  data.onerror = (event) => {
    renderToast({
      type: "alert",
      message: event.target.error?.message,
    });
  };
}
/**
 * @param {string} categoryId
 * @returns {Map<string, {
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
 * }[]>}
 */
export function getCalendarTodos(categoryId) {
  /**
   * @type {Map<string, {
   * id: string,
   * taskName: string,
   * deadline: string,
   * categoryId: string,
   * status: "pending" | "ongoing" | "done"
   * }[]>}
   */
  const todosMap = new Map();
  const todoStore = db.transaction("Todos", "readonly").objectStore("Todos");
  const indexSearch = todoStore.index("categoryId");

  const data = indexSearch.getAll(IDBKeyRange.only(categoryId));

  data.onsuccess = (event) => {
    event.target.result.forEach((todo) => {
      if (todosMap.has(todo.deadline)) {
        const dateTodo = todosMap.get(todo.deadline);
        dateTodo.push(todo);
        return;
      }
      todosMap.set(todo.deadline, todo);
    });
  };
  data.onerror = (event) => {
    renderToast({
      type: "alert",
      message: event.target.error?.message,
    });
  };
  return todosMap;
}
/**
 * 
 * @param {string} categoryId
 */
export function getKanbanTodos(categoryId) {
  const todosByStatus = {
    "pending": [],
    "ongoing": [],
    "done": []
  }
  const todoStore = db.transaction("Todos", "readonly").objectStore("Todos");
  const indexSearch = todoStore.index("categoryId");
  

  const data = indexSearch.getAll(IDBKeyRange.only(categoryId));


  data.onsuccess = (event) => {
    event.target.result.forEach((todo) => {
      todosByStatus[todo.status].push(todo)
    });
  };
  data.onerror = (event) => {
    renderToast({
      type: "alert",
      message: event.target.error?.message,
    });
  };
  return todosByStatus;
}

// Kanban Drag and Drop

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
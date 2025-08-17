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

  // const categoriesStore = db
  //   .transaction("Categories", "readwrite")
  //   .objectStore("Categories");

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
    event.target.result.forEach((todo) => {
      renderTodo(todo);
    });
  };

  todosRequest.onerror = (event) => {
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

function addTodo() {
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
    status: "pending"
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

function deleteTodo(event) {
  const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");

  const todoId = event.target.getAttribute("data-task-id");
  idDelete = todoId;
  openModal()
  const action = todoStore.delete(todoId);
  action.onsuccess = () => {
    renderToast({
      type: "success",
      message: "Todo successfully deleted",
    });
  };
  document.body.removeChild(event.target.parentElement);
}

function updateTodo(newData) {
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

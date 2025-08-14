"use strict";

import { renderToast } from "./toast";;

/**
 * @type {IDBDatabase | null}
 */
let db;
const request = window.indexedDB.open("Todos", 3);

/**
 * @param {{
 *  id:ReturnType<typeof crypto.randomUUID>,
 *  taskName:string,
 *  deadline:string,
 *  categoryId: ReturnType<typeof crypto.randomUUID>,
 *  categoryIcon: string
 * }} todo
 */
function renderTodo(todo) {
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-task-id", todo.id);
  deleteButton.addEventListener("click", deleteTodo);
  deleteButton.textContent = "Delete Todo";

  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo");
  todoContainer.textContent = todo.id + " " + todo.taskName;

  todoContainer.appendChild(deleteButton);
  document.body.appendChild(todoContainer);
}

request.onsuccess = () => {
  db = request.result;
  const todoObjectStore = db
    .transaction("Todos", "readwrite")
    .objectStore("Todos");

  const todosRequest = todoObjectStore.getAll();

  todosRequest.onsuccess = (evt) => {
    renderToast({
      message: "Data successfully loaded",
      type: "success",
    });
    evt.target.result.forEach((todo) => {
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
  renderToast({
    message: "DB upgraded successfully",
    type: "success",
  });

  const todoObjectStore = db
    .transaction("Todos", "readwrite")
    .objectStore("Todos");
  const todosRequest = todoObjectStore.getAll();
  todosRequest.onsuccess = (evt) => {
    evt.target.result.forEach((todo) => {
      renderTodo(todo);
    });
  };
};

function addTodo() {
  const todoObjectStore = db
    .transaction("Todos", "readwrite")
    .objectStore("Todos");

  const newTodo = {
    id: crypto.randomUUID(),
    taskName: "Hello, todo",
    deadline: new Date().toISOString(),
    categoryId: crypto.randomUUID(),
    categoryIcon: "+",
  };
  const action = todoObjectStore.add(newTodo);
  action.onsuccess = (evt) => {
    renderToast({
      message: "Todo successfully added",
      type: "success",
    });
    renderTodo(newTodo);
  };
}

function deleteTodo(event) {
  const todoObjectStore = db
    .transaction("Todos", "readwrite")
    .objectStore("Todos");

  const todoId = event.target.getAttribute("data-task-id");
  const action = todoObjectStore.delete(todoId);
  action.onsuccess = () => {
    renderToast({
      type: "success",
      message: "Todo successfully deleted",
    });
  };
  document.body.removeChild(event.target.parentElement);
}

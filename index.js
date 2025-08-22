"use strict";

import { openModal } from "./modal.js";
import { renderCategoryTab } from "./sidebar.js";
import { renderToast } from "./toast.js";
import { renderTodo } from "./todos.js";

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
  const transaction = db.transaction(["Categories", "Todos"], "readonly");

  const categoriesStore = transaction.objectStore("Categories");
  const todosStore = transaction.objectStore("Todos");
  const statusIndex = todosStore.index("status")

  const data = categoriesStore.getAll();
  const dataTodo = statusIndex.getAll(IDBKeyRange.bound("ongoing", "pending"));

  const headerNum = document.querySelector(
    ".categories-info__metadata__num-tasks"
  );
  dataTodo.onsuccess = (event) => {
    renderToast({
      message: "Todos successfully loaded",
      type: "success",
    });
    event.target.result.forEach((todo) => {
      renderTodo(todo);
    });
    headerNum.textContent = `${event.target.result.length} task/s`;
  };

  data.onsuccess = (event) => {
    renderToast({
      message: "Categories successfully loaded",
      type: "success",
    });
    event.target.result.forEach((category) => {
      renderCategoryTab(category);
    });
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

/**
 * @param {{
 * id: string,
 * name: string,
 * categoryIcon: string,
 * order: string[]
 * }} newData
 */
export function addCategories(newData) {
  const categoriesStore = db
    .transaction("Categories", "readwrite")
    .objectStore("Categories");

  const action = categoriesStore.add(newData);

  action.onsuccess = (event) => {
    renderToast({
      message: "Category successfully created",
      type: "success",
    });
    renderCategoryTab(newData);
  };
  action.onerror = (event) => {
    renderToast({
      message: event.target.error?.message,
      type: "alert",
    });
  };
}

/**
 * @returns {Promise<{
 * id: string,
 * name: string,
 * categoryIcon: string,
 * order: string[]
 * }[]>}
 */
export function getCategories() {
  // let categories = [];
  return new Promise((resolve, reject) => {
    const categoriesStore = db
      .transaction("Categories", "readonly")
      .objectStore("Categories");

    const action = categoriesStore.getAll();
    action.onsuccess = (event) => {
      resolve(event.target.result);
    };
    action.onerror = (event) => {
      renderToast({
        type: "alert",
        message: event.target.error?.message,
      });
      reject(event.target.error?.message);
    };
  });
}

/**
 * @returns {Promise<{
 * id: string,
 * name: string,
 * categoryIcon: string,
 * order: string[]
 * }>}
 * @param {string} categoryId 
 */
export function getCategory(categoryId) {
  // let categories = [];
  return new Promise((resolve, reject) => {
    const categoriesStore = db
      .transaction("Categories", "readonly")
      .objectStore("Categories");

    const action = categoriesStore.get(IDBKeyRange.only(categoryId));
    action.onsuccess = (event) => {
      resolve(event.target.result);
    };
    action.onerror = (event) => {
      renderToast({
        type: "alert",
        message: event.target.error?.message,
      });
      reject(event.target.error?.message);
    };
  });
}

/**
 * @param {{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
 * }} data
 */
export function addTodo(data) {
  const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");

  const action = todoStore.add(data);
  action.onsuccess = () => {
    renderToast({
      message: "Todo successfully added",
      type: "success",
    });
  };
}

/**
 *
 * @param {string} todoId
 */
export function deleteTodo(todoId) {
  const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");
  const action = todoStore.delete(todoId);
  action.onsuccess = () => {
    renderToast({
      type: "success",
      message: "Todo successfully deleted",
    });
  };
}

/**
 *
 * @param {{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
 * }} newData
 * @returns
 */
export function updateTodo(newData) {
  return (event) => {
    const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");

    const action = todoStore.get(newData.id);
    action.onsuccess = (event) => {
      console.log("update")
      todoStore.put(newData);
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
 * @param {boolean} [all=false] 
 * @returns {Promise<{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
 * }[]>}
 */
export function getCategoryTodos(categoryId, all = false) {
  return new Promise((resolve, reject) => {
    const todoStore = db.transaction("Todos", "readonly").objectStore("Todos");
    const indexSearch = todoStore.index("categoryId");

    const data = indexSearch.getAll(
      categoryId === "" ? undefined : IDBKeyRange.only(categoryId)
    );

    data.onsuccess = (event) => {
      resolve(event.target.result.filter(todo => all ? true : (todo.status !== "done")));
    };
    data.onerror = (event) => {
      reject();
      renderToast({
        type: "alert",
        message: event.target.error?.message,
      });
    };
  });
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
    pending: [],
    ongoing: [],
    done: [],
  };
  const todoStore = db.transaction("Todos", "readonly").objectStore("Todos");
  const indexSearch = todoStore.index("categoryId");

  const data = indexSearch.getAll(IDBKeyRange.only(categoryId));

  data.onsuccess = (event) => {
    event.target.result.forEach((todo) => {
      todosByStatus[todo.status].push(todo);
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

"use strict";

import { renderContent } from "./content.js";
import { renderHeaderElement } from "./header.js";
import {
  currentCategory,
  renderCategoryTab,
  renderProgressBar,
} from "./sidebar.js";
import { renderToast } from "./toast.js";
// import { renderTodo } from "./todos.js";

/**
 * @type {IDBDatabase | null}
 */
let db;

/**
 * @type {IDBDatabase | null}
 */
const request = window.indexedDB.open("Main", 3);

/**
 * @type {"default" | "calendar" | "kanban"}
 */
export let currentView = "default";

document.addEventListener("viewchange", ({ detail }) => {
  const targetMode = document.querySelector(`div.mode--${detail.tab}`);
  const headerContainer = document.querySelector(".header__container");

  function switchTab(delayed) {
    const activeMode = document.querySelector(".mode--visible");
    const activeTab = document.querySelector(".view--active");
    if (delayed) {
      activeMode.classList.add("mode--transition");
      setTimeout(() => {
        activeMode.classList.remove("mode--visible");
        targetMode.classList.add("mode--visible");
        activeMode.classList.remove("mode--transition");
      }, 500);
    } else {
      activeMode.classList.remove("mode--visible");
      targetMode.classList.add("mode--visible");
    }
    activeTab.classList.remove("view--active");
  }
  if (detail.tab === "default") {
    headerContainer.classList.add("header__container--contained");
  } else {
    headerContainer.classList.remove("header__container--contained");
  }
  if (currentView === "default" || detail.tab === "default") {
    switchTab(true);
  } else {
    switchTab(false);
  }
  currentView = detail.tab;
  renderContent();
});

document.addEventListener("todoschange", ({ detail }) => {
  /**
   * @type {"added" | "edited" | "deleted"}
   */
  let verb = "";
  switch (detail.type) {
    case "add":
      verb = "added";
      break;
    case "update":
      verb = "updated";
      break;
    case "delete":
      verb = "deleted";
  }
  renderToast({
    message: "Todo successfully " + verb,
    type: "success",
  });
});

request.onsuccess = () => {
  db = request.result;
  const transaction = db.transaction(["Categories", "Todos"], "readonly");

  const categoriesStore = transaction.objectStore("Categories");
  const todosStore = transaction.objectStore("Todos");

  const data = categoriesStore.getAll();
  renderContent();
  renderProgressBar();
  renderHeaderElement();

  data.onsuccess = (event) => {
    renderToast({
      message: "Categories successfully loaded",
      type: "success",
    });
    const categories = event.target.result;
    if (categories.length === 0) {
      document
        .querySelector(".categories-empty")
        .classList.add("categories-empty--active");
    }
    categories.forEach((category) => {
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
 * status: "pending" | "in-progress" | "done"
 * }} data
 */
export function addTodo(data) {
  return new Promise((resolve, reject) => {
    const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");

    const action = todoStore.add(data);
    action.onsuccess = () => {
      document.dispatchEvent(
        new CustomEvent("todoschange", { detail: { type: "add" } })
      );
      resolve();
    };
    action.onerror = (event) => {
      reject();
    };
  });
}

/**
 *
 * @param {string} todoId
 */
export function deleteTodo(todoId) {
  const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");
  const action = todoStore.delete(todoId);
  action.onsuccess = () => {
    document.dispatchEvent(
      new CustomEvent("todoschange", { detail: { type: "delete" } })
    );
  };
}

export function clearDone() {
  const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");
  // const status = todoStore.index("status").
  const request = todoStore.openCursor();
  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (!cursor) {
      renderContent();
      renderToast({
        type: "success",
        message: "Todo has been cleared successfully"
      })
      renderProgressBar()
      return;
    }; // no more entries

    const { status, categoryId } = cursor.value;
    if (status === "done" && categoryId === currentCategory) {
      cursor.delete();
    }
    cursor.continue();
  };


  request.onerror = (event) => {
    console.error("Cursor error:", event.target.error);
  };
}
// clearDone();
/**
 *
 * @param {string} categoryId
 */
export async function deleteCategory(categoryId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Todos", "Categories"], "readwrite");
    const todoStore = transaction.objectStore("Todos");
    const categoryStore = transaction.objectStore("Categories");
    const indexSearch = todoStore.index("categoryId");

    const indexCursorRequest = indexSearch.openCursor(
      IDBKeyRange.only(categoryId)
    );
    categoryStore.delete(categoryId);

    indexCursorRequest.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const deleteRequest = cursor.delete();
        deleteRequest.onsuccess = function () {
          renderToast({
            type: "success",
            message: "Category successfully deleted",
          });
        };
        deleteRequest.onerror = function () {
          console.error("Error deleting record.");
        };
        cursor.continue(); // Move to the next record if needed
      } else {
      }
      resolve();
    };
  });
}

/**
 *
 * @param {{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "in-progress" | "done"
 * }} newData
 * @returns
 */
export function updateTodo(newData) {
  return new Promise((resolve, reject) => {
    const todoStore = db.transaction("Todos", "readwrite").objectStore("Todos");

    const action = todoStore.put(newData);
    action.onsuccess = (event) => {
      document.dispatchEvent(
        new CustomEvent("todoschange", { detail: { type: "update" } })
      );
      todoStore.put(newData);
      resolve();
    };

    action.onerror = (event) => {
      renderToast({
        message: event.target.error?.message,
        type: "alert",
      });
      reject(event.target.error?.message);
    };
  });
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
 * status: "pending" | "in-progress" | "done"
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
      resolve(
        event.target.result.filter((todo) =>
          all ? true : todo.status !== "done"
        )
      );
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
 * @returns {Promise<Map<string, {
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "in-progress" | "done"
 * }[]>>}
 */
export function getCalendarTodos(categoryId) {
  return new Promise((resolve) => {
    /**
     * @type {Map<string, {
     * id: string,
     * taskName: string,
     * deadline: string,
     * categoryId: string,
     * status: "pending" | "in-progress" | "done"
     * }[]>}
     */
    const todosMap = new Map();
    const todoStore = db.transaction("Todos", "readonly").objectStore("Todos");
    const indexSearch = todoStore.index("categoryId");

    const data = indexSearch.getAll(
      categoryId === "" ? undefined : IDBKeyRange.only(categoryId)
    );

    data.onsuccess = (event) => {
      event.target.result.forEach((todo) => {
        const key = todo.deadline.replace(/T.+/g, "");
        if (todosMap.has(key)) {
          const dateTodo = todosMap.get(key);
          dateTodo.push(todo);
          todosMap.set(key, dateTodo);
          return;
        }
        todosMap.set(key, [todo]);
      });
      console.log(todosMap)
      resolve(todosMap);
    };
    data.onerror = (event) => {
      renderToast({
        type: "alert",
        message: event.target.error?.message,
      });
    };
  });
}
/**
 *
 * @param {string} categoryId
 */
export function getKanbanTodos(categoryId) {
  return new Promise((resolve, reject) => {
    const todosByStatus = {
      pending: [],
      "in-progress": [],
      done: [],
    };
    const todoStore = db.transaction("Todos", "readonly").objectStore("Todos");
    const indexSearch = todoStore.index("categoryId");

    const data = indexSearch.getAll(IDBKeyRange.only(categoryId));

    data.onsuccess = (event) => {
      event.target.result.forEach((todo) => {
        todosByStatus[todo.status].push(todo);
      });
      resolve(todosByStatus);
    };
    data.onerror = (event) => {
      renderToast({
        type: "alert",
        message: event.target.error?.message,
      });
    };
  });
}

export function updateTodoStatus(todoId, newStatus) {
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

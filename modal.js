import { addContent } from "./content.js";
import { currentView, renderHeaderElement } from "./header.js";
import {
  addCategories,
  addTodo,
  deleteCategory,
  deleteTodo,
  getCategories,
  updateTodo,
} from "./index.js";
import { currentCategory, renderProgressBar } from "./sidebar.js";
import { renderToast } from "./toast.js";

const [todoForm, editForm, categoryForm, deleteForm] =
  document.querySelectorAll("form.modal");

const datetimeInput = document.querySelector("[type='datetime-local']");

const overlay = document.querySelector("div.overlay");
const categoryEvents = document.querySelectorAll(".categories-add");
const todoEvents = document.querySelectorAll(".todos-add");

/**
 * @type {KeyframeEffect}
 */
const modalKeyframe = [
  { scale: 0.95, opacity: 0.5 },
  { scale: 1, opacity: 1 },
];

/**
 * @type {KeyframeEffect}
 */
const overlayKeyframe = [{ opacity: 0 }, { opacity: 1 }];

/**
 * @type {"todo" | "category" | "delete" | "edit"}
 */
let currentType = "todo";

/**
 * @type {string}
 */
let currentDelete = "";
/**
 * @type {"todo" | "category"}
 */
let deleteMode = "todo";

/**
 * @type {string}
 */
let currentEdit = "";



window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(currentType);
  }
})

datetimeInput.setAttribute(
  "min",
  new Date().toISOString().replace(/:\d+.\d+Z$/g, "")
);

categoryEvents.forEach((target) => {
  target.addEventListener("click", () => {
    openModal("category");
  });
});

todoEvents.forEach((target) => {
  target.addEventListener("click", () => {
    openModal("todo");
  });
});

const closeElements = document.querySelectorAll(".close-modal");
closeElements.forEach((element) => {
  element.addEventListener("click", () => {
    closeModal(currentType);
  });
});

overlay.addEventListener("click", () => {
  closeModal(currentType);
});

const select = document.querySelector("#select-categories");
const editSelect = document.querySelector("#select-categories-edit");

/**
 * @param {"todo" | "category" | "edit"} type
 * @param {string} message
 * @param {*} [todo=undefined]
 */
export async function openModal(type, todo) {
  currentType = type;
  const modalSelector = document.querySelector(`.modal--${type}`);
  modalSelector.animate(modalKeyframe, {
    duration: 150,
    easing: "ease-in-out",
  });
  overlay.animate(overlayKeyframe, {
    duration: 150,
    easing: "ease-in-out",
  });
  if (type === "category") {
    overlay.classList.add("overlay--open");
    modalSelector.classList.add("modal--open");
    return;
  }

  const categories = await getCategories();
  if (categories.length === 0) {
    alert("There are no categories available yet");
    return;
  }
  overlay.classList.add("overlay--open");

  if (type === "edit") {
    if (typeof todo === "undefined")
      throw new Error("second argument of openModal undefined");
    currentEdit = todo.id;
    const nameInput = document.querySelector("input#task-name-edit");
    const deadlineInput = document.querySelector("input#deadline-edit");
    deadlineInput.value = todo.deadline;
    nameInput.value = todo.taskName;
    const categoryOption = document.querySelector(
      `select#select-categories-edit[value="${todo.categoryId}"`
    );
  }
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.setAttribute("value", category.id);
    option.textContent = category.categoryIcon + " " + category.name;
    if (type === "todo") {
      select.appendChild(option);
      return;
    }
    if (category.id === todo.categoryId) {
      option.selected = true;
    }
    editSelect.appendChild(option);
  });
  modalSelector.classList.add("modal--open");
}
/**
 *
 * @param {string} message
 * @param {string} id
 * @param {boolean} [category=false]
 */
export async function deleteModal(message, id, category = false) {
  currentType = "delete";
  currentDelete = id;
  deleteMode = category ? "category" : "todo";
  overlay.classList.add("overlay--open");
  deleteForm.classList.add("modal--open");
  deleteForm.animate(modalKeyframe, {
    duration: 150,
    easing: "ease-in-out",
  });
  overlay.animate(overlayKeyframe, {
    duration: 150,
    easing: "ease-in-out",
  });
  /**
   * @type {Element}
   */
  const messageElement = document.querySelector(".modal__message");

  messageElement.textContent = message;
}

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (deleteMode === "category") {
    deleteCategory(currentDelete).then(() => {
      localStorage.setItem("current-category", "");
      window.location.reload();
    });
    return;
    // window.location.reload();
  }
  const currentContainer = document.querySelector(
    `.mode__container--${currentView}`
  );
  deleteTodo(currentDelete);
  closeModal("delete");
  const targetDelete = document.querySelector(
    `[data-task-id="${currentDelete}"]`
  );
  currentContainer.removeChild(targetDelete);
  renderProgressBar();
  renderHeaderElement(currentCategory);
});

/**
 * @param {"todo" | "category" | "delete" | "edit"} type
 */
export function closeModal(type) {
  const options = Array.from(select.children);
  options.forEach((option) => {
    if (option.textContent !== "Select Category") {
      select.removeChild(option);
    }
  });
  const editOptions = Array.from(editSelect.children);
  editOptions.forEach((option) => {
    if (option.textContent !== "Select Category") {
      editSelect.removeChild(option);
    }
  });
  const modalSelector = document.querySelector(`.modal--${type}`);
  modalSelector
    .animate(modalKeyframe, {
      duration: 150,
      direction: "reverse",
    })
    .finished.then(() => {
      modalSelector.classList.remove("modal--open");
      modalSelector.reset();
    });
  overlay
    .animate(overlayKeyframe, {
      duration: 150,
      direction: "reverse",
    })
    .finished.then(() => {
      overlay.classList.remove("overlay--open");
    });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const extractedData = Object.fromEntries(formData.entries());

  renderProgressBar();

  /**
   * @type {{
   * id: string,
   * taskName: string,
   * deadline: string,
   * categoryId: string,
   * status: "pending" | "ongoing" | "done"
   * }}
   */
  const data = {
    id: crypto.randomUUID(),
    categoryId: extractedData["category-id"],
    deadline: extractedData["deadline"],
    status: "pending",
    taskName: extractedData["task-name"],
  };

  addTodo(data).then(() => {
    addContent(data);
    closeModal("todo");
    event.currentTarget.reset();
    renderHeaderElement(currentCategory === "" ? undefined : currentCategory);
  })
});

categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const extractedData = Object.fromEntries(formData.entries());
  const regex = /\p{Emoji_Presentation}/gu;
  const emoji = extractedData["category-emoji"];
  if (emoji.length === 0) {
    alert("No emoji found");
    return;
  }
  if (!regex.test(emoji) && emoji.length > 2) {
    alert("That character is not allowed");
    return;
  }

  addCategories({
    id: crypto.randomUUID(),
    categoryIcon: emoji,
    name: extractedData["category-name"],
    order: [],
  });
  document.querySelector(".categories-empty").classList.remove("categories-empty--active");
  event.currentTarget.reset();
  closeModal("category");
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const formData = new FormData(editForm);
  const extractedData = Object.fromEntries(formData.entries());

  renderProgressBar();
  /**
   * @type {{
   * id: string,
   * taskName: string,
   * deadline: string,
   * categoryId: string,
   * status: "pending" | "ongoing" | "done"
   * }}
   */
  const data = {
    id: currentEdit,
    categoryId: extractedData["category-id"],
    deadline: extractedData["deadline"],
    status: "pending",
    taskName: extractedData["task-name"],
  };
  updateTodo(data).then(() => window.location.reload()).catch((error) => renderToast({
    type: "alert",
    message: error
  }))
});

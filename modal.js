import { currentView, renderHeaderElement } from "./header.js";
import { addCategories, addTodo, deleteTodo, getCategories } from "./index.js";
import { currentCategory, renderProgressBar } from "./sidebar.js";
import { renderTodo } from "./todos.js";

/**
 * @type {"todo" | "category" | "delete"}
 */
let currentType = "todo";

/**
 * @type {string}
 */
let currentDelete = "";
const [todoForm, categoryForm, deleteForm] =
  document.querySelectorAll("form.modal");

const datetimeInput = document.querySelector("[type='datetime-local']");
datetimeInput.setAttribute(
  "min",
  new Date().toISOString().replace(/:\d+.\d+Z$/g, "")
);

const overlay = document.querySelector("div.overlay");
const categoryEvents = document.querySelectorAll(".categories-add");
const todoEvents = document.querySelectorAll(".todos-add");

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

/**
 * @param {"todo" | "category"} type
 * @param {string} message
 */
export async function openModal(type) {
  currentType = type;
  const modalSelector = document.querySelector(`.modal--${type}`);
  overlay.classList.add("overlay--open");
  const categories = await getCategories();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.setAttribute("value", category.id);
    option.textContent = category.categoryIcon + " " + category.name;
    select.appendChild(option);
  });

  modalSelector.classList.add("modal--open");
}
/**
 *
 * @param {() => void} callbackfn
 * @param {string} message
 */
export async function deleteModal(message, id) {
  currentType = "delete";
  currentDelete = id;
  overlay.classList.add("overlay--open");
  deleteForm.classList.add("modal--open");

  /**
   * @type {Element}
   */
  const messageElement = document.querySelector(".modal__message");

  messageElement.textContent = message;
}

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const currentContainer = document.querySelector(
    `.mode__container--${currentView}`
  );
  deleteTodo(currentDelete);
  closeModal("delete");
  const targetDelete = document.querySelector(
    `[data-task-id="${currentDelete}"]`
  );
  currentContainer.removeChild(targetDelete);
  renderProgressBar()
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
  const modalSelector = document.querySelector(`.modal--${type}`);
  modalSelector.classList.remove("modal--open");
  overlay.classList.remove("overlay--open");
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const extractedData = Object.fromEntries(formData.entries());

  renderProgressBar()

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

  addTodo(data);
  event.target.reset();
  closeModal("todo");
  renderHeaderElement(currentCategory === "" ? undefined : currentCategory)
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
  if (!regex.test(emoji)) {
    alert("That character is not allowed");
    return;
  }

  addCategories({
    id: crypto.randomUUID(),
    categoryIcon: emoji,
    name: extractedData["category-name"],
    order: [],
  });
  event.target.reset();
  closeModal("category");
});

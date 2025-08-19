import { addCategories, addTodo, getCategories } from "./index.js";

/**
 * @type {"todo" | "category" | "delete"}
 */
let currentType = "todo";
const [todoForm, categoryForm] = document.querySelectorAll("form.modal");

const datetimeInput = document.querySelector("[type='datetime-local']");
datetimeInput.setAttribute("min", new Date().toISOString().replace(/:\d+.\d+Z$/g, ""))

const overlay = document.querySelector("div.overlay");
const categoryEvents = document.querySelectorAll(".categories-add");
const todoEvents = document.querySelectorAll(".todos-add");

categoryEvents.forEach((target) => {
  target.addEventListener("click", () => {
    openModal("category", "amfdasfadgasd");
  });
});

todoEvents.forEach((target) => {
  target.addEventListener("click", () => {
    openModal("todo", "amfdasfadgasd");
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
 * @param {"todo" | "category" | "delete"} type
 * @param {string} message
 */
export async function openModal(type, message) {
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
  if (type === "delete") {
    const messageSelector = document.querySelector("div.modal__message");
    messageSelector.textContent = message;
  }
}

/**
 * @param {"todo" | "category" | "delete"} type
 */
export function closeModal(type) {
  // const options = document.querySelectorAll("option")
  const options = Array.from(select.children)
  options.forEach(option => {
    if (option.textContent!=="Select Category") {
      select.removeChild(option)
    }
  })
  const modalSelector = document.querySelector(`.modal--${type}`);
  modalSelector.classList.remove("modal--open");
  overlay.classList.remove("overlay--open");
}


todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const extractedData = Object.fromEntries(formData.entries());

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

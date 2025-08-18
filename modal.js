const overlay = document.querySelector("div.overlay");

const categoryEvents = document.querySelectorAll(".categories-add");
const todoEvents = document.querySelectorAll(".todos-add");

categoryEvents.forEach((target) => {
  target.addEventListener("click", () => {
    openModal("category", "amfdasfadgasd")
  })
})

todoEvents.forEach((target) => {
  target.addEventListener("click", () => {
    openModal("todo", "amfdasfadgasd")
  })
})

const closeElements = document.querySelectorAll(".close-modal");
closeElements.forEach((element) => {
  element.addEventListener("click", () => {
    closeModal(currentType);
  })
})

/**
 * @type {"todo" | "category" | "delete"}
 */
let currentType = "todo";

overlay.addEventListener("click", () => {
  closeModal(currentType);
})

/**
 * @param {"todo" | "category" | "delete"} type
 * @param {string} message
 */
export function openModal(type, message) {
  currentType = type;
  const modalSelector = document.querySelector(`.modal--${type}`);
  overlay.classList.add("overlay--open")
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
  const modalSelector = document.querySelector(`.modal--${type}`);
  modalSelector.classList.remove("modal--open"); 
  overlay.classList.remove("overlay--open"); 
}

const [todoForm, categoryForm] = document.querySelectorAll("form.modal");

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
})

categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
})
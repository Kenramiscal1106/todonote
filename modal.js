/**
 * @param {"todo" | "category" | "delete"} type
 * @param {string} message
 */
export function openModal(type, message) {
  const modalSelector = document.querySelector(`div#modal__${type}`);
  modalSelector.classList.add("modal__open");
  if (type === "delete") {
    const messageSelector = document.querySelector("div#modal--message");
    messageSelector.textContent = message;
  }
}

/**
 * @param {"todo" | "category" | "delete"} type
 */
export function closeModal(type) {
  const modalSelector = document.querySelector(`div#modal__${type}`);
  modalSelector.classList.remove("modal__close");
}

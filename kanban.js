// Kanban Drag and Drop
import { getKanbanTodos } from "./index.js";

/**
 * @param {{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
 * }} item
 */
export function renderKanbanItem(item) {
  const defaultContainer = document.querySelector(".mode-container--kanban");

  const item = document.createElement("div");
  const timeLeft = document.createElement("div");

  item.classList.add("item");
  timeLeft.classList.add("time_left");

  timeLeft.innerHTML = `
    <svg
    width="18"
    height="19"
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 17C13.1421 17 16.5 13.6422 16.5 9.50005C16.5 5.35791 13.1421 2.00005 9 2.00005C4.85786 2.00005 1.5 5.35791 1.5 9.50005C1.5 13.6422 4.85786 17 9 17Z"
      stroke="#E5715C"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 5V9.5L12 11"
      stroke="#E5715C"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>`;
}

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

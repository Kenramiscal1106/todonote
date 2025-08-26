import { renderHeaderElement } from "./header.js";
import { getCategoryTodos } from "./index.js";
import { deleteModal } from "./modal.js";

export let currentCategory = "";

const homeTab = document.querySelector(".sidebar__home-tab");
homeTab.classList.add("tab--active");
homeTab.addEventListener("click", handleHome);
const progressBar = document.querySelector(".progress__bar__value");
const progressValue = document.querySelector(".progress-status");
const sidebarTrigger = document.querySelector(".sidebar-trigger");

const sidebarOverlay = document.querySelector(".sidebar-overlay");
const sidebar = document.querySelector(".sidebar");
sidebarTrigger.addEventListener("click", () => {
  // sidebar.classList.add("active")
  sidebar.classList.add("sidebar--open")
  sidebarOverlay.classList.add("overlay--open")
})
sidebarOverlay.addEventListener("click", () => {
  sidebarOverlay.classList.remove("overlay--open");
  sidebar.classList.remove("sidebar--open")
})

/**
 *
 * @param {string} category
 */
export function renderCategoryTab(category) {
  const tabContainer = document.querySelector("#category-tabs");
  const categoryTab = document.createElement("button");
  const categoryInfo = document.createElement("div");
  const deleteButton = document.createElement("button");
  const trashIcon = `
  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 5.5H4.16667H17.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.8334 5.49996V17.1666C15.8334 17.6087 15.6578 18.0326 15.3452 18.3451C15.0326 18.6577 14.6087 18.8333 14.1667 18.8333H5.83335C5.39133 18.8333 4.9674 18.6577 4.65484 18.3451C4.34228 18.0326 4.16669 17.6087 4.16669 17.1666V5.49996M6.66669 5.49996V3.83329C6.66669 3.39127 6.84228 2.96734 7.15484 2.65478C7.4674 2.34222 7.89133 2.16663 8.33335 2.16663H11.6667C12.1087 2.16663 12.5326 2.34222 12.8452 2.65478C13.1578 2.96734 13.3334 3.39127 13.3334 3.83329V5.49996" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.33331 9.66663V14.6666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.6667 9.66663V14.6666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  const iconSpan = document.createElement("span");
  iconSpan.textContent = category.categoryIcon;
  const nameSpan = document.createElement("span");
  nameSpan.textContent = category.name;
  deleteButton.innerHTML = trashIcon;

  categoryInfo.appendChild(iconSpan);
  categoryInfo.appendChild(nameSpan);
  categoryTab.setAttribute("data-category-id", category.id);
  categoryTab.appendChild(categoryInfo);
  categoryTab.appendChild(deleteButton);

  categoryInfo.classList.add("category__info");
  categoryTab.classList.add("category");
  deleteButton.classList.add("category__delete-btn")
  tabContainer.appendChild(categoryTab);
  categoryTab.addEventListener("click", handleCategoryChange(category));
  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteModal("All todos, along with the category itself, will be deletee. Are you sure you want to continue", category.id, true)
  })
}

/**
 *
 * @param {{
 * id: string,
 * name: string,
 * categoryIcon: string,
 * order: string[]
 * }} category
 */
function handleCategoryChange(category) {
  return async (event) => {
    const activeTab = document.querySelector("button.tab--active");
    event.currentTarget.classList.add("tab--active");
    if (!activeTab) return;
    currentCategory = category.id;
    if (activeTab.dataset.categoryId === category.id) return;
    activeTab.classList.remove("tab--active");
    renderHeaderElement(category.id);
    renderProgressBar();
  };
}
export async function renderProgressBar() {
  const todos = await getCategoryTodos(currentCategory, true);
  const todosDone = todos.filter((todo) => todo.status === "done");
  const width =
    todos.length !== 0
      ? `${Math.round((todosDone.length / todos.length) * 100)}%`
      : "0%";

  progressValue.textContent = `${width}`;
  progressBar.animate(
    [
      {
        width,
      },
    ],
    {
      duration: 400,
      fill: "forwards",
      easing: "ease-in-out",
    }
  );
}

async function handleHome(event) {
  currentCategory = "";
  const activeTab = document.querySelector("button.tab--active");
  event.stopPropagation();
  event.currentTarget.classList.add("tab--active");
  activeTab.classList.remove("tab--active");
  renderHeaderElement();
  renderProgressBar();
}

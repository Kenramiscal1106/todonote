import { renderHeaderElement } from "./header.js";
import { getCategoryTodos } from "./index.js";

export let currentCategory = "";

const homeTab = document.querySelector(".sidebar__home-tab");
homeTab.classList.add("tab--active");
homeTab.addEventListener("click", handleHome);
const progressBar = document.querySelector(".progress__bar__value");
const progressValue = document.querySelector(".progress-status");

export function renderCategoryTab(category) {
  const tabContainer = document.querySelector("#category-tabs");
  const categoryTab = document.createElement("button");

  const iconSpan = document.createElement("span");
  iconSpan.textContent = category.categoryIcon;
  const nameSpan = document.createElement("span");
  nameSpan.textContent = category.name;

  categoryTab.appendChild(iconSpan);
  categoryTab.appendChild(nameSpan);
  categoryTab.setAttribute("data-category-id", category.id);

  categoryTab.classList.add("category");
  tabContainer.appendChild(categoryTab);
  categoryTab.addEventListener("click", handleCategoryChange(category));
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

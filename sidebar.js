import { renderHeaderElement } from "./header.js";
// import { getCategories, getCategoryTodos } from "./index.js";

export let currentCategory = "none";

const homeTab = document.querySelector(".sidebar__home-tab");
homeTab.classList.add("tab--active");
homeTab.addEventListener("click", handleHome);

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
  return (event) => {
    const activeTab = document.querySelector("button.tab--active");
    event.target.classList.add("tab--active");
    if (!activeTab) return;
    currentCategory = category.id;
    if (activeTab.dataset.categoryId === category.id) return;
    activeTab.classList.remove("tab--active");
    renderHeaderElement(category);
  };
}

async function handleHome(event) {
  currentCategory = "none";
  const activeTab = document.querySelector("button.tab--active");
  event.target.classList.add("tab--active");
  activeTab.classList.remove("tab--active");
  renderHeaderElement();
}

import { getCategories, getCategoryTodos } from "./index.js";

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

function handleCategoryChange(category) {
  return async (event) => {
    const activeTab = document.querySelector("button.tab--active");
    event.target.classList.add("tab--active");
    console.log(await getCategoryTodos(category.id));

    if (!activeTab) return;
    if (activeTab.dataset.categoryId === category.id) return;

    activeTab.classList.remove("tab--active");
  };
}

async function handleHome(event) {
  const activeTab = document.querySelector("button.tab--active");
  event.target.classList.add("tab--active");
  activeTab.classList.remove("tab--active");
}

import { getCategories, getCategoryTodos } from "./index.js";

export function renderCategoryTab(category) {
  const categoryTabs = document.querySelector("#category-tabs");
  const listElement = document.createElement("button");
  listElement.textContent = category.categoryIcon + " " + category.name;
  categoryTabs.appendChild(listElement);
  listElement.addEventListener("click", async () => {
    console.log(await getCategoryTodos(category.id))
  });
  
}

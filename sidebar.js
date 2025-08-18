import { getCategories } from "./index.js";
window.onload = async () => {
  const categories = await getCategories();
  console.log(categories);
  categories.forEach((category) => {
    renderCategoryTab(category);
  });
};

export function renderCategoryTab(category) {
  const categoryTabs = document.querySelector("#category-tabs");
  const listElement = document.createElement("li");
  listElement.textContent = category.categoryIcon + " " + category.name;
  categoryTabs.appendChild(listElement);
}

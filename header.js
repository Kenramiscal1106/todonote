import { getCategoryTodos } from "./index.js";

const viewTabs = document.querySelector("#view-tabs");
const defaultMode = document.querySelector(".mode");

// viewTabs.firstChild.classList.add("view--active");
// console.log(viewTabs.firstElementChild)
viewTabs.firstElementChild.classList.add("view--active");
defaultMode.classList.add("mode--visible")

const viewTab = Array.from(viewTabs.children);

viewTab.forEach((element) => {
  element.addEventListener("click", () => {
    const targetMode = document.querySelector(`div.mode--${element.dataset.tab}`)
    const activeMode = document.querySelector(".mode--visible");
    const activeTab = document.querySelector(".view--active");
    activeMode.classList.remove("mode--visible")
    activeTab.classList.remove("view--active"); 
    targetMode.classList.add("mode--visible");
    element.classList.add("view--active");
  })
})

/**
 * 
 * @param {{
 * id: string,
 * name: string,
 * categoryIcon: string,
 * order: string[]
 * }} category 
 */
export async function renderHeaderElement(category) {
  const headerTitle = document.querySelector(".categories-info__metadata__title");
    const headerIcon = document.querySelector(".category-info__icon")
    const headerNum = document.querySelector(".categories-info__metadata__num-tasks");
    headerTitle.textContent = category.name;
    headerIcon.textContent = category.categoryIcon;
    const todos = await getCategoryTodos(category.id);
    headerNum.textContent = `${todos.length} tasks`;
}
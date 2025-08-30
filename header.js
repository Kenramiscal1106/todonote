import { getCategory, getCategoryTodos } from "./index.js";
import { currentCategory } from "./sidebar.js";

/**
 * @type {"default" | "calendar" | "kanban"}
 */
export let currentView = "default";


const viewTabs = document.querySelector("#view-tabs");
const defaultMode = document.querySelector(".mode");

viewTabs.firstElementChild.classList.add("view--active");
defaultMode.classList.add("mode--visible");

const viewTab = Array.from(viewTabs.children);
const headerTitle = document.querySelector(".categories-info__metadata__title");
const headerIcon = document.querySelector(".category-info__icon");
const headerNum = document.querySelector(
  ".categories-info__metadata__num-tasks"
);

viewTab.forEach((tab) => {
  tab.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("viewchange", {detail: { tab: tab.dataset.tab}}))
    tab.classList.add("view--active");
  });
});


export async function renderHeaderElement() {
  const category =
    typeof currentCategory === "undefined" ? null : await getCategory(currentCategory);
  headerTitle.textContent = category ? category.name : "Overview";
  headerIcon.textContent = category ? category.categoryIcon : "🧑‍🦱";
  const todos = await getCategoryTodos(category ? category.id : "", true);
  headerNum.textContent = `${todos.length} task/s`;
}

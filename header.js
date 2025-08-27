import { renderContent } from "./content.js";
import { getCategory, getCategoryTodos } from "./index.js";
import { currentCategory } from "./sidebar.js";

/**
 * @type {"default" | "calendar" | "kanban"}
 */
export let currentView = "default";

const headerContainer = document.querySelector(".header__container");

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
  tab.addEventListener("click", async () => {
    const targetMode = document.querySelector(`div.mode--${tab.dataset.tab}`);
    function switchTab(delayed) {
      const activeMode = document.querySelector(".mode--visible");
      const activeTab = document.querySelector(".view--active");
      if (delayed) {
        activeMode.classList.add("mode--transition");
        setTimeout(() => {
          activeMode.classList.remove("mode--visible");
          targetMode.classList.add("mode--visible");
          activeMode.classList.remove("mode--transition");
        }, 500);
      } else {
        activeMode.classList.remove("mode--visible");
        targetMode.classList.add("mode--visible");
      }
      activeTab.classList.remove("view--active");
      tab.classList.add("view--active");
    }
    if (tab.dataset.tab === "default") {
      headerContainer.classList.add("header__container--contained");
    } else {
      headerContainer.classList.remove("header__container--contained");
    }
    if (currentView === "default" || tab.dataset.tab === "default") {
      switchTab(true);
    } else {
      switchTab(false);
    }
    currentView = tab.dataset.tab;
    renderContent();
  });
});

/**
 * @param {string} categoryId
 */
export async function renderHeaderElement(categoryId) {
  const category =
    typeof categoryId === "undefined" ? null : await getCategory(categoryId);
  headerTitle.textContent = category ? category.name : "Overview";
  headerIcon.textContent = category ? category.categoryIcon : "🧑‍🦱";
  const todos = await getCategoryTodos(category ? category.id : "", true);
  headerNum.textContent = `${todos.length} task/s`;
}

import { renderContent } from "./content.js";
import { getCategory, getCategoryTodos } from "./index.js";

/**
 * @type {string}
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

viewTab.forEach((element) => {
  element.addEventListener("click", () => {
    const targetMode = document.querySelector(
      `div.mode--${element.dataset.tab}`
    );
    function action() {
      const activeMode = document.querySelector(".mode--visible");
      const activeTab = document.querySelector(".view--active");
      activeMode.classList.remove("mode--visible");
      activeTab.classList.remove("view--active");
      targetMode.classList.add("mode--visible");
      element.classList.add("view--active");
    }
    if (element.dataset.tab === "default") {
      headerContainer.classList.add("header__container--contained");
    } else {
      headerContainer.classList.remove("header__container--contained");
    }
    if (currentView === "default" || element.dataset.tab === "default") {
      const activeMode = document.querySelector(".mode--visible");
      activeMode.classList.add("mode--transition");
      console.log("runs")
      setTimeout(() => {
        action()
        activeMode.classList.remove("mode--transition")
      }, 500);
    } else {
      action()
    }
    currentView = element.dataset.tab;
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
  renderContent(todos);
}

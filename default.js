import { getCategoryTodos } from "./index.js";
import { currentCategory } from "./sidebar.js";
import { renderTodo } from "./todos.js";

export async function renderDefault() {
  const todos = await getCategoryTodos(currentCategory, true);

  const defaultContainer = document.querySelector(".mode__container--default");
  while (defaultContainer.firstChild) {
    defaultContainer.removeChild(defaultContainer.lastChild);
  }
  todos.forEach((todo) => {
    renderTodo(todo);
  });
}

import { renderTodo } from "./todos.js"

/**
 * 
 * @param {{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
 * }[]} todos 
 */
export function renderContent(todos) {
  const defaultContainer = document.querySelector(".mode__container--default");
  while (defaultContainer.firstChild) {
    defaultContainer.removeChild(defaultContainer.lastChild);
  }
  todos.forEach(todo => {
    renderTodo(todo);
  })
}

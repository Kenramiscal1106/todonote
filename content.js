import { renderCalendar } from "./calendar.js";
import { renderDefault } from "./default.js";
import { currentView } from "./header.js";
import { currentCategory } from "./sidebar.js";
import { renderTodo } from "./todos.js";

export function renderContent() {
  switch (currentView) {
    case "default":
      renderDefault();
      break;
    case "calendar":
      renderCalendar();
      break;
  }
}
/**
 *
 * @param {{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
 * }} todo
 */
export function addContent(todo) {
  if (todo.categoryId !== currentCategory) return;
  switch (currentView) {
    case "default":
      renderTodo(todo);
      break;
  }
}

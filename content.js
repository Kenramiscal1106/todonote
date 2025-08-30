import { renderCalendar } from "./calendar.js";
import { renderDefault } from "./default.js";
import { currentView } from "./index.js";
import { refreshKanban, renderKanbanItem } from "./kanban.js";
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
    case "kanban":
      refreshKanban();
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
 * status: "pending" | "in-progress" | "done"
 * }} todo
 */
export function addContent(todo) {
  if (todo.categoryId !== currentCategory) return;
  switch (currentView) {
    case "default":
      renderTodo(todo);
      break;
    case "kanban":
      renderKanbanItem(todo)
  }
}

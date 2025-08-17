import { deleteTodo } from "./index.js";


/**
 * @param {{
 *  id:ReturnType<typeof crypto.randomUUID>,
 *  taskName:string,
 *  deadline:string,
 *  categoryId: ReturnType<typeof crypto.randomUUID>,
 *  categoryIcon: string
 * }} todo
 */
export function renderTodo(todo) {
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-task-id", todo.id);
  deleteButton.addEventListener("click", deleteTodo);
  deleteButton.textContent = "Delete Todo";

  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo");
  todoContainer.textContent = todo.id + " " + todo.taskName;

  todoContainer.appendChild(deleteButton);
  document.body.appendChild(todoContainer);
}
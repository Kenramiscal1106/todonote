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
  const defaultContainer = document.querySelector(".mode__container--default");
  
  const HOUR = 60,
  MINUTE = 60,
  SECOND = 1000;
  const mainContainer = document.createElement("div");
  const metaContainer = document.createElement("div");
  const metaName = document.createElement("div");
  const metaDeadline = document.createElement("div");
  const actionsContainer = document.createElement("div");
  const actionDone = document.createElement("button");
  const actionEdit = document.createElement("button");
  const actionDelete = document.createElement("button");
  
  function updateDeadline () {
    const deadlineMS = Date.parse(todo.deadline);
    const nowMS = Date.now();
    const beforeMS = deadlineMS - nowMS;
    // console.log(deadlineMS > nowMS);
    if (beforeMS > HOUR * MINUTE * SECOND) {
      metaDeadline.textContent = `${Math.floor(
        beforeMS / (HOUR * MINUTE * SECOND)
      )} hour/s left`;
    } else if (beforeMS > MINUTE * SECOND) {
      metaDeadline.textContent = `${Math.floor(
        beforeMS / (MINUTE * SECOND)
      )} minute/s left`;
    } else if (beforeMS > SECOND) {
      metaDeadline.textContent = `${Math.floor(
        beforeMS / SECOND
      )} second/s left`;
    }
  }
  updateDeadline()

  mainContainer.classList.add("todo");
  metaContainer.classList.add("todo__meta");
  metaName.classList.add("todo__meta__name");
  metaDeadline.classList.add("todo__meta__deadline");
  actionsContainer.classList.add("todo__actions");
  actionDone.classList.add("todo__action--done");
  actionEdit.classList.add("todo__action--edit");
  actionDelete.classList.add("todo__action--delete");

  metaName.textContent = todo.taskName
  setInterval(() => {
    updateDeadline()
  }, 1000);

  metaContainer.appendChild(metaName);
  metaContainer.appendChild(metaDeadline);

  actionsContainer.appendChild(actionDone);
  actionsContainer.appendChild(actionEdit);
  actionsContainer.appendChild(actionDelete);

  mainContainer.appendChild(metaContainer);
  mainContainer.appendChild(actionsContainer);
  // console.log(mainContainer);
  defaultContainer.appendChild(mainContainer);
}
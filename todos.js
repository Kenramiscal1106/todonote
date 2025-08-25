import { renderHeaderElement } from "./header.js";
import { updateTodo } from "./index.js";
import { deleteModal } from "./modal.js";
import { currentCategory, renderProgressBar } from "./sidebar.js";

/**
 * @param {{
 * id: string,
 * taskName: string,
 * deadline: string,
 * categoryId: string,
 * status: "pending" | "ongoing" | "done"
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
  const metaIcon = document.createElement("div");
  const metaDeadlineText = document.createElement("div");
  const actionsContainer = document.createElement("div");
  const actionDone = document.createElement("button");
  const actionEdit = document.createElement("button");
  const actionDelete = document.createElement("button");

  function updateDeadline() {
    const deadlineMS = Date.parse(todo.deadline);
    const nowMS = Date.now();
    const beforeMS = deadlineMS - nowMS;
    if (beforeMS > HOUR * MINUTE * SECOND) {
      metaDeadlineText.textContent = `${Math.floor(
        beforeMS / (HOUR * MINUTE * SECOND)
      )} hour/s left`;
    } else if (beforeMS > MINUTE * SECOND) {
      metaDeadlineText.textContent = `${Math.floor(
        beforeMS / (MINUTE * SECOND)
      )} minute/s left`;
    } else if (beforeMS > SECOND) {
      metaDeadlineText.textContent = `${Math.floor(
        beforeMS / SECOND
      )} second/s left`;
    } else {
      metaDeadlineText.textContent = "Todo is overdue ";
    }
  }

  mainContainer.classList.add("todo");
  metaContainer.classList.add("todo__meta");
  metaName.classList.add("todo__meta__name");
  metaDeadline.classList.add("todo__meta__deadline");
  metaIcon.classList.add("todo__meta__deadline__icon");
  metaDeadlineText.classList.add("todo__meta__deadline__text");
  actionsContainer.classList.add("todo__actions");
  actionDone.classList.add("todo__action--done");
  actionEdit.classList.add("todo__action--edit");
  actionDelete.classList.add("todo__action--delete");
  mainContainer.setAttribute("data-task-id", todo.id);

  metaIcon.innerHTML = `
    <svg
      class="clock"
      width="24"
      height="24"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 16.5C13.6421 16.5 17 13.1422 17 9.00005C17 4.85791 13.6421 1.50005 9.5 1.50005C5.35786 1.50005 2 4.85791 2 9.00005C2 13.1422 5.35786 16.5 9.5 16.5Z"
        stroke="#E5715C"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.5 4.5V9L12.5 10.5"
        stroke="#E5715C"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `;
  updateDeadline();
  metaName.textContent = todo.taskName;
  const interval = setInterval(updateDeadline, 1000);
  actionDone.innerHTML = `
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5 4.5L7.25 12.75L3.5 9"
      stroke="#F9FAFA"
      stroke-wid  th="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>`;
  actionEdit.innerHTML = `
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.5 15H16.25"
      stroke="#F9FAFA"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.875 2.62499C13.1734 2.32662 13.578 2.159 14 2.159C14.2089 2.159 14.4158 2.20015 14.6088 2.2801C14.8019 2.36006 14.9773 2.47725 15.125 2.62499C15.2727 2.77272 15.3899 2.94811 15.4699 3.14114C15.5498 3.33417 15.591 3.54105 15.591 3.74999C15.591 3.95892 15.5498 4.1658 15.4699 4.35883C15.3899 4.55186 15.2727 4.72725 15.125 4.87499L5.75 14.25L2.75 15L3.5 12L12.875 2.62499Z"
      stroke="#F9FAFA"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  `;
  actionDelete.innerHTML = `
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.75 4.5H4.25H16.25"
      stroke="#F9FAFA"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14.75 4.5V15C14.75 15.3978 14.592 15.7794 14.3107 16.0607C14.0294 16.342 13.6478 16.5 13.25 16.5H5.75C5.35218 16.5 4.97064 16.342 4.68934 16.0607C4.40804 15.7794 4.25 15.3978 4.25 15V4.5M6.5 4.5V3C6.5 2.60218 6.65804 2.22064 6.93934 1.93934C7.22064 1.65804 7.60218 1.5 8 1.5H11C11.3978 1.5 11.7794 1.65804 12.0607 1.93934C12.342 2.22064 12.5 2.60218 12.5 3V4.5"
      stroke="#F9FAFA"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 8.25V12.75"
      stroke="#F9FAFA"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11 8.25V12.75"
      stroke="#F9FAFA"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  `;
  actionDelete.addEventListener("click", () => {
    deleteModal("Are you sure you want to delete the todo?", todo.id);
  });
  actionDone.addEventListener("click", () => {
    const newData = {
      ...todo,
      status: "done",
    };
    clearInterval(interval);
    updateTodo(newData)();
    mainContainer.removeChild(metaDeadline);
    mainContainer.classList.add("todo--done");
    renderHeaderElement(currentCategory);
    renderProgressBar();
  });

  metaDeadline.appendChild(metaIcon);
  metaDeadline.appendChild(metaDeadlineText);

  metaContainer.appendChild(metaName);

  actionsContainer.appendChild(actionDone);
  actionsContainer.appendChild(actionEdit);
  actionsContainer.appendChild(actionDelete);

  if (todo.status === "done") {
    mainContainer.classList.add("todo--done");
    clearInterval(interval);
  } else {
    if (todo.deadline !== "") {
      metaContainer.appendChild(metaDeadline);

    }
  }
  mainContainer.appendChild(metaContainer);
  mainContainer.appendChild(actionsContainer);
  // console.log(mainContainer);
  defaultContainer.appendChild(mainContainer);
}

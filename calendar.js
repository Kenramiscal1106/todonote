import { DAYS, MONTH_DATA } from "./constants.js";
import { getCalendarTodos } from "./index.js";
import { currentCategory } from "./sidebar.js";
// import { getCalendarTodos } from "./index.js";
// import { currentCategory } from "./sidebar.js";
// import { isWithinDay } from "./utilities.js";

export let currentMonth = new Date().getMonth();
export async function renderCalendar() {
  const calendarTodos = await getCalendarTodos(currentCategory);
  if (calendarTodos.size === 0) {
    document
      .querySelector(".todos-empty")
      .classList.remove("todos-empty--active");
    return
  }
  


  // during month
  const calendarView = document.querySelector(".mode__container--calendar");
  document.querySelectorAll(".mode__container--calendar > *").forEach((element) => {
    element.remove();
  })

  const calendarInfo = document.createElement("div");
  const calendarHeading = document.createElement("h2");
  const calendarWrapper = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  calendarView.appendChild(calendarInfo);
  calendarView.appendChild(calendarWrapper);
  calendarWrapper.appendChild(thead);
  calendarWrapper.appendChild(tbody);

  DAYS.forEach((day) => {
    const heading = document.createElement("th");
    heading.textContent = day;
    thead.appendChild(heading);
  });
  const [monthData, columns, rows] = generateCalendarMeta();
  const currentDate = new Date();
  const dateToday = currentDate.getDate();
  calendarHeading.textContent = `${monthData.month} ${currentDate.getFullYear()}`;
  calendarInfo.appendChild(calendarHeading);

  for (let i = 0; i < rows; i++) {
    const trElement = document.createElement("tr");
    tbody.appendChild(trElement);
    for (let j = 0; j < columns; j++) {
      const tdElement = document.createElement("td");
      tdElement.setAttribute("data-row", i + 1);
      tdElement.setAttribute("data-column", j);
      trElement.appendChild(tdElement);
    }
  }

  let currentRow = 1;
  for (let i = 0; i < monthData.date; i++) {
    currentDate.setDate(i + 1);
    const day = currentDate.getDay();
    const targetCell = document.querySelector(
      `[data-row="${currentRow}"][data-column="${day}"]`
    );
    if (dateToday === i + 1) {
      targetCell.classList.add("cell--active");
    }
    const taskContainer = document.createElement("div");
    targetCell.textContent = i + 1;
    targetCell.appendChild(taskContainer);

    const tasksKey = `${currentDate.getFullYear()}-${
      currentDate.getMonth() < 10 ? "0" : ""
    }${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const tasks = calendarTodos.has(tasksKey)
      ? calendarTodos.get(tasksKey)
      : [];
    tasks.length !== 0 &&
      tasks.forEach((task) => {
        const mainContainer = document.createElement("div");
        mainContainer.classList.add("task-item");
        mainContainer.textContent = task.taskName;
        taskContainer.appendChild(mainContainer);
      });
    taskContainer.setAttribute("data-monthdate", currentDate.getDate());
    if (day === 6) {
      currentRow++;
    } else {
      // currentColumn ++
    }
  }
}

/**
 *
 * @returns {[{month: string, date: number}, number, number]}
 */
function generateCalendarMeta() {
  const currentDate = new Date();
  currentDate.setMonth(currentMonth);
  const monthIndex = currentMonth;
  const monthData = MONTH_DATA[monthIndex];

  const columns = DAYS.length;
  let rows = 0;
  let unfactoredDays = monthData.date;
  currentDate.setDate(1);
  const firstDate = currentDate.getDay();
  currentDate.setDate(monthData.days);
  const lastDate = currentDate.getDay();
  if (lastDate < 6) {
    unfactoredDays -= lastDate + 1;
    rows++;
  }
  if (firstDate > 0) {
    unfactoredDays -= columns - firstDate;
    rows++;
  }
  rows += unfactoredDays / columns;
  return [monthData, columns, rows];
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
export function renderCalendarTask(todo) {
  if (todo.deadline === "") return;
  const mainContainer = document.createElement("div");
  mainContainer.setAttribute("data-calendar-task-id", todo.id);
  mainContainer.classList.add("task-item")
  mainContainer.textContent = todo.taskName;
  const taskDate = new Date(todo.deadline);
  const taskContainer = document.querySelector(
    `[data-monthdate="${taskDate.getDate()}"]`
  );
  taskContainer.appendChild(mainContainer);
}

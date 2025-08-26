import { DAYS, MONTH_DATA } from "./constants.js";
// import { getCalendarTodos } from "./index.js";
// import { currentCategory } from "./sidebar.js";
// import { isWithinDay } from "./utilities.js";

export function renderCalendar() {
  const calendarContainer = document.querySelector(".mode--calendar");
  // during month
  const calendarWrapper = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  calendarContainer.appendChild(calendarWrapper);
  calendarWrapper.appendChild(thead);
  calendarWrapper.appendChild(tbody);

  DAYS.forEach((day) => {
    const heading = document.createElement("th");
    heading.textContent = day;
    thead.appendChild(heading);
  });
  const [monthData, columns, rows] = generateCalendarMeta();
  const currentDate = new Date();

  for (let i = 0; i < rows; i++) {
    const trElement = document.createElement("tr");
    tbody.appendChild(trElement);
    for (let j = 0; j < columns; j++) {
      const tdElement = document.createElement("td");
      tdElement.setAttribute("data-row", i + 1);
      tdElement.setAttribute("data-column", j + 1);
      trElement.appendChild(tdElement);
    }
  }

  let currentRow = 1;
  for (let i = 0; i < monthData.date; i++) {
    currentDate.setDate(i + 1);
    const day = currentDate.getDay();
    const targetCell = document.querySelector(`[data-row="${currentRow}"][data-column="${day+1}"]`)
    targetCell.textContent = i + 1;
    if (day === 6) {
      currentRow++;
    } else {
      // currentColumn ++
    }
  }
}

renderCalendar();

/**
 *
 * @returns {[Date, {month: string, date: number}, number, number]}
 */
function generateCalendarMeta() {
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
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

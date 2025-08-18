// Kanban Drag and Drop

const lists = document.querySelectorAll(".list");
const statuses = document.querySelectorAll(".status");

let draggedList = null;

lists.forEach((list) => {
  list.addEventListener("dragstart", () => {
    draggedList = list;
    setTimeout(() => (list.style.opacity = "none"), 0);
  });

  list.addEventListener("dragend", () => {
    draggedList.style.display = "block";
    draggedList = null;
  });
});

statuses.forEach((status) => {
  status.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  status.addEventListener("drop", () => {
    if (draggedList) {
      status.appendChild(draggedList);
    }
  });
});
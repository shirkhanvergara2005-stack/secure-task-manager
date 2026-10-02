/* Secure Dynamic Task Manager
   All task markup is built with createElement() and textContent only. */

// ---------- Element references ----------
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const EMPTY_MESSAGE = "Task cannot be empty";
let taskCounter = 0;

// ---------- Helpers ----------
function generateTaskId() {
  let id;
  do {
    taskCounter += 1;
    id = "task-" + taskCounter;
  } while (taskList.querySelector('[data-task-id="' + id + '"]'));
  return id;
}

function showMessage(text) {
  taskMessage.textContent = text;
}

// ---------- Required functions ----------

// Creates and returns one task <li>. Does NOT attach it to the list.
function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.type = "button";
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  taskItem.append(textSpan, completeBtn, editBtn, removeBtn);
  return taskItem;
}

function addTask(taskText) {
  const text = typeof taskText === "string" ? taskText.trim() : "";
  if (text === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }
  const taskItem = createTaskElement(text, generateTaskId());
  taskList.appendChild(taskItem);
  taskInput.value = "";
  showMessage("");
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!textSpan || !editBtn) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;
  editInput.setAttribute("aria-label", "Edit task");

  textSpan.replaceWith(editInput);
  editBtn.textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!editInput || !editBtn) return;

  const newText = editInput.value.trim();
  if (newText === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = newText;

  editInput.replaceWith(textSpan);
  editBtn.textContent = "Edit";
  showMessage("");
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const items = taskList.querySelectorAll(".task-item");
  let completed = 0;
  items.forEach((item) => {
    if (item.dataset.state === "completed") completed += 1;
  });
  totalCount.textContent = items.length;
  completedCount.textContent = completed;
  pendingCount.textContent = items.length - completed;
}

// The single delegated click handler for all task buttons.
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem || !taskList.contains(taskItem)) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const samples = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];
  const fragment = document.createDocumentFragment();
  samples.forEach((text) => {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });
  taskList.appendChild(fragment); // appended once
  showMessage("");
  updateTaskCounts();
}

// ---------- Event wiring ----------
taskList.addEventListener("click", handleTaskListClick); // the only click listener on #taskList

addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask(taskInput.value);
});
loadSamplesBtn.addEventListener("click", loadSampleTasks);

// Keyboard: Enter saves while editing a task
taskList.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches(".edit-input")) {
    saveTaskEdit(event.target.closest(".task-item"));
  }
});

updateTaskCounts();

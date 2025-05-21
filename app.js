const API_URL = "https://jsonplaceholder.typicode.com/todos";
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const doneCount = document.getElementById("doneCount");
const notDoneCount = document.getElementById("notDoneCount");

async function fetchTasks() {
  try {
    const response = await fetch(`${API_URL}?_limit=5`);
    const tasks = await response.json();
    tasks.forEach((task) => renderTask(task));
    updateCounter();
  } catch (error) {
    console.error("Помилка при отриманні задач:", error);
  }
}

async function addTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        title,
        completed: false,
        userId: 1,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const newTask = await response.json();
    renderTask(newTask);
    taskInput.value = "";
    updateCounter();
  } catch (error) {
    console.error("Помилка при створенні задачі:", error);
  }
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task";
  li.dataset.id = task.id;

  const span = document.createElement("span");
  span.textContent = task.title;
  if (task.completed) span.classList.add("completed");

  span.addEventListener("click", () => toggleComplete(task, span));

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.onclick = () => editTask(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.onclick = () => deleteTask(task.id, li);

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

async function toggleComplete(task, span) {
  task.completed = !task.completed;
  try {
    await fetch(`${API_URL}/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: task.completed }),
      headers: { "Content-Type": "application/json" },
    });
    span.classList.toggle("completed");
    updateCounter();
  } catch (error) {
    console.error("Помилка при оновленні статусу:", error);
  }
}

function editTask(span) {
  const newTitle = prompt("Редагувати задачу:", span.textContent);
  if (newTitle) {
    span.textContent = newTitle;
  }
}

async function deleteTask(id, element) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    element.remove();
    updateCounter();
  } catch (error) {
    console.error("Помилка при видаленні задачі:", error);
  }
}

function updateCounter() {
  const tasks = document.querySelectorAll("#taskList li");
  let done = 0;
  tasks.forEach((task) => {
    const span = task.querySelector("span");
    if (span.classList.contains("completed")) done++;
  });
  doneCount.textContent = done;
  notDoneCount.textContent = tasks.length - done;
}
addBtn.addEventListener("click", addTask);
fetchTasks();

document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  const savedTheme = localStorage.getItem("theme");

  if (storedTasks) {
    storedTasks.forEach((task) => tasks.push(task));
    updateTaskList();
    updateStats();
  }

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.querySelector("#theme-switch").checked = savedTheme === "dark";
  }
});

const themeSwitch = document.querySelector("#theme-switch");

themeSwitch.addEventListener("change", () => {
  const theme = themeSwitch.checked ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
});

const taskInput = document.querySelector("#task-input");
const newTask = document.querySelector("#new-Task");
const taskList = document.querySelector(".task-list");
const progessBar = document.querySelector("#progress");
const numbers = document.querySelector("#numbers");
let tasks = [];
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
const addNewTask = () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text: text, completed: false });
  }
  updateTaskList();
  updateStats();
  saveTasks();
};

const toggleTaskCompleted = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTaskList();
  updateStats();
  saveTasks();
};

const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateTaskList();
  updateStats();
  saveTasks();
};

const editTask = (index) => {
  const taskInput = document.querySelector("#task-input");

  taskInput.value = tasks[index].text;
  tasks.splice(index, 1);
  updateTaskList();
  updateStats();
  saveTasks();
};

const updateStats = () => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  progessBar.style.width = `${progress}%`;

  numbers.innerHTML = `${completedTasks} / ${totalTasks}`;

  if (tasks.length && completedTasks === totalTasks) {
    celebriteConfetti();
  }
};

const updateTaskList = () => {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
  <div class="taskList">
      <div class="task  ${task.completed ? "completed" : ""}">
          <input type="checkbox" class="checkbox" ${
            task.completed ? "checked" : ""
          } >
          <p>${task.text}</p>
  
      </div>
          <div class="icons">
              <i class="fa-regular fa-pen-to-square" onClick="editTask(${index})"></i>
              <i class="fas fa-trash-alt" onClick="deleteTask(${index})" ></i>
          </div>
      </div>`;
    listItem.addEventListener("change", () => toggleTaskCompleted(index));
    taskList.append(listItem);
  });
};

newTask.addEventListener("click", (e) => {
  e.preventDefault();
  addNewTask();
});

const celebriteConfetti = () => {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["heart"],
    colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
  };

  confetti({
    ...defaults,
    particleCount: 50,
    scalar: 2,
  });

  confetti({
    ...defaults,
    particleCount: 25,
    scalar: 3,
  });

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 4,
  });
};

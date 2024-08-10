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
  const priority = document.querySelector("#priority-select").value;
  const date = new Date().toISOString(); // Add current date
  if (text) {
    tasks.push({
      text: text,
      completed: false,
      priority: priority,
      date: date,
    });
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

const sortTasks = (tasks) => {
  const sortValue = document.querySelector("#sort-select").value;
  return tasks.sort((a, b) => {
    if (sortValue === "priority") {
      const priorities = { high: 1, medium: 2, low: 3 };
      return priorities[a.priority] - priorities[b.priority];
    } else if (sortValue === "date") {
      return new Date(a.date) - new Date(b.date);
    }
  });
};

const filterTasks = (tasks) => {
  const filterValue = document.querySelector("#filter-select").value;
  switch (filterValue) {
    case "completed":
      return tasks.filter((task) => task.completed);
    case "pending":
      return tasks.filter((task) => !task.completed);
    default:
      return tasks;
  }
};

const updateTaskList = () => {
  let filteredTasks = filterTasks(tasks);
  filteredTasks = sortTasks(filteredTasks);

  taskList.innerHTML = "";
  filteredTasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div class="taskList">
          <div class="task ${task.completed ? "completed" : ""}">
              <input type="checkbox" class="checkbox" ${
                task.completed ? "checked" : ""
              }>
              <p>${task.text} <span class="priority ${task.priority}">(${
      task.priority
    })</span></p>
          </div>
          <div class="icons">
              <i class="fa-regular fa-pen-to-square" onClick="editTask(${index})"></i>
              <i class="fas fa-trash-alt" onClick="deleteTask(${index})"></i>
          </div>
      </div>`;
    listItem.addEventListener("change", () => toggleTaskCompleted(index));
    taskList.append(listItem);
  });
};

// Attach event listeners to the filter and sort dropdowns
document
  .querySelector("#filter-select")
  .addEventListener("change", updateTaskList);
document
  .querySelector("#sort-select")
  .addEventListener("change", updateTaskList);

newTask.addEventListener("click", (e) => {
  e.preventDefault();
  addNewTask();
});

const celebriteConfetti = () => {
  const duration = 3000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
};

// === Tasks container ===
const showtasks = document.getElementById("showtasks");
const addbtn = document.getElementById("addbtn");

// === Date setup ===
const today = new Date().toISOString().split("T")[0];
duedate.value = today;
duedate.min = today;

let tasks = [];
let firsttime = true;

addbtn.addEventListener("click", function (e) {
  e.preventDefault();

  let task = {
    id: Math.random().toString(36).substring(2, 9),
    description: document.getElementById("description").value,
    duedate: document.getElementById("duedate").value,
    priority: document.getElementById("priority").value,
    subject: document.getElementById("subject").value,
    completed: false,
  };

  tasks.unshift(task);
  addtask(task);
  saveTasks();
  clearinps();
  CounterTasks();
});

function clearinps() {
  document.getElementById("description").value = "";
  document.getElementById("priority").value = "Low";
  document.getElementById("subject").value = "";
  document.getElementById("duedate").value = today;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    tasks.forEach((task) => {
      addtask(task);
    });
  }
  CounterTasks();
}

function addtask(tsk) {
  if (firsttime) {
    showtasks.innerHTML = "";
    firsttime = false;
  }
  
  TaskStructure(tsk);
}

function TaskStructure(tsk) {
  // task div
  let newtask = document.createElement("div");
  newtask.id = "task";

  let checkinp = document.createElement("input");
  checkinp.type = "checkbox";
  checkinp.id = `checkbox-${tsk.id}`;
  checkinp.classList.add("didit");
  checkinp.checked = tsk.completed;

  // idk1
  let idk1 = document.createElement("div");
  idk1.id = "idk1";

  let taskdesc = document.createElement("h4");
  taskdesc.innerHTML = tsk.description;

  const duedate = document.getElementById("duedate").value;
  let duedatep = document.createElement("p");
  duedatep.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${duedate} <i class="fa-regular fa-clock"></i>  Due on ${duedate}`;

  // assembeling idk1
  idk1.appendChild(taskdesc);
  idk1.appendChild(duedatep);

  // idk2
  let idk2 = document.createElement("div");
  idk2.id = "idk2";

  let taskpriority = document.createElement("h6");
  taskpriority.innerHTML = tsk.priority;
  if (taskpriority.innerHTML == "Low") {
    taskpriority.classList.add("low");
  } else if (taskpriority.innerHTML == "Medium") {
    taskpriority.classList.add("medium");
  } else {
    taskpriority.classList.add("high");
  }

  let tasksubj = document.createElement("h6");
  tasksubj.innerHTML = tsk.subject;
  tasksubj.id = "subj";

  let trachicon = document.createElement("i");
  trachicon.classList.add("fa-solid", "fa-trash");
  trachicon.addEventListener("click", function () {
    // Remove from tasks array
    const taskIndex = tasks.findIndex((t) => t.id === tsk.id);
    alert("Are you sure you want to delete this task?");
    if (confirm) {
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
        saveTasks(); // Update localStorage
      }

      newtask.remove(); // Remove from DOM

      if (tasks.length === 0) {
        let noTasksMessage = document.createElement("h3");
        noTasksMessage.innerText = "No tasks match your filters";
        showtasks.appendChild(noTasksMessage);
        firsttime = true;
      }
      CounterTasks();
      applyFilters();
    }
  });

  // assembling idk2
  idk2.appendChild(taskpriority);
  idk2.appendChild(tasksubj);
  idk2.appendChild(trachicon);

  //assembling task div
  newtask.appendChild(checkinp);
  newtask.appendChild(idk1);
  newtask.appendChild(idk2);

  // Function to apply completed styles
  function applyCompletedStyle(isCompleted) {
    if (isCompleted) {
      newtask.style.backgroundColor = "#5857573f";
      taskdesc.style.textDecoration = "line-through";
      taskdesc.style.color = "#5857574f";
      duedatep.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${tsk.duedate} <i class="fa-regular fa-clock"></i>  Completed`;
    } else {
      newtask.style.backgroundColor = "white";
      taskdesc.style.textDecoration = "none";
      taskdesc.style.color = "black";
      duedatep.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${tsk.duedate} <i class="fa-regular fa-clock"></i>  Due on ${tsk.duedate}`;
    }
    CounterTasks();
  }

  // Apply initial style based on saved state
  applyCompletedStyle(tsk.completed);

  // check status
  checkinp.addEventListener("change", () => {
    // Update the task's completed status
    tsk.completed = checkinp.checked;

    // Update the task in the tasks array
    const taskIndex = tasks.findIndex((t) => t.id === tsk.id);
    if (taskIndex > -1) {
      tasks[taskIndex].completed = checkinp.checked;
      saveTasks(); // Save to localStorage
    }
    CounterTasks();
    // Apply visual changes
    applyCompletedStyle(checkinp.checked);
    applyFilters();
  });
  
  CounterTasks();

  //showtask
  return showtasks.prepend(newtask);
}

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
});

// Task Counters
const countTotal = document.getElementById("countTotal");
const countCompleted = document.getElementById("countCompleted");
const countPending = document.getElementById("countPending");

function CounterTasks() {
  // Total
  let total = tasks.length;
  countTotal.innerHTML = total;
  //Completed
  let completed = tasks.filter((task) => task.completed).length;
  countCompleted.innerHTML = completed;
  //Pending
  let pending = tasks.filter((task) => !task.completed).length;
  countPending.innerHTML = pending;
}

// Task Filters
const PriorityFilter = document.getElementById("priorityFilter");
const StatusFilter = document.getElementById("statusFilter");
// Combined filter function that applies both filters
function applyFilters() {
  const priorityValue = PriorityFilter.value;
  const statusValue = StatusFilter.value;
  
  const filteredTasks = tasks.filter((task) => {
    // Check priority filter
    let priorityMatch = true;
    if (priorityValue !== "All Priorities") {
      priorityMatch = task.priority === priorityValue;
    }
    
    // Check status filter
    let statusMatch = true;
    if (statusValue === "Completed") {
      statusMatch = task.completed;
    } else if (statusValue === "Pending") {
      statusMatch = !task.completed;
    }
    // If statusValue === "All Tasks", statusMatch stays true
    
    // Task must match both filters
    return priorityMatch && statusMatch;
  });
  
  // Display results
  if (filteredTasks.length === 0) {
    showtasks.innerHTML = "<h3>No tasks match your filters</h3>";
    firsttime = true;
  } else {
    showtasks.innerHTML = "";
    for (let tsk of filteredTasks) {
      TaskStructure(tsk);
    }
  }
}
// Add event listeners that call the combined function
PriorityFilter.addEventListener("change", applyFilters);
StatusFilter.addEventListener("change", applyFilters);




// random quote generator
const quotecontent = document.getElementById("quotecontent");
const quoteauthor = document.getElementById("quoteauthor");
const apiurl = "https://thequoteshub.com/api/";

async function fetchquote(url) {
  const response = await fetch(url);
  var data = await response.json();
  quotecontent.innerHTML = data.text;
  quoteauthor.innerHTML = data.author;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchquote(apiurl);
});

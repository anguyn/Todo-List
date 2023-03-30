// Get Elements
var notyf = new Notyf({
  duration: 100000,
  position: {
    x: "right",
    y: "bottom",
  },
  dismissible: true,
});

let date = document.querySelector("#today");

let taskInput = document.querySelector(".todolist-input-add");

let addBtn = document.getElementsByTagName("button")[0];

let pendingTasksList = document.getElementById("pending-list-tasks");

let doneTasksList = document.getElementById("done-list-tasks");

let dashboardListName = document.getElementById("dashboard-info-list-name");

let dashboardListValue = document.getElementById("dashboard-info-done");

let deleteAll = document.querySelector(".dashboard-info-list-delete");

let overlay = document.querySelector(".overlay");

let popup = document.querySelector(".edit-popup");

let closeBtn = document.getElementById("close-button");

let saveBtn = document.getElementById("save-button");

let editInput = document.getElementById("edit-input");

today.innerText = new Date().toLocaleDateString("en-GB");

/* THIS IS DRAG-ZONE FUNCTIONS */

let draggedItemIndex;

// Functions for dragging feature
const handleDragStart = (e) => {
  // e.preventDefault();
  // e.dataTransfer.setData("text/plain", e.target.id);
  // const target = e.target.closest("li");
  // if (!target) return;
  // e.dataTransfer.setData("text/plain", "");
  // e.dataTransfer.effectAllowed = "move";
  // draggingTask = e.target;
  draggedItemIndex = parseInt(e.target.dataset.taskId);
  e.dataTransfer.setData("text/plain", "");
};

const handleDragEnd = (e) => {
  e.target.classList.remove("dragging");
  e.target.classList.remove("dragging-enter");
};

const handleDragOver = (e) => {
  e.preventDefault();
  // e.dataTransfer.dropEffect = "move";
  // return false;
};

const handleDragEnter = (e) => {
  // e.preventDefault();
  if (e.target.classList.contains("pending-task")) {
    e.target.classList.add("dragging-enter");
  }
};

const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.target.classList.remove("dragging-enter");
};

const handleDrop = (e) => {
  // e.preventDefault();
  e.target.classList.remove("dragging-enter");

  // const dropzone = e.currentTarget;
  // const droppedTask = e.target;

  // if (draggingTask !== droppedTask) {
  //   dropzone.insertBefore(draggingTask, droppedTask.nextSibling);
  // }

  const target = e.currentTarget;
  const listItems = Array.from(target.querySelectorAll("li"));
  const dropIndex = parseInt(e.target.dataset.taskId);
  const droppedItem = listItems[dropIndex];
  const draggedItem = listItems[draggedItemIndex];
  // console.log(draggedItem);
  // console.log(listItems[dropIndex]);
  listItems.splice(dropIndex, 1, draggedItem);
  listItems.splice(draggedItemIndex, 1, droppedItem);
  // listItems.splice(dropIndex + 1, 1);
  // listItems.splice(draggedItemIndex, 0, droppedItem);
  // console.log(listItems);
  target.innerHTML = "";
  listItems.forEach((item, index) => {
    item.dataset.taskId = index;
    target.appendChild(item);
  });
  updateTasks();
};

// Create a task element
const createNewTask = (task, completed, priority) => {
  let listItem = document.createElement("li");

  let checkbox = document.createElement("input");
  let label = document.createElement("label");
  let div_btn = document.createElement("div");
  let div_label = document.createElement("div");

  let prioritizedBtn = document.createElement("button");

  let editBtn = document.createElement("button"); // xu ly sau

  let deleteBtn = document.createElement("button");

  let btn_container = document.createElement("div");
  let div_container = document.createElement("div");

  // get value for label
  label.innerText = task;

  // get type attributes for elements
  checkbox.type = "checkbox";

  // editInput.type = "text";

  prioritizedBtn.innerHTML =
    '<span class="icon_edit"><i class="fa-solid fa-star" style="color: #fff700;"</i></i></span>';
  prioritizedBtn.className = "todolist-btn-prioritized";

  editBtn.innerHTML =
    '<span class="icon_edit"><i class="fa-sharp fa-solid fa-pen-to-square"></i></span>';
  editBtn.className = "todolist-btn-edit";

  // editBtn.setAttribute(
  //   "data-task-id",
  //   pendingTasksList.querySelectorAll("li").length + 1
  // );

  deleteBtn.innerHTML =
    '<span class="icon_edit"><i class="fa-sharp fa-solid fa-trash"></i></span>';
  deleteBtn.className = "todolist-btn-delete";

  //add class elements
  if (!completed) {
    label.classList = "pending-task-name";
    checkbox.classList = "pending-task-checkbox";
    prioritizedBtn.classList.remove("hide");
    listItem.classList = "pending-task";
    listItem.setAttribute("draggable", true);
    listItem.setAttribute("title", "Drag me inside pending tasks");
    listItem.addEventListener("dragstart", handleDragStart);
    listItem.addEventListener("dragend", handleDragEnd);
    listItem.addEventListener("dragenter", handleDragEnter);
    listItem.addEventListener("dragover", handleDragOver);
    listItem.addEventListener("dragleave", handleDragLeave);
  } else {
    listItem.classList = "done-task";
    label.classList = "done-task-name";
    checkbox.classList = "done-task-checkbox";
    prioritizedBtn.classList.add("hide");
  }

  div_label.classList = "todolist-container-label-task";
  div_btn.classList = "todolist-container-btn";
  //append to listItem
  div_label.appendChild(checkbox);
  div_label.appendChild(label);
  // listItem.appendChild(editInput);

  btn_container.appendChild(prioritizedBtn);
  btn_container.appendChild(editBtn);
  btn_container.appendChild(deleteBtn);

  div_btn.appendChild(btn_container);

  div_container.appendChild(div_label);
  div_container.appendChild(div_btn);

  listItem.appendChild(div_container);

  listItem.setAttribute(
    "data-task-id",
    pendingTasksList.querySelectorAll("li").length
  );

  if (priority) listItem.classList.add("pending-task-color");

  // listItem.addEventListener("dar", handleDragLeave);

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      pendingTasksList.removeChild(listItem);
      listItem.classList.remove("pending-task");
      listItem.querySelector("label").classList.remove("pending-task-name");
      listItem.classList.add("done-task");
      listItem.querySelector("label").classList.add("done-task-name");
      prioritizedBtn.classList.add("hide");
      if (listItem.classList.contains("pending-task-color")) {
        listItem.classList.remove("pending-task-color");
      }
      doneTasksList.appendChild(listItem);
      updateTasks();
    } else {
      doneTasksList.removeChild(listItem);
      listItem.classList.remove("done-task");
      listItem.querySelector("label").classList.remove("done-task-name");
      listItem.classList.add("pending-task");
      listItem.querySelector("label").classList.add("pending-task-name");
      prioritizedBtn.classList.remove("hide");
      pendingTasksList.appendChild(listItem);
      updateTasks();
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (checkbox.checked) {
      doneTasksList.removeChild(listItem);
      updateTasks();
      displayTask();
    } else {
      pendingTasksList.removeChild(listItem);
      updateTasks();
    }
  });

  prioritizedBtn.addEventListener("click", () => {
    let check = listItem.classList.contains("pending-task-color");
    if (check) {
      pendingTasksList.removeChild(listItem);
      listItem.classList.remove("pending-task-color");
      pendingTasksList.append(listItem);
    } else {
      pendingTasksList.removeChild(listItem);
      listItem.classList.add("pending-task-color");
      pendingTasksList.prepend(listItem);
    }
    updateTasks();
  });

  editBtn.addEventListener("click", (event) => {
    const taskId = editBtn.closest("li").getAttribute("data-task-id");
    popup.dataset.taskId = taskId;
    // show the overlay and editing popup
    overlay.style.display = "block";
    popup.style.display = "flex";
    // set the current task and input value
    editInput.value = listItem.querySelector("label").innerText;
  });

  closeBtn.addEventListener("click", (e) => {
    // hide the overlay and editing popup
    overlay.classList.add("unactive");
    popup.classList.add("unactive");
    setTimeout(() => {
      overlay.classList.remove("unactive");
      popup.classList.remove("unactive");
      overlay.style.display = "none";
      popup.style.display = "none";
    }, 300);
  });

  saveBtn.addEventListener("click", () => {
    const taskId = popup.dataset.taskId;
    // update the task label
    let saveText = document
      .querySelector(`[data-task-id="${taskId}"]`)
      .querySelector("label");

    overlay.style.display = "none";
    popup.style.display = "none";
    if (editInput.value !== "") {
      saveText.innerText = editInput.value.trim();
      swal("Thành công, dữ liệu của bạn đã thay đổi", {
        icon: "success",
      });
    } else {
      swal("Bạn chưa thay đổi dữ liệu nào", {
        icon: "info",
      });
    }

    updateTasks();
  });

  return listItem;
};

// Update tasks
const updateTasks = () => {
  let tasks = [];
  for (const taskElement of pendingTasksList.children) {
    tasks.push({
      taskLabel: taskElement.innerText,
      completed: false,
      priority: taskElement.classList.contains("pending-task-color"),
    });
  }

  for (const taskElement of doneTasksList.children) {
    tasks.push({
      taskLabel: taskElement.innerText,
      completed: true,
      priority: false,
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  const dashboard = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];
  dashboardListName.innerText = dashboard.length;
  dashboardListValue.innerText = dashboard.filter(
    (task) => task.completed
  ).length;
};

const dragItem = (firstIndex, secondIndex) => {
  console.log(firstIndex, secondIndex);
};

// Add a task
const addTask = () => {
  //Create new list item with value input
  if (taskInput.value === "") {
    notyf.error("Please enter a value for your task!");
    return;
  }

  let listItem = createNewTask(taskInput.value);
  // Append listItem to pendingTaskLists
  pendingTasksList.appendChild(listItem);

  // Save to local storage
  let incompleteTask = {
    // id: pendingTasksList.querySelectorAll("li").length,
    taskLabel: listItem.querySelector("label").innerText,
    completed: false,
    priority: false,
  };

  let existingTasks = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];
  existingTasks.push(incompleteTask);
  localStorage.setItem("tasks", JSON.stringify(existingTasks));
  const dashboard = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];
  dashboardListName.innerText = dashboard.length;
  dashboardListValue.innerText = dashboard.filter(
    (task) => task.completed
  ).length;
  taskInput.value = "";
};

// Display all of the tasks
const displayTask = () => {
  const tasks = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];
  if (tasks) {
    // Convert savedTasks to an array
    tasks.forEach((task) => {
      const listItemSaved = createNewTask(
        task.taskLabel,
        task.completed,
        task.priority
      );
      // console.log(task)
      if (task.completed) {
        doneTasksList.appendChild(listItemSaved);
        listItemSaved.querySelector('input[type="checkbox"]').checked = true;
      } else {
        pendingTasksList.appendChild(listItemSaved);
      }
    });
  }
  const dashboard = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];
  dashboardListName.innerText = dashboard.length;
  dashboardListValue.innerText = dashboard.filter(
    (task) => task.completed
  ).length;
};

// Add enter keypress event
document
  .querySelector("#todolist-input-add")
  .addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const item = document.querySelector("#todolist-input-add");
      addTask(item);
    }
  });

// Show the add button
addBtn.addEventListener("click", () => {
  if (taskInput.classList.contains("todolist-input-add-hidden")) {
    taskInput.classList.remove("todolist-input-add-hidden");
    taskInput.classList.add("todolist-input-add");
  } else {
    addTask();
  }
});

// Delete all tasks from localStorage
const handleDeleteAll = () => {
  localStorage.removeItem("tasks");
  swal("Success, your data has been updated!", {
    icon: "success",
  });
  setTimeout(() => {
    location.reload();
  }, 2000);
};

deleteAll.addEventListener("click", () => {
  swal({
    title: "Are you sure want to delete all of your tasks",
    text: "When confirmed, you will not be able to restore the current data!",
    icon: "warning",
    buttons: ["Cancel", "Confirm"],
    dangerMode: true,
  }).then((value) => {
    if (value) {
      handleDeleteAll();
    } else {
      swal("Your data hasn't been deleted yet!");
    }
    displayTask();
  });
});

// Window onload
window.onload = () => {
  displayTask();
};

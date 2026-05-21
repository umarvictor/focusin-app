const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

let tasks = [];

function addTask(){

    const taskInput = document.getElementById("taskInput");
    const taskTime = document.getElementById("taskTime");

    const taskName = taskInput.value.trim();
    const time = taskTime.value;

    if(taskName === ""){
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        time: time,
        completed: false
    };

    tasks.push(task);

    renderTasks();

    taskInput.value = "";
    taskTime.value = "";
}

function renderTasks(){

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task-item");

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div>
                <strong>${task.name}</strong>
                <br>
                <small>${task.time}</small>
            </div>

            <button onclick="toggleTask(${task.id})">
                ${task.completed ? "Completed" : "Mark Done"}
            </button>
        `;

        taskList.appendChild(li);

    });

    updateProgress();
}

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){
            task.completed = !task.completed;
        }

        return task;
    });

    renderTasks();
}

function updateProgress(){

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(task => task.completed).length;

    const percentage = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    progressText.innerText = `${percentage}% Completed`;

    progressFill.style.width = `${percentage}%`;
}
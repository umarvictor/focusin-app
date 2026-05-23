const taskList =
document.getElementById("taskList");

const progressText =
document.getElementById("progressText");

const progressFill =
document.getElementById("progressFill");

const motivationMessage =
document.getElementById("motivationMessage");

const totalTasksDisplay =
document.getElementById("totalTasks");

const completedTasksDisplay =
document.getElementById("completedTasks");

const productivityScore =
document.getElementById("productivityScore");

const streakCount =
document.getElementById("streakCount");

const currentDate =
document.getElementById("currentDate");

const aiInsight =
document.getElementById("aiInsight");

const today = new Date();

currentDate.innerText =
today.toDateString();

let tasks =
JSON.parse(localStorage.getItem("tasks"))
|| [];

let streak =
JSON.parse(localStorage.getItem("streak"))
|| 0;

renderTasks();

function addTask(){

    const taskInput =
    document.getElementById("taskInput");

    const taskTime =
    document.getElementById("taskTime");

    const taskPriority =
    document.getElementById("taskPriority");

    const taskName =
    taskInput.value.trim();

    const time =
    taskTime.value.trim();

    const priority =
    taskPriority.value;

    if(taskName === ""){
        alert("Please enter a task");
        return;
    }

    const task = {

        id: Date.now(),

        name: taskName,

        time: time || "No Time",

        priority: priority,

        completed:false
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    notifyUser(task.name);

    taskInput.value = "";
    taskTime.value = "";
}

function renderTasks(){

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li =
        document.createElement("li");

        li.classList.add("task-item");

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `

        <div class="task-left">

            <h3 class="task-title">
                ${task.name}
            </h3>

            <div class="task-meta">

                <span>
                    ⏰ ${task.time}
                </span>

                <span class="
                    priority
                    ${task.priority.toLowerCase()}
                ">
                    ${task.priority}
                </span>

            </div>

        </div>

        <div class="task-buttons">

            <button
                class="complete-btn"
                onclick="toggleTask(${task.id})"
            >
                ${
                    task.completed
                    ? "Completed"
                    : "Mark Done"
                }
            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                Delete
            </button>

        </div>
        `;

        taskList.appendChild(li);
    });

    updateProgress();
}

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){
            task.completed =
            !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();
}

function deleteTask(id){

    tasks = tasks.filter(task =>
        task.id !== id
    );

    saveTasks();

    renderTasks();
}

function updateProgress(){

    const totalTasks =
    tasks.length;

    const completedTasks =
    tasks.filter(task =>
        task.completed
    ).length;

    const percentage =
    totalTasks === 0
    ? 0
    : Math.round(
        (completedTasks / totalTasks)
        * 100
    );

    progressText.innerText =
    `${percentage}% Completed`;

    progressFill.style.width =
    `${percentage}%`;

    totalTasksDisplay.innerText =
    totalTasks;

    completedTasksDisplay.innerText =
    completedTasks;

    productivityScore.innerText =
    `${percentage}%`;

    if(percentage === 100 && totalTasks > 0){

        motivationMessage.innerText =
        "Excellent work today!";

        streak++;

    }
    else if(percentage >= 70){

        motivationMessage.innerText =
        "You're doing great!";
    }
    else if(percentage >= 40){

        motivationMessage.innerText =
        "Keep pushing!";
    }
    else{

        motivationMessage.innerText =
        "Let's focus and complete tasks!";
    }

    streakCount.innerText =
    `${streak}🔥`;

    localStorage.setItem(
        "streak",
        JSON.stringify(streak)
    );

    generateAIInsight(
        percentage,
        completedTasks,
        totalTasks
    );
}

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function generateAIInsight(
    percentage,
    completed,
    total
){

    if(total === 0){

        aiInsight.innerText =
        "Start adding tasks to receive productivity insights.";

        return;
    }

    if(percentage === 100){

        aiInsight.innerText =
        "Outstanding productivity today. Your consistency level is excellent.";

    }
    else if(percentage >= 70){

        aiInsight.innerText =
        "You tend to maintain strong focus during productive sessions.";

    }
    else if(percentage >= 40){

        aiInsight.innerText =
        "Your productivity is moderate today. Reducing distractions may help.";

    }
    else{

        aiInsight.innerText =
        "Your productivity appears low today. Try using Focus Mode and Pomodoro sessions.";
    }
}

/* POMODORO TIMER */

let timer;
let timeLeft = 1500;

const timerDisplay =
document.getElementById("timer");

function updateTimerDisplay(){

    const minutes =
    Math.floor(timeLeft / 60);

    const seconds =
    timeLeft % 60;

    timerDisplay.innerText =
    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

updateTimerDisplay();

function startTimer(){

    if(timer) return;

    timer = setInterval(() => {

        timeLeft--;

        updateTimerDisplay();

        if(timeLeft <= 0){

            clearInterval(timer);

            timer = null;

            alert("Pomodoro Session Completed!");
        }

    },1000);
}

function pauseTimer(){

    clearInterval(timer);

    timer = null;
}

function resetTimer(){

    clearInterval(timer);

    timer = null;

    timeLeft = 1500;

    updateTimerDisplay();
}

/* FOCUS MODE */

const focusBtn =
document.getElementById("focusModeBtn");

focusBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "focus-mode"
        );

        if(
            document.body.classList.contains(
                "focus-mode"
            )
        ){
            focusBtn.innerText =
            "Exit Focus Mode";
        }
        else{
            focusBtn.innerText =
            "Enter Focus Mode";
        }
    }
);

/* NOTIFICATIONS */

function notifyUser(taskName){

    if(Notification.permission === "granted"){

        new Notification(
            "New Task Added",
            {
                body:
                `${taskName} added successfully`
            }
        );
    }
}

if(Notification.permission !== "granted"){

    Notification.requestPermission();
}

/* WEEKLY ANALYTICS */

const ctx =
document.getElementById(
    "analyticsChart"
);

new Chart(ctx,{

    type:"line",

    data:{

        labels:[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ],

        datasets:[{

            label:"Productivity",

            data:[
                45,
                60,
                75,
                50,
                80,
                95,
                70
            ],

            borderColor:"#3b82f6",

            backgroundColor:
            "rgba(59,130,246,0.2)",

            tension:0.4,

            fill:true
        }]
    },

    options:{
        responsive:true
    }
});
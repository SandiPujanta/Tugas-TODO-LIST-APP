const input            = document.getElementById("list");
const button        = document.getElementById("bot");
const ul            = document.getElementById("ul");
const counterDone   = document.getElementById("done");
const counterUndone = document.getElementById("undone");
const historyList   = document.getElementById("history");
const calendarGrid  = document.getElementById("calendar-grid");
const monthYear     = document.getElementById("monthYear");
const calendarTasks = document.getElementById("calendarTasks");
const deadlineInput = document.getElementById("deadlineInput");

let completedCount  = 0;
let tasks           = []; 
let currentMonth    = new Date().getMonth();
let currentYear     = new Date().getFullYear();

function updateCounters() {
    const done = tasks.filter(t => t.completed).length;
    const undone = tasks.length - done;
    counterDone.textContent = done;
    counterUndone.textContent = undone;
}


button.addEventListener("click", () => {
    const text = input.value.trim();
    const date = deadlineInput.value;
    if (!text) return showToast("Mohon tambahkan tugas!");
    if (!date) return showToast("Mohon tambahkan deadline!");

    const task = {text, date, completed: false};
    tasks.push(task);
    renderList();
    renderCalendar();
    input.value = "";
    deadlineInput.value = "";
});


function renderList() {
    ul.innerHTML = "";
    tasks.forEach((t, idx) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = t.text;
        if (t.completed) span.classList.add("completed");

        const checkBtn = document.createElement("button");
        checkBtn.textContent = "✔";
        checkBtn.classList.add("check");
        checkBtn.addEventListener("click", () => {
            t.completed = true;
            span.classList.add("completed");
            showToast(`Task "${t.text}" selesai!`);
            renderCalendar();
            updateCounters();
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "✖";
        delBtn.classList.add("delete");
        delBtn.addEventListener("click", () => {
            tasks.splice(idx,1);
            renderList();
            renderCalendar();
            updateCounters();
        });

        const btnGroup = document.createElement("div");
        btnGroup.classList.add("btn-group");
        btnGroup.appendChild(checkBtn);
        btnGroup.appendChild(delBtn);

        li.appendChild(span);
        li.appendChild(btnGroup);
        ul.appendChild(li);
    });
    updateCounters();
}

function renderCalendar() {
    calendarGrid.innerHTML = "";
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    monthYear.textContent = firstDay.toLocaleString("id-ID", { month: "long", year: "numeric"});

    // Offset
    for (let i = 0; i < firstDay.getDay(); i++) calendarGrid.innerHTML += `<div></div>`;

    for (let date = 1; date <= lastDate; date++) {
        const fullDate = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
        const hasDeadline = tasks.some(t => t.date===fullDate && !t.completed);
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day" + (hasDeadline ? " deadline" : "");
        dayDiv.textContent = date;
        dayDiv.dataset.date = fullDate;
        calendarGrid.appendChild(dayDiv);
    }
}

function showTasksForDate(date) {
    calendarTasks.innerHTML = "";
    const dayTasks = tasks.filter(t => t.date===date && !t.completed);
}


document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth--;
    if(currentMonth<0){ currentMonth=11; currentYear--;}
    renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth++;
    if(currentMonth>11){ currentMonth=0; currentYear++;}
    renderCalendar();
});

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000); 
}

renderList();
renderCalendar();
updateCounters();

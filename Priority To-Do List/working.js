
const todoinput = document.getElementById("todo-input")
const Addtaskbtn = document.getElementById("add-task-btn")
const todolist = document.getElementById("todo-list")
const filterButtons = document.querySelectorAll(".filter-btn")
const clearCompletedBtn = document.getElementById("clear-completed")
const darkModeBtn = document.getElementById("toggle-dark-mode")
const priorityInput = document.getElementById("priority")

let tasks = JSON.parse(localStorage.getItem("Task")) || []
let currentFilter = "all"

tasks.forEach(task => rendertask(task))

Addtaskbtn.addEventListener("click", () => {
    const input = todoinput.value.trim()
    const priority = priorityInput.value

    if (input === "") return;

    const Newtask = {
        id: Date.now(),
        text: input,
        completionstatus: false,
        priority: priority
    }

    tasks.push(Newtask)
    savetask()
    filterTasks()
    todoinput.value = ""
    priorityInput.value = "low"
})

function savetask() {
    localStorage.setItem("Task", JSON.stringify(tasks))
}

function getPriorityStars(priority) {
    if (priority === "high") return "⭐️⭐️⭐️"
    if (priority === "medium") return "⭐️⭐️"
    return "⭐️"
}

function rendertask(task) {
    const li = document.createElement("li")
    li.setAttribute("data-id", task.id)
    if (task.completionstatus) li.classList.add("completed")

    const span = document.createElement("span")
    span.textContent = `${task.text} (${getPriorityStars(task.priority)})`

    const delBtn = document.createElement("button")
    delBtn.textContent = "Delete"

    li.appendChild(span)
    li.appendChild(delBtn)
    todolist.appendChild(li)

    li.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;
        task.completionstatus = !task.completionstatus
        li.classList.toggle("completed")
        savetask()
        filterTasks()
    })

    delBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id)
        li.remove()
        savetask()
    })
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter
        filterTasks()
    })
})

clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completionstatus)
    savetask()
    filterTasks()
})

function filterTasks() {
    todolist.innerHTML = ""
    let filtered = [...tasks]

    if (currentFilter === "completed") {
        filtered = filtered.filter(task => task.completionstatus)
    } else if (currentFilter === "pending") {
        filtered = filtered.filter(task => !task.completionstatus)
    } else if (currentFilter === "priority") {
        const priorityRank = { high: 3, medium: 2, low: 1 }
        filtered.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority])
    }

    filtered.forEach(task => rendertask(task))
}

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode")
})

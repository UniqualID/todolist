class Task {
    constructor(desc, priority, duedate, proj, completed = false) {
        this.desc = desc;
        this.priority = priority; // enum: High/Medium/Low
        this.duedate = duedate;
        this.proj = proj;
        this.completed = completed;
        this.uuid = crypto.randomUUID();
    }
}

let taskMap = {}; // uuid → Task

function getAllTasks() {
    return Object.values(taskMap);
}

function getWeeklyTasks() {
    const now = new Date();
    const oneWeekFromNow = new Date(now);
    oneWeekFromNow.setDate(now.getDate() + 7);

    return Object.values(taskMap).filter((task) => {
        const due = new Date(task.duedate);
        return due >= now && due <= oneWeekFromNow;
    });
}

function getMonthlyTasks() {
    const now = new Date();
    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    return Object.values(taskMap).filter((task) => {
        const due = new Date(task.duedate);
        return due >= now && due <= oneMonthFromNow;
    });
}

function getCompletedTasks() {
    return Object.values(taskMap).filter((task) => task.completed);
}

function getOverdueTasks() {
    const now = new Date();
    return Object.values(taskMap).filter((task) => {
        const due = new Date(task.duedate);
        return due < now && !task.completed; // Task is overdue and not completed
    });
}

function setTasks(tasks) {
    taskMap = {};
    for (const task of tasks) {
        taskMap[task.uuid] = task;
    }
}

function createTask(desc, priority, duedate, proj, completed = false) {
    const formattedDate = new Date(duedate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    const newTask = new Task(desc, priority, formattedDate, proj, completed);
    taskMap[newTask.uuid] = newTask;
    return newTask;
}

function deleteTaskByUUID(uuid) {
    delete taskMap[uuid];
}

function toggleTaskDone(uuid) {
    const task = taskMap[uuid];
    if (task) {
        task.completed = !task.completed;
    }
}

function getTasksByUUID(uuid) {
    return taskMap[uuid] || null;
}
function getTasksByProjectUUID(uuid) {
    return Object.values(taskMap).filter((task) => task.proj === uuid);
}

export {
    getAllTasks,
    getWeeklyTasks,
    getMonthlyTasks,
    getCompletedTasks,
    getOverdueTasks, // Export the new function
    getTasksByUUID,
    createTask,
    setTasks,
    deleteTaskByUUID,
    toggleTaskDone,
    getTasksByProjectUUID,
};

class Task {
    constructor(title, desc, priority, duedate, proj, completed = false) {
        this.title = title;
        this.desc = desc;
        this.priority = priority;
        this.duedate = duedate;
        this.proj = proj;
        this.completed = completed;
    }
}

let tasklist = [];

function getAllTasks() {
    return tasklist;
}

function getWeeklyTasks() {
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    return tasklist.filter((task) => {
        const due = new Date(task.duedate);
        return due >= now && due <= oneWeekFromNow;
    });
}

function getMonthlyTasks() {
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);
    return tasklist.filter((task) => {
        const due = new Date(task.duedate);
        return due >= now && due <= oneMonthFromNow;
    });
}

function getCompletedTasks() {
    return tasklist.filter((task) => task.completed);
}

function setTasks(tasks) {
    tasklist = tasks;
}

function createTask(title, desc, priority, duedate, proj, completed) {
    let newTask = new Task(title, desc, priority, duedate, proj, completed);
    tasklist.push(newTask);
    return newTask;
}

export {
    getAllTasks,
    getWeeklyTasks,
    getMonthlyTasks,
    getCompletedTasks,
    createTask,
    setTasks,
};

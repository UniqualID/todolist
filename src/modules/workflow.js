import {
    getAllTasks,
    getWeeklyTasks,
    getMonthlyTasks,
    getCompletedTasks,
    getTasksByUUID,
    createTask,
    setTasks,
    deleteTaskByUUID,
} from './task.js';

import { store, retrieve } from './storage.js';
import {
    addProject,
    getAllProjs,
    setProjs,
    deleteProjByUUID,
} from './project.js';

const PREVSTORAGE = 'todo:previously-stored';
const TASKLISTKEY = 'todo:task-list-key';
const PROJECTLISTKEY = 'todo:project-list-key';

function initializeTasksFromStorage() {
    if (!retrieve(PREVSTORAGE)) {
        console.log('No previous tasks found, defaulting to hardcoded list...');

        // Create dummy projects
        addProject('Personal', '🏠');
        addProject('Home', '🛋️');
        addProject('Finance', '💰');
        addProject('Work', '💼');
        addProject('Leisure', '🌴');
        addProject('Health', '🩺');

        const getUUID = (name) =>
            getAllProjs().find((p) => p.name === name)?.uuid;

        const now = new Date();
        const iso = (offsetDays) => {
            const d = new Date(now);
            d.setDate(d.getDate() + offsetDays);
            return d.toISOString();
        };

        createTask(
            'Buy groceries: Milk, Eggs, Bread',
            'High',
            iso(1),
            getUUID('Personal'),
            false,
        );
        createTask(
            'Call plumber: Fix kitchen sink leak',
            'Medium',
            iso(3),
            getUUID('Home'),
            false,
        );
        createTask(
            'Submit tax forms: Before deadline',
            'High',
            iso(6),
            getUUID('Finance'),
            true,
        );
        createTask(
            'Finish project report: Due end of week',
            'High',
            iso(10),
            getUUID('Work'),
            false,
        );
        createTask(
            'Plan weekend trip: Look for hotel in Vermont',
            'Low',
            iso(14),
            getUUID('Leisure'),
            false,
        );
        createTask(
            "Read new book: Start 'Atomic Habits'",
            'Medium',
            iso(20),
            getUUID('Personal'),
            false,
        );
        createTask(
            'Organize desk: Declutter and file papers',
            'Low',
            iso(21),
            getUUID('Home'),
            false,
        );
        createTask(
            'Dentist appointment: Routine check-up',
            'Low',
            iso(-2),
            getUUID('Health'),
            true,
        );
        createTask(
            'Team sync meeting: Weekly updates with dev team',
            'Medium',
            iso(-1),
            getUUID('Work'),
            true,
        );
        createTask(
            'Workout: Leg day at the gym',
            'Low',
            iso(-4),
            getUUID('Health'),
            false,
        );
        createTask(
            'Email accountant: Ask about quarterly filings',
            'High',
            iso(2),
            getUUID('Finance'),
            false,
        );
        createTask('Clean bathroom', 'Medium', iso(5), getUUID('Home'), false);
        createTask('Water plants', 'Low', iso(0), getUUID('Personal'), false);
        createTask('Lunch with Alex', 'Low', iso(1), getUUID('Leisure'), true);
        createTask(
            'Design new feature: Dashboard widgets',
            'High',
            iso(7),
            getUUID('Work'),
            false,
        );
        createTask(
            'Doctor appointment: Annual physical',
            'Medium',
            iso(8),
            getUUID('Health'),
            true,
        );
        createTask('Yoga session', 'Low', iso(3), getUUID('Health'), false);
        createTask(
            'Movie night: Watch Dune 2',
            'Low',
            iso(4),
            getUUID('Leisure'),
            false,
        );
        createTask(
            'Review investment portfolio',
            'High',
            iso(6),
            getUUID('Finance'),
            false,
        );
        createTask(
            'Write blog post on productivity',
            'Medium',
            iso(9),
            getUUID('Personal'),
            false,
        );
        createTask(
            'Fix leaky faucet',
            'Medium',
            iso(10),
            getUUID('Home'),
            false,
        );
        createTask(
            'Catch up on reading articles',
            'Low',
            iso(11),
            getUUID('Personal'),
            false,
        );
        createTask(
            'Submit reimbursement form',
            'Medium',
            iso(2),
            getUUID('Work'),
            false,
        );
        createTask('Go for a run', 'Low', iso(1), getUUID('Health'), false);
        createTask(
            'Birthday gift for Sarah',
            'High',
            iso(12),
            getUUID('Personal'),
            false,
        );
        createTask(
            'Paint living room',
            'Medium',
            iso(15),
            getUUID('Home'),
            false,
        );
        createTask(
            'Install budgeting app',
            'Medium',
            iso(13),
            getUUID('Finance'),
            false,
        );
        createTask(
            'Catch up with college friend',
            'Low',
            iso(5),
            getUUID('Leisure'),
            false,
        );
        createTask(
            'Fix broken shelf',
            'Medium',
            iso(6),
            getUUID('Home'),
            false,
        );
        createTask(
            'Refactor legacy code module',
            'High',
            iso(14),
            getUUID('Work'),
            false,
        );
        createTask(
            'Meditation session',
            'Low',
            iso(2),
            getUUID('Health'),
            false,
        );
        store(PREVSTORAGE, true);
        store(PROJECTLISTKEY, getAllProjs());
        store(TASKLISTKEY, getAllTasks());
        return;
    } else {
        const retrievedTasks = retrieve(TASKLISTKEY);
        console.log(
            `Tasks found in local storage, len ${retrievedTasks.length}`,
        );
        setTasks(retrievedTasks);
        const retrievedProjs = retrieve(PROJECTLISTKEY);
        console.log(
            `Tasks found in local storage, len ${retrievedProjs.length}`,
        );
        setProjs(retrievedProjs);
    }
}

function addTaskAndSave(desc, priority, duedate, proj, completed = false) {
    const newTask = createTask(desc, priority, duedate, proj, completed);
    store(TASKLISTKEY, getAllTasks());
    return newTask;
}

function editTaskAndSave(
    uuid,
    desc,
    priority,
    duedate,
    proj,
    completed = false,
) {
    const task = getTasksByUUID(uuid);
    if (!task) {
        console.error(`Task with uuid ${uuid} not found.`);
        return null;
    }

    task.desc = desc;
    task.priority = priority;
    task.duedate = duedate;
    task.proj = proj;
    task.completed = completed;

    store(TASKLISTKEY, getAllTasks());
    return task;
}

function addProjectAndSave(name, emoji) {
    const newProj = addProject(name, emoji);
    store(PROJECTLISTKEY, getAllProjs());
    return newProj;
}

function deleteTaskAndSave(uuid) {
    deleteTaskByUUID(uuid);
    store(TASKLISTKEY, getAllTasks());
}

function deleteProjectAndSave(uuid) {
    deleteProjByUUID(uuid);
    // Remove all tasks associated with this project
    const tasks = getAllTasks();
    for (const task of tasks) {
        if (task.proj === uuid) {
            deleteTaskByUUID(task.uuid);
        }
    }

    // Remove the project itself
    store(PROJECTLISTKEY, getAllProjs());
    store(TASKLISTKEY, getAllTasks());
}

function saveTasks() {
    store(TASKLISTKEY, getAllTasks());
}

function saveProjects() {
    store(PROJECTLISTKEY, getAllProjs());
}

export {
    initializeTasksFromStorage,
    addTaskAndSave,
    addProjectAndSave,
    saveTasks,
    saveProjects,
    deleteTaskAndSave,
    editTaskAndSave,
    deleteProjectAndSave,
};

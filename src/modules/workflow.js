import {
    getAllTasks,
    getWeeklyTasks,
    getMonthlyTasks,
    getCompletedTasks,
    createTask,
    setTasks,
} from './task.js';

import { store, retrieve } from './storage.js';

const TASKLISTKEY = 'tasklist';

function initializeTasksFromStorage() {
    let retrieved = retrieve(TASKLISTKEY);
    // if (!retrieved) {
    if (true) {
        console.log('No previous tasks found, defaulting to hardcoded list...');

        const now = new Date();

        const iso = (offsetDays) => {
            const d = new Date(now);
            d.setDate(d.getDate() + offsetDays);
            return d.toISOString();
        };

        // Next week
        createTask(
            'Buy groceries',
            'Milk, Eggs, Bread',
            'High',
            iso(1),
            'Personal',
            false,
        );
        createTask(
            'Call plumber',
            'Fix kitchen sink leak',
            'Medium',
            iso(3),
            'Home',
            false,
        );
        createTask(
            'Submit tax forms',
            'Before deadline',
            'High',
            iso(6),
            'Finance',
            true,
        );

        // Later this month
        createTask(
            'Finish project report',
            'Due end of week',
            'High',
            iso(10),
            'Work',
            false,
        );
        createTask(
            'Plan weekend trip',
            'Look for hotel in Vermont',
            'Low',
            iso(14),
            'Leisure',
            false,
        );
        createTask(
            'Read new book',
            "Start 'Atomic Habits'",
            'Medium',
            iso(20),
            'Personal',
            false,
        );
        createTask(
            'Organize desk',
            'Declutter and file papers',
            'Low',
            iso(21),
            'Home',
            false,
        );

        // Past due
        createTask(
            'Dentist appointment',
            'Routine check-up',
            'Low',
            iso(-2),
            'Health',
            true,
        );
        createTask(
            'Team sync meeting',
            'Weekly updates with dev team',
            'Medium',
            iso(-1),
            'Work',
            true,
        );
        createTask(
            'Workout',
            'Leg day at the gym',
            'Low',
            iso(-4),
            'Health',
            false,
        );

        store(TASKLISTKEY, getAllTasks());
        return;
    } else {
        console.log(`Tasks found in local storage, len ${retrieved.length}`);
        setTasks(retrieved);
    }
}

export { initializeTasksFromStorage };

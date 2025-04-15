import {
    getAllTasks,
    getWeeklyTasks,
    getMonthlyTasks,
    getCompletedTasks,
} from './task.js';

import { initializeTasksFromStorage } from './workflow.js';

const elements = {
    alltasksBtn: document.querySelector('#alltasks'),
    weeklytasksBtn: document.querySelector('#weeklytasks'),
    monthlytasksBtn: document.querySelector('#monthlytasks'),
    completedtasksBtn: document.querySelector('#completedtasks'),
    aside: document.querySelector('aside'),
};

function displayTasks(tasks) {
    console.log(tasks);
}

function setActive(btn) {
    const sidebarBtns = [
        elements.alltasksBtn,
        elements.weeklytasksBtn,
        elements.monthlytasksBtn,
        elements.completedtasksBtn,
    ];

    sidebarBtns.forEach((btn) => {
        btn.classList.remove('active');
    });

    btn.classList.add('active');
}

function setupSidebar() {
    // Setup functions related to sidebar and submenu collapse/expansion
    const aside = document.querySelector('aside');
    function dropdown(buttonClickEvent) {
        buttonClickEvent.currentTarget.nextElementSibling.classList.toggle(
            'show',
        );
        buttonClickEvent.currentTarget.classList.toggle('rotate');
    }

    function toggleSidebar(buttonClickEvent) {
        aside.classList.toggle('close');
        buttonClickEvent.currentTarget.classList.toggle('rotate');

        Array.from(document.getElementsByClassName('show')).forEach((ul) => {
            ul.classList.remove('show');
            ul.previousElementSibling.classList.remove('rotate');
        });
    }

    document.querySelectorAll('aside .dropdown').forEach((button) => {
        button.addEventListener('click', dropdown);
    });

    document
        .querySelector('#toggle-btn')
        .addEventListener('click', toggleSidebar);

    //
    elements.alltasksBtn.addEventListener('click', () => {
        setActive(elements.alltasksBtn);
        displayTasks(getAllTasks());
    });
    elements.weeklytasksBtn.addEventListener('click', () => {
        setActive(elements.weeklytasksBtn);
        displayTasks(getWeeklyTasks());
    });
    elements.monthlytasksBtn.addEventListener('click', () => {
        setActive(elements.monthlytasksBtn);
        displayTasks(getMonthlyTasks());
    });
    elements.completedtasksBtn.addEventListener('click', () => {
        setActive(elements.completedtasksBtn);
        displayTasks(getCompletedTasks());
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize tasklist
    initializeTasksFromStorage();

    // Attach appropriate event listeners to sidebar
    setupSidebar();
});

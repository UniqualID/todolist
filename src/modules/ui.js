import svgTaskDone from '../icons/task_done.svg';
import svgTaskEdit from '../icons/task_edit.svg';
import svgTaskDelete from '../icons/task_delete.svg';
import svgAdd from '../icons/add.svg';

import 'emoji-picker-element';
import {
    getAllTasks,
    getWeeklyTasks,
    getMonthlyTasks,
    getCompletedTasks,
    getTasksByUUID,
    toggleTaskDone,
    getTasksByProjectUUID,
} from './task.js';

import { getProjByUUID, getAllProjs } from './project.js';
import {
    initializeTasksFromStorage,
    saveTasks,
    deleteProjectAndSave,
    deleteTaskAndSave,
    addTaskAndSave,
    editTaskAndSave,
    addProjectAndSave,
} from './workflow.js';

import { store, retrieve } from './storage.js';

const elements = {
    alltasksBtn: document.querySelector('#alltasks'),
    weeklytasksBtn: document.querySelector('#weeklytasks'),
    monthlytasksBtn: document.querySelector('#monthlytasks'),
    completedtasksBtn: document.querySelector('#completedtasks'),
    aside: document.querySelector('aside'),
    content: document.querySelector('#content'),
    newTaskForm: document.querySelector('#newtaskform'),
    newTaskDialog: document.querySelector('#newtaskdialog'),
    editTaskDialog: document.querySelector('#edittaskdialog'),
    newProjectDialog: document.querySelector('#newprojectdialog'),
    editTaskForm: document.querySelector('#edittaskform'),
    themeSwitch: document.querySelector('#theme-switch'),
};

class State {
    static currentState = 'alltasks';
    static currentProjectEmoji = '😀';

    static getEmoji() {
        return State.currentProjectEmoji;
    }

    static setEmoji(emoji) {
        State.currentProjectEmoji = emoji;
    }
    static setState(newState, isProject = false) {
        if (isProject) {
            State.currentState = `project:${newState}`;
        } else {
            State.currentState = newState;
        }
    }
    static getState() {
        return State.currentState;
    }
    static getTasksBasedOnState() {
        switch (State.currentState) {
            case 'alltasks':
                return getAllTasks();
            case 'weeklytasks':
                return getWeeklyTasks();
            case 'monthlytasks':
                return getMonthlyTasks();
            case 'completedtasks':
                return getCompletedTasks();
        }
        if (State.currentState.startsWith('project:')) {
            const projectId = State.currentState.split(':')[1];
            return getTasksByProjectUUID(projectId);
        }
    }
    static getTitleBasedOnState() {
        switch (State.currentState) {
            case 'alltasks':
                return 'All Tasks';
            case 'weeklytasks':
                return 'Weekly Tasks';
            case 'monthlytasks':
                return 'Monthly Tasks';
            case 'completedtasks':
                return 'Completed Tasks';
        }
        if (State.currentState.startsWith('project:')) {
            const projectId = State.currentState.split(':')[1];
            return `Project: ${getProjByUUID(projectId).name}`;
        }
    }
}

const taskBtnHandlers = {
    done: (e) => {
        const taskDiv = e.currentTarget.closest('.relative-wrap');
        const uuid = taskDiv.dataset.uuid;
        toggleTaskDone(uuid);
        taskDiv.firstChild.classList.toggle('completed');
        saveTasks();
    },
    delete: (e) => {
        const taskDiv = e.currentTarget.closest('.relative-wrap');
        const uuid = taskDiv.dataset.uuid;
        deleteTaskAndSave(uuid);
        taskDiv.remove();
    },
    edit: (e) => {
        const taskDiv = e.currentTarget.closest('.relative-wrap');
        const uuid = taskDiv.dataset.uuid;
        const task = getTasksByUUID(uuid);

        //populate the fields of the edit modal with the task data
        const editTaskForm = elements.editTaskForm;
        editTaskForm.querySelector('#edit-desc').value = task.desc;
        editTaskForm.querySelector('#edit-priority').value = task.priority;
        editTaskForm.querySelector('#edit-duedate').value = task.duedate;
        editTaskForm.querySelector('#edit-proj').value = task.proj;
        editTaskForm.querySelector('#edit-completed').checked = task.completed;

        // Set the uuid of the task to be edited in the form dataset
        editTaskForm.dataset.uuid = uuid;

        elements.editTaskDialog.showModal();
    },
};

function create(tag, className, text, children) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    if (children) el.replaceChildren(...children);
    return el;
}
function taskToDiv({ desc, priority, duedate, proj, completed, uuid }) {
    const taskRow = create('div', `task-row${completed ? ' completed' : ''}`);

    const priorityClass = {
        High: 'red',
        Medium: 'yellow',
        Low: 'green',
    }[priority];
    taskRow.appendChild(create('div', `priority-indicator ${priorityClass}`));

    taskRow.appendChild(create('div', 'task-desc', desc));
    taskRow.appendChild(
        create('div', 'task-project', getProjByUUID(proj).name),
    );
    taskRow.appendChild(create('div', 'task-date', duedate));

    const taskActions = create('div', 'task-actions');

    const doneBtn = create('button', 'icon-button task-done');
    doneBtn.innerHTML = svgTaskDone;
    const editBtn = create('button', 'icon-button task-edit');
    editBtn.innerHTML = svgTaskEdit;
    const deleteBtn = create('button', 'icon-button task-delete');
    deleteBtn.innerHTML = svgTaskDelete;

    doneBtn.addEventListener('click', taskBtnHandlers.done);
    editBtn.addEventListener('click', taskBtnHandlers.edit);
    deleteBtn.addEventListener('click', taskBtnHandlers.delete);

    taskActions.appendChild(doneBtn);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    taskRow.appendChild(taskActions);

    const relativeWrap = create('div', 'relative-wrap', null, [taskRow]);
    relativeWrap.dataset.uuid = uuid;
    return relativeWrap;
}

function displayTasksBasedOnState() {
    // Get the current state and display tasks accordingly
    const currentState = State.getState();
    const tasks = State.getTasksBasedOnState();
    const title = State.getTitleBasedOnState();

    // Clears the main content area and renders task objects
    console.log(`displayTasks() called with title: ${title}, tasks:`);
    console.log(tasks);

    // Clear main content area
    content.innerHTML = '';

    // Create Title and add task button
    const addtaskBtn = create('button');
    addtaskBtn.id = 'add-task';
    addtaskBtn.addEventListener('click', () => {
        elements.newTaskDialog.showModal();
    });
    addtaskBtn.innerHTML = svgAdd;
    content.appendChild(
        create('div', 'header-line', null, [
            create('h1', null, title),
            addtaskBtn,
        ]),
    );

    tasks.forEach((task) => {
        content.appendChild(taskToDiv(task));
    });
}

function setActive(btn) {
    const sidebarBtns = [
        elements.alltasksBtn,
        elements.weeklytasksBtn,
        elements.monthlytasksBtn,
        elements.completedtasksBtn,
        ...document.querySelectorAll('#projects button'),
    ];

    sidebarBtns.forEach((btn) => {
        btn.classList.remove('active');
    });

    btn.classList.add('active');
}

function createProjectUI() {
    // refreshes the project buttons in the sidebar
    // meant to be called multiples times
    const projects = document.querySelector('#projects');
    projects.innerHTML = '';

    getAllProjs().forEach((proj) => {
        const button = document.createElement('button');
        button.innerHTML = `<span class="emoji">${proj.emoji}</span> <span class="projectname">${proj.name}</span>`;

        const removeProj = create('div', 'removeproj');
        removeProj.innerHTML = svgTaskDelete;

        button.appendChild(removeProj);
        button.addEventListener('click', () => {
            State.setState(proj.uuid, true);
            setActive(button);
            displayTasksBasedOnState();
        });

        removeProj.addEventListener('click', (e) => {
            e.stopPropagation();
            const projId = proj.uuid;
            deleteProjectAndSave(projId);
            button.remove();
            createProjectUI();
            if (State.getState() === `project:${projId}`) {
                State.setState('alltasks');
                setActive(elements.alltasksBtn);
                displayTasksBasedOnState();
            } else {
                displayTasksBasedOnState();
            }

            // Remove the project from create task modal and edit task modal
            const projectSelect = elements.newTaskForm.querySelector('#proj');
            const editProjectSelect =
                elements.editTaskForm.querySelector('#edit-proj');
            const projectOptions = [
                ...projectSelect.querySelectorAll('option'),
            ];
            const editProjectOptions = [
                ...editProjectSelect.querySelectorAll('option'),
            ];

            projectOptions.forEach((option) => {
                if (option.value === projId) {
                    option.remove();
                }
            });

            editProjectOptions.forEach((option) => {
                if (option.value === projId) {
                    option.remove();
                }
            });
        });
        projects.appendChild(button);
    });
    const createProjectBtn = document.createElement('button');
    createProjectBtn.id = 'addproject';
    createProjectBtn.innerHTML = 'Add Project';
    createProjectBtn.addEventListener('click', () => {
        elements.newProjectDialog.showModal();
    });

    projects.appendChild(createProjectBtn);
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
        State.setState('alltasks');
        setActive(elements.alltasksBtn);
        displayTasksBasedOnState();
    });
    elements.weeklytasksBtn.addEventListener('click', () => {
        State.setState('weeklytasks');
        setActive(elements.weeklytasksBtn);
        displayTasksBasedOnState();
    });
    elements.monthlytasksBtn.addEventListener('click', () => {
        State.setState('monthlytasks');
        setActive(elements.monthlytasksBtn);
        displayTasksBasedOnState();
    });
    elements.completedtasksBtn.addEventListener('click', () => {
        State.setState('completedtasks');
        setActive(elements.completedtasksBtn);
        displayTasksBasedOnState();
    });

    createProjectUI();
}

function setupNewTaskModal() {
    const newTaskDialog = elements.newTaskDialog;
    const newTaskForm = elements.newTaskForm;
    const cancelBtn = newTaskForm.querySelector('#cancel');

    // Add project names to the project select dropdown
    const projectSelect = newTaskForm.querySelector('#proj');
    const projects = getAllProjs();
    projects.forEach((proj) => {
        const option = document.createElement('option');
        option.value = proj.uuid;
        option.textContent = `${proj.emoji} ${proj.name}`;
        projectSelect.appendChild(option);
    });

    newTaskDialog.addEventListener('close', () => {
        newTaskForm.reset();
    });

    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(newTaskForm);
        addTaskAndSave(
            formData.get('desc'),
            formData.get('priority'),
            formData.get('duedate'),
            formData.get('proj'),
            formData.get('completed'),
        );
        displayTasksBasedOnState();
        newTaskForm.reset();
        newTaskDialog.close();
    });

    cancelBtn.addEventListener('click', () => {
        newTaskForm.reset();
        newTaskDialog.close();
    });
}

function setupEditTaskModal() {
    const editTaskDialog = document.querySelector('#edittaskdialog');
    const editTaskForm = document.querySelector('#edittaskform');
    const cancelBtn = editTaskForm.querySelector('#edit-cancel');

    // Add project names to the project select dropdown
    const projectSelect = editTaskForm.querySelector('#edit-proj');
    const projects = getAllProjs();
    projects.forEach((proj) => {
        const option = document.createElement('option');
        option.value = proj.uuid;
        option.textContent = `${proj.emoji} ${proj.name}`;
        projectSelect.appendChild(option);
    });

    editTaskDialog.addEventListener('close', () => {
        editTaskForm.reset();
    });

    cancelBtn.addEventListener('click', () => {
        editTaskForm.reset();
        editTaskDialog.close();
    });

    editTaskForm.addEventListener('submit', (e) => {
        if (!editTaskForm.dataset.uuid) {
            return;
        }
        e.preventDefault();
        const formData = new FormData(editTaskForm);
        const uuid = editTaskForm.dataset.uuid;
        editTaskAndSave(
            uuid,
            formData.get('edit-desc'),
            formData.get('edit-priority'),
            formData.get('edit-duedate'),
            formData.get('edit-proj'),
            formData.get('edit-completed'),
        );
        displayTasksBasedOnState();
        editTaskDialog.close();
    });
}

function setupNewProjectModal() {
    const newProjectDialog = elements.newProjectDialog;
    const newProjectForm = document.querySelector('#newprojectform');
    const emojiPicker = document.querySelector('emoji-picker');
    emojiPicker.addEventListener('emoji-click', (e) => {
        const emoji = e.detail.unicode;
        State.setEmoji(emoji);
        document.querySelector('#emojioutput').textContent = emoji;
    });

    newProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(newProjectForm);
        const name = formData.get('projname');

        const newProj = addProjectAndSave(name, State.getEmoji());
        createProjectUI();

        // Add project to the select dropdown in new task modal and edit task modal
        const projectSelect = elements.newTaskForm.querySelector('#proj');
        const editProjectSelect =
            elements.editTaskForm.querySelector('#edit-proj');
        const option = document.createElement('option');
        option.value = newProj.uuid;
        option.textContent = `${newProj.emoji} ${newProj.name}`;
        projectSelect.appendChild(option);
        editProjectSelect.appendChild(option.cloneNode(true));

        newProjectDialog.close();
    });

    const cancelBtn = newProjectForm.querySelector('#cancelproject');

    cancelBtn.addEventListener('click', () => {
        newProjectForm.reset();
        newProjectDialog.close();
    });
}

function setupThemeSwitch() {
    let darkmode = retrieve('darkmode', null);
    const enableDarkmode = () => {
        document.body.classList.add('darkmode');
        document.querySelector('emoji-picker').className = 'dark';
        store('darkmode', 'active');
    };

    const disableDarkmode = () => {
        document.body.classList.remove('darkmode');
        document.querySelector('emoji-picker').className = 'light';
        store('darkmode', null);
    };

    if (darkmode === 'active') enableDarkmode();

    elements.themeSwitch.addEventListener('click', () => {
        darkmode = retrieve('darkmode', null);
        darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tasklist
    initializeTasksFromStorage();

    setupNewTaskModal();

    setupEditTaskModal();

    setupNewProjectModal();

    // Attach appropriate event listeners to sidebar
    setupSidebar();

    setupThemeSwitch();

    // Display all tasks by default
    State.setState('alltasks');
    setActive(elements.alltasksBtn);
    displayTasksBasedOnState();
});

// Get activity and task information from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const activityName = urlParams.get('activity');
const taskIndex = parseInt(urlParams.get('taskIndex'));

if (!activityName || isNaN(taskIndex)) {
    window.location.href = 'homepage.html';
}

// Get the tasks for this activity
const tasks = getTasksForActivity(activityName);
const currentTask = tasks[taskIndex];

if (!currentTask) {
    window.location.href = 'homepage.html';
}

// Update page title and task details
document.getElementById('task-title').textContent = currentTask.name;
document.getElementById('due-date').textContent = `Due: ${new Date(currentTask.dueDate).toLocaleDateString()}`;
document.getElementById('difficulty').textContent = `Difficulty: ${currentTask.difficulty}`;
document.title = `${currentTask.name} - Sections`;

// Display completed status if task is checked
const taskNameElement = document.getElementById('task-title');
const addSectionButton = document.getElementById('add-task-btn');
const sectionNameInput = document.getElementById('task-name-input');

if (currentTask.isChecked) {
    // Add checkbox to task title to allow toggling completion status
    taskNameElement.innerHTML = `
                <span style="display: flex; align-items: center; gap: var(--spacing-sm);">
                    <input type="checkbox" id="task-completion-toggle" checked style="transform: scale(1.2);">
                    ${currentTask.name} <span style="color: var(--success-color); font-size: var(--font-size-sm);">(Completed)</span>
                </span>
            `;

    // Add event listener to toggle task completion
    document.getElementById('task-completion-toggle').addEventListener('change', function () {
        toggleTask(activityName, taskIndex);
        location.reload(); // Reload the page to refresh the UI
    });
} else {
    // Add checkbox to task title to allow toggling completion status
    taskNameElement.innerHTML = `
                <span style="display: flex; align-items: center; gap: var(--spacing-sm);">
                    <input type="checkbox" id="task-completion-toggle" style="transform: scale(1.2);">
                    ${currentTask.name}
                </span>
            `;

    // Add event listener to toggle task completion
    document.getElementById('task-completion-toggle').addEventListener('change', function () {
        toggleTask(activityName, taskIndex);
        location.reload(); // Reload the page to refresh the UI
    });
}

function goBack() {
    window.location.href = `tasks.html?activity=${encodeURIComponent(activityName)}`;
}

function redistributeWeights(subtasks) {
    const defaultWeight = Math.floor(100 / subtasks.length);
    const remainingWeight = 100 - (defaultWeight * (subtasks.length - 1));

    subtasks.forEach((subtask, index) => {
        const weight = index === subtasks.length - 1 ? remainingWeight : defaultWeight;
        updateSubtaskWeight(activityName, taskIndex, index, weight);
    });
}

function calculateTaskProgress(subtasks) {
    if (subtasks.length === 0) return 0;

    let totalProgress = 0;
    subtasks.forEach(subtask => {
        if (subtask.isChecked) {
            totalProgress += subtask.weight;
        }
    });

    return Math.round(totalProgress);
}

function updateTaskProgress() {
    const subtasks = getSubtasks(activityName, taskIndex);
    const progress = calculateTaskProgress(subtasks);
    updateTaskCompletion(activityName, taskIndex, progress);
}

function renderSubtasks() {
    const taskContainer = document.getElementById('task-container');
    const subtasks = getSubtasks(activityName, taskIndex);

    // Check if parent task is completed
    const isParentTaskCompleted = currentTask.isChecked;

    // Clear existing subtasks
    while (taskContainer.children.length > 1) {
        taskContainer.removeChild(taskContainer.lastChild);
    }

    // Render each subtask
    subtasks.forEach((subtask, subtaskIndex) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = subtask.isChecked;
        // Allow unchecking subtasks even if parent task is completed
        checkbox.addEventListener('change', () => {
            toggleSubtask(activityName, taskIndex, subtaskIndex);
            updateTaskProgress();
            renderSubtasks();
        });

        const taskButton = document.createElement('button');
        taskButton.className = 'task-button';
        taskButton.textContent = subtask.name;
        if (subtask.isChecked) {
            taskButton.style.textDecoration = 'line-through';
            taskButton.style.opacity = '0.7';
        }

        const weightContainer = document.createElement('div');
        weightContainer.className = 'task-weight-container';

        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.className = 'task-weight';
        weightInput.value = subtask.weight || 0;
        weightInput.placeholder = '0';
        weightInput.min = '0';
        weightInput.max = '100';
        // Allow weight editing even if parent task is completed
        weightInput.addEventListener('change', (e) => {
            const newWeight = parseInt(e.target.value) || 0;
            if (newWeight < 0 || newWeight > 100) {
                alert('Weight must be between 0 and 100');
                weightInput.value = subtask.weight;
                return;
            }

            // Calculate remaining weight to distribute
            const totalOtherTasks = subtasks.length - 1;
            if (totalOtherTasks > 0) {
                const remainingWeight = 100 - newWeight;
                const weightPerTask = Math.floor(remainingWeight / totalOtherTasks);
                let extraWeight = remainingWeight % totalOtherTasks;

                subtasks.forEach((otherSubtask, otherIndex) => {
                    if (otherIndex !== subtaskIndex) {
                        const adjustedWeight = weightPerTask + (extraWeight > 0 ? 1 : 0);
                        updateSubtaskWeight(activityName, taskIndex, otherIndex, adjustedWeight);
                        extraWeight--;
                    }
                });
            }

            updateSubtaskWeight(activityName, taskIndex, subtaskIndex, newWeight);
            renderSubtasks();
        });

        const percentSpan = document.createElement('span');
        percentSpan.textContent = '%';

        weightContainer.appendChild(weightInput);
        weightContainer.appendChild(percentSpan);

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = '×';
        // Allow removal of subtasks even if parent task is completed
        removeButton.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${subtask.name}"?`)) {
                removeSubtask(activityName, taskIndex, subtaskIndex);
                const remainingSubtasks = getSubtasks(activityName, taskIndex);
                if (remainingSubtasks.length > 0) {
                    redistributeWeights(remainingSubtasks);
                }
                renderSubtasks();
            }
        };

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskButton);
        taskDiv.appendChild(weightContainer);
        taskDiv.appendChild(removeButton);

        taskContainer.appendChild(taskDiv);
    });
}

// Handle adding new subtasks
document.getElementById('add-task-btn').addEventListener('click', function () {
    const subtaskName = document.getElementById('task-name-input').value.trim();

    if (subtaskName === '') {
        alert('Please enter a section name.');
        return;
    }

    addSubtask(activityName, taskIndex, subtaskName);
    const subtasks = getSubtasks(activityName, taskIndex);
    redistributeWeights(subtasks);
    document.getElementById('task-name-input').value = '';
    renderSubtasks();
});

// Initial render
renderSubtasks();
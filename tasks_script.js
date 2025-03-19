// Get activity name from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const activityName = urlParams.get('activity');

if (!activityName) {
    window.location.href = 'homepage.html';
}

// Update page title
document.getElementById('activity-title').textContent = activityName;
document.title = `${activityName} Tasks`;

function renderTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    const tasks = getTasksForActivity(activityName);

    tasksContainer.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.isChecked;
        checkbox.addEventListener('change', () => {
            toggleTask(activityName, index);
            renderTasks();
        });

        const taskButton = document.createElement('button');
        taskButton.className = 'task-button';
        taskButton.textContent = task.name;
        taskButton.onclick = () => {
            window.location.href = `sections.html?activity=${encodeURIComponent(activityName)}&taskIndex=${index}`;
        };

        const progressText = document.createElement('small');
        progressText.className = 'task-progress';
        progressText.textContent = `${task.progress || 0}%`;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = '×';
        removeButton.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${task.name}"?`)) {
                removeTask(activityName, index);
                renderTasks();
            }
        };

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskButton);
        taskDiv.appendChild(progressText);
        taskDiv.appendChild(removeButton);

        tasksContainer.appendChild(taskDiv);
    });
}

// Initial render
renderTasks();
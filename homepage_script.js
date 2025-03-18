function handleTaskClick(activityName) {
    window.location.href = `tasks.html?activity=${encodeURIComponent(activityName)}`;
}

function renderActivities() {
    const activitiesContainer = document.getElementById('activities-container');
    const activities = getActivities();
    
    activitiesContainer.innerHTML = '';
    
    for (const [activityName, activityData] of Object.entries(activities)) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = activityData.isChecked;
        checkbox.addEventListener('change', () => {
            toggleActivity(activityName);
            renderActivities();
        });
        
        const button = document.createElement('button');
        button.className = 'task-button';
        button.textContent = activityName;
        button.onclick = () => handleTaskClick(activityName);

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = '×';
        removeButton.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${activityName}" and all its tasks?`)) {
                removeActivity(activityName);
                renderActivities();
            }
        };
        
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(button);
        taskDiv.appendChild(removeButton);
        
        activitiesContainer.appendChild(taskDiv);
    }
}

// Initial render
renderActivities();
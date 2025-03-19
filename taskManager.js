// Data structure to store activities and their tasks
let activities = JSON.parse(localStorage.getItem('activities')) || {};

// Helper function to handle date with timezone
function getLocalDate(dateString) {
    const date = new Date(dateString);
    // Create a new date using local year, month, day to avoid timezone issues
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Function to add a new activity
function addActivity(activityName) {
    if (!activities[activityName]) {
        activities[activityName] = {
            tasks: [],
            isChecked: false
        };
        saveActivities();
        return true;
    }
    return false;
}

// Function to remove an activity
function removeActivity(activityName) {
    if (activities[activityName]) {
        delete activities[activityName];
        saveActivities();
        return true;
    }
    return false;
}

// Function to add a task to an activity
function addTask(activityName, taskName, dueDate, difficulty) {
    if (activities[activityName]) {
        activities[activityName].tasks.push({
            name: taskName,
            dueDate: dueDate,
            difficulty: difficulty,
            isChecked: false,
            subtasks: [] // Add subtasks array to store subtasks
        });
        saveActivities();
        return true;
    }
    return false;
}

// Function to remove a task from an activity
function removeTask(activityName, taskIndex) {
    if (activities[activityName] && activities[activityName].tasks[taskIndex]) {
        activities[activityName].tasks.splice(taskIndex, 1);
        saveActivities();
        return true;
    }
    return false;
}

// Function to add a subtask to a task
function addSubtask(activityName, taskIndex, subtaskName, weight = 0) {
    if (activities[activityName] && activities[activityName].tasks[taskIndex]) {
        activities[activityName].tasks[taskIndex].subtasks.push({
            name: subtaskName,
            weight: weight,
            isChecked: false
        });
        saveActivities();
        return true;
    }
    return false;
}

// Function to remove a subtask
function removeSubtask(activityName, taskIndex, subtaskIndex) {
    if (activities[activityName] && 
        activities[activityName].tasks[taskIndex] && 
        activities[activityName].tasks[taskIndex].subtasks[subtaskIndex]) {
        activities[activityName].tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
        saveActivities();
        return true;
    }
    return false;
}

// Function to toggle subtask completion
function toggleSubtask(activityName, taskIndex, subtaskIndex) {
    if (activities[activityName] && 
        activities[activityName].tasks[taskIndex] && 
        activities[activityName].tasks[taskIndex].subtasks[subtaskIndex]) {
        activities[activityName].tasks[taskIndex].subtasks[subtaskIndex].isChecked = 
            !activities[activityName].tasks[taskIndex].subtasks[subtaskIndex].isChecked;
        saveActivities();
        return true;
    }
    return false;
}

// Function to update subtask weight
function updateSubtaskWeight(activityName, taskIndex, subtaskIndex, weight) {
    if (activities[activityName] && 
        activities[activityName].tasks[taskIndex] && 
        activities[activityName].tasks[taskIndex].subtasks[subtaskIndex]) {
        activities[activityName].tasks[taskIndex].subtasks[subtaskIndex].weight = weight;
        saveActivities();
        return true;
    }
    return false;
}

// Function to toggle task completion
function toggleTask(activityName, taskIndex) {
    if (activities[activityName] && activities[activityName].tasks[taskIndex]) {
        const task = activities[activityName].tasks[taskIndex];
        task.isChecked = !task.isChecked;
        
        // If task is checked, mark all subtasks as checked and set progress to 100%
        if (task.isChecked) {
            task.progress = 100;
            if (task.subtasks && task.subtasks.length > 0) {
                task.subtasks.forEach(subtask => {
                    subtask.isChecked = true;
                });
            }
        } else {
            // If task is unchecked, calculate progress based on subtasks
            if (task.subtasks && task.subtasks.length > 0) {
                let completedWeight = 0;
                task.subtasks.forEach(subtask => {
                    if (subtask.isChecked) {
                        completedWeight += subtask.weight || 0;
                    }
                });
                task.progress = completedWeight;
            } else {
                task.progress = 0;
            }
        }
        
        saveActivities();
        return true;
    }
    return false;
}

// Function to toggle activity completion
function toggleActivity(activityName) {
    if (activities[activityName]) {
        activities[activityName].isChecked = !activities[activityName].isChecked;
        saveActivities();
        return true;
    }
    return false;
}

// Function to update task completion progress
function updateTaskCompletion(activityName, taskIndex, progress) {
    if (activities[activityName] && activities[activityName].tasks[taskIndex]) {
        activities[activityName].tasks[taskIndex].progress = progress;
        activities[activityName].tasks[taskIndex].isChecked = progress === 100;
        saveActivities();
        return true;
    }
    return false;
}

// Function to get all activities
function getActivities() {
    return activities;
}

// Function to get tasks for a specific activity
function getTasksForActivity(activityName) {
    return activities[activityName] ? activities[activityName].tasks : [];
}

// Function to get subtasks for a specific task
function getSubtasks(activityName, taskIndex) {
    return activities[activityName] && 
           activities[activityName].tasks[taskIndex] ? 
           activities[activityName].tasks[taskIndex].subtasks : [];
}

// Function to save activities to localStorage
function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
} 
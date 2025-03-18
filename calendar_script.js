// Function to get tasks for a specific date
function getTasksForDate(date) {
    const tasks = [];
    const activities = getActivities();

    for (const [activityName, activityData] of Object.entries(activities)) {
        activityData.tasks.forEach((task, taskIndex) => {
            const taskDate = getLocalDate(task.dueDate);
            const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (taskDate.toDateString() === compareDate.toDateString()) {
                tasks.push({
                    activityName,
                    taskIndex,
                    ...task
                });
            }
        });
    }

    return tasks;
}

// Function to mark days with tasks
function markDaysWithTasks() {
    const activities = getActivities();
    const markedDates = new Set();
    
    // Collect all dates that have tasks
    for (const activityData of Object.values(activities)) {
        activityData.tasks.forEach(task => {
            const date = getLocalDate(task.dueDate);
            if (date.getMonth() === displayedMonth && date.getFullYear() === displayedYear) {
                markedDates.add(date.getDate());
            }
        });
    }
    
    // Mark the calendar days
    document.querySelectorAll('.calendar-day').forEach(dayElement => {
        const day = parseInt(dayElement.textContent);
        if (markedDates.has(day)) {
            dayElement.style.border = '2px solid var(--primary-color)';
        }
    });
}

// Function to display tasks in the task list
function displayTasks(tasks, taskList) {
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task';

        const difficultyIndicator = document.createElement('span');
        difficultyIndicator.className = `difficulty-indicator difficulty-${task.difficulty}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.isChecked;
        checkbox.addEventListener('change', () => {
            toggleTask(task.activityName, task.taskIndex);
            markDaysWithTasks();
            displaySuggestedSchedule();
        });

        const taskButton = document.createElement('button');
        taskButton.className = 'task-button';
        taskButton.textContent = `${task.name} (${task.activityName})`;
        taskButton.onclick = () => {
            window.location.href = `sections.html?activity=${encodeURIComponent(task.activityName)}&taskIndex=${task.taskIndex}`;
        };

        const progressText = document.createElement('small');
        progressText.className = 'task-progress';
        progressText.textContent = `${task.progress || 0}%`;

        taskItem.appendChild(difficultyIndicator);
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskButton);
        taskItem.appendChild(progressText);

        taskList.appendChild(taskItem);
    });
}

// Get current date
const currentDate = new Date();
let displayedMonth = 2; // Start with March
let displayedYear = 2025;

// Update month display
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

// Function to generate calendar
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const monthDisplay = document.getElementById('monthDisplay');
    
    // Clear existing calendar
    calendar.innerHTML = '';
    
    // Update month/year display
    monthDisplay.textContent = `${monthNames[displayedMonth]} ${displayedYear}`;
    
    // Calculate first and last day of the month
    const firstDay = new Date(displayedYear, displayedMonth, 1);
    const lastDay = new Date(displayedYear, displayedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        emptyDay.style.visibility = 'hidden';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        
        // Highlight current day if it's the current month and year
        if (i === currentDate.getDate() &&
            displayedMonth === currentDate.getMonth() &&
            displayedYear === currentDate.getFullYear()) {
            dayElement.style.backgroundColor = 'var(--success-color)';
            dayElement.style.color = 'var(--surface-color)';
        }
        
        // If it's the first day of the month, select it by default
        if (i === 1) {
            dayElement.classList.add('selected');
            selectedDay = dayElement;
            
            const selectedDate = new Date(displayedYear, displayedMonth, i);
            document.getElementById('task-date').textContent = selectedDate.toLocaleDateString();
            
            // Load tasks for the first day
            const tasks = getTasksForDate(selectedDate);
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<li style="padding: var(--spacing-sm);">No tasks due on this date</li>';
            } else {
                displayTasks(tasks, taskList);
            }
        }
        
        dayElement.addEventListener('click', () => {
            if (selectedDay) {
                selectedDay.classList.remove('selected');
            }
            
            dayElement.classList.add('selected');
            selectedDay = dayElement;
            
            const selectedDate = new Date(displayedYear, displayedMonth, i);
            document.getElementById('task-date').textContent = selectedDate.toLocaleDateString();
            
            // Load tasks for the selected date
            const tasks = getTasksForDate(selectedDate);
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<li style="padding: var(--spacing-sm);">No tasks due on this date</li>';
            } else {
                displayTasks(tasks, taskList);
            }
        });
        
        calendar.appendChild(dayElement);
    }
    
    // Mark days with tasks
    markDaysWithTasks();
}

// Function to navigate to previous month
function previousMonth() {
    displayedMonth--;
    if (displayedMonth < 0) {
        displayedMonth = 11;
        displayedYear--;
    }
    generateCalendar();
}

// Function to navigate to next month
function nextMonth() {
    displayedMonth++;
    if (displayedMonth > 11) {
        displayedMonth = 0;
        displayedYear++;
    }
    generateCalendar();
}

// Add event listeners for month navigation
document.getElementById('prevMonth').addEventListener('click', previousMonth);
document.getElementById('nextMonth').addEventListener('click', nextMonth);

// Initial calendar generation
generateCalendar();

// Function to get upcoming tasks (multiple)
function getUpcomingTasks(limit = 3) {
    const activities = getActivities();
    let upcomingTasks = [];

    // Collect all future tasks that aren't completed
    for (const [activityName, activityData] of Object.entries(activities)) {
        activityData.tasks.forEach((task, taskIndex) => {
            const taskDate = getLocalDate(task.dueDate);

            if (taskDate >= currentDate && !task.isChecked) {
                upcomingTasks.push({
                    activityName,
                    taskIndex,
                    ...task
                });
            }
        });
    }

    // Sort by due date (earliest first)
    upcomingTasks.sort((a, b) => {
        const dateA = getLocalDate(a.dueDate);
        const dateB = getLocalDate(b.dueDate);
        return dateA - dateB;
    });

    // Return the earliest few tasks
    return upcomingTasks.slice(0, limit);
}

// Display upcoming tasks
function displayUpcomingTasks() {
    const upcomingTaskContainer = document.getElementById('upcoming-task');
    const upcomingTasks = getUpcomingTasks();

    if (upcomingTasks.length === 0) {
        upcomingTaskContainer.textContent = 'No upcoming tasks';
        return;
    }

    upcomingTaskContainer.innerHTML = '';

    upcomingTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.isChecked;
        checkbox.addEventListener('change', () => {
            toggleTask(task.activityName, task.taskIndex);
            displayUpcomingTasks();
            markDaysWithTasks();
        });

        const taskButton = document.createElement('button');
        taskButton.className = 'task-button';
        taskButton.textContent = `${task.name} (${task.activityName})`;
        taskButton.onclick = () => {
            window.location.href = `sections.html?activity=${encodeURIComponent(task.activityName)}&taskIndex=${task.taskIndex}`;
        };

        const dueDate = document.createElement('small');
        dueDate.className = 'task-progress';
        dueDate.textContent = `Due: ${getLocalDate(task.dueDate).toLocaleDateString()}`;

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskButton);
        taskItem.appendChild(dueDate);

        upcomingTaskContainer.appendChild(taskItem);
    });
}

// Display upcoming tasks
displayUpcomingTasks();

// Function to get suggested schedule for tasks
function getSuggestedSchedule(limit = 3) {
    const activities = getActivities();
    let allTasks = [];

    // Collect all uncompleted tasks
    for (const [activityName, activityData] of Object.entries(activities)) {
        activityData.tasks.forEach((task, taskIndex) => {
            if (!task.isChecked) {
                allTasks.push({
                    activityName,
                    taskIndex,
                    ...task
                });
            }
        });
    }

    // Sort tasks by a combination of due date and difficulty
    allTasks.sort((a, b) => {
        const dateA = getLocalDate(a.dueDate);
        const dateB = getLocalDate(b.dueDate);
        
        // Calculate days until due
        const daysUntilDueA = Math.ceil((dateA - currentDate) / (1000 * 60 * 60 * 24));
        const daysUntilDueB = Math.ceil((dateB - currentDate) / (1000 * 60 * 60 * 24));
        
        // Higher difficulty tasks should be started earlier
        const priorityScoreA = daysUntilDueA / parseInt(a.difficulty);
        const priorityScoreB = daysUntilDueB / parseInt(b.difficulty);
        
        return priorityScoreA - priorityScoreB;
    });

    // Return only the top priority tasks
    return allTasks.slice(0, limit);
}

// Function to display suggested schedule
function displaySuggestedSchedule() {
    const suggestedContainer = document.getElementById('suggested-schedule');
    const suggestedTasks = getSuggestedSchedule();

    if (suggestedTasks.length === 0) {
        suggestedContainer.innerHTML = '<p class="no-tasks">No tasks to schedule</p>';
        return;
    }

    suggestedContainer.innerHTML = '<h3>Suggested Schedule</h3>';

    suggestedTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task suggested-task';

        const difficultyIndicator = document.createElement('span');
        difficultyIndicator.className = `difficulty-indicator difficulty-${task.difficulty}`;
        //difficultyIndicator.textContent = '⚡'.repeat(parseInt(task.difficulty));
        
        const taskButton = document.createElement('button');
        taskButton.className = 'task-button';
        taskButton.textContent = `${task.name} (${task.activityName})`;
        taskButton.onclick = () => {
            window.location.href = `sections.html?activity=${encodeURIComponent(task.activityName)}&taskIndex=${task.taskIndex}`;
        };

        const dueDate = document.createElement('small');
        dueDate.className = 'task-progress';
        const daysUntilDue = Math.ceil((getLocalDate(task.dueDate) - currentDate) / (1000 * 60 * 60 * 24));
        dueDate.textContent = `Due in ${daysUntilDue} days`;

        taskItem.appendChild(difficultyIndicator);
        taskItem.appendChild(taskButton);
        taskItem.appendChild(dueDate);

        suggestedContainer.appendChild(taskItem);
    });
}

// Add call to display suggested schedule after calendar generation
generateCalendar();
displaySuggestedSchedule();
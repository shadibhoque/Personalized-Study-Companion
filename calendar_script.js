document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const taskList = document.getElementById("task-list");
    const taskDate = document.getElementById("task-date");

    // Example tasks (Replace with real data)
    const tasks = {
        5: ["Comp 4020"],
        10: ["Comp 3020"],
        18: ["Math Exam"],
        22: ["Project Due"]
    };

    // Weekdays and correct start position
    const daysInMonth = 31;
    const firstDay = 5; // March 1st was Saturday (0 = Sunday, 6 = Friday)

    // Fill empty days before the 1st
    for (let i = 0; i < firstDay; i++) {
        let emptyDay = document.createElement("div");
        emptyDay.classList.add("day");
        emptyDay.style.visibility = "hidden";
        calendar.appendChild(emptyDay);
    }

    // Generate calendar
    for (let day = 1; day <= daysInMonth; day++) {
        let dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = day;

        // If task exists, add event
        if (tasks[day]) {
            dayElement.classList.add("task-day");
            dayElement.onclick = function () {
                updateTaskList(day, tasks[day]);
            };
        }

        calendar.appendChild(dayElement);
    }

    // Function to update the task list
    function updateTaskList(day, taskArray) {
        taskList.innerHTML = ""; // Clear old tasks
        taskDate.textContent = "Tasks for March " + day;
        taskArray.forEach(task => {
            let taskItem = document.createElement("li");
            taskItem.textContent = task;
            taskList.appendChild(taskItem);
        });
    }
});

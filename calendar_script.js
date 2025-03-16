document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    
    // Example tasks (Update with real data)
    const tasks = {
        5: ["Comp 4020"],
        10: ["Comp 3020"],
        18: ["Math Exam"],
        22: ["Project Due"]
    };

    // Generate calendar
    for (let day = 1; day <= 31; day++) {
        let dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = day;

        // Highlight if task exists
        if (tasks[day]) {
            dayElement.classList.add("task-day");
            dayElement.onclick = function () {
                alert("Tasks for " + day + ": " + tasks[day].join(", "));
            };
        }

        calendar.appendChild(dayElement);
    }
});

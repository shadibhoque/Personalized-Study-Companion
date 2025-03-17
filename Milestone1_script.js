document.getElementById("add-task-btn").addEventListener("click", function () {
    const taskName = document.getElementById("task-name-input").value.trim(); // Get the task name

    if (taskName === "") {
        alert("Please enter a task name.");
        return;
    }

    const taskContainer = document.getElementById("task-container");

    // Create task div
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Create button for task name with user input
    const taskButton = document.createElement("button");
    taskButton.classList.add("task-button");
    taskButton.textContent = taskName; // Set task name to user input

    // Create task weight container
    const weightContainer = document.createElement("div");
    weightContainer.classList.add("task-weight-container");

    // Create input for task weight
    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.classList.add("task-weight");
    weightInput.placeholder = "0";

    // Create percentage sign span
    const percentSpan = document.createElement("span");
    percentSpan.textContent = "%";

    // Append elements
    weightContainer.appendChild(weightInput);
    weightContainer.appendChild(percentSpan);

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskButton);
    taskDiv.appendChild(weightContainer);

    taskContainer.appendChild(taskDiv);

    // Clear the task name input field after adding the task
    document.getElementById("task-name-input").value = "";
});

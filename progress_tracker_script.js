// Back Button Functionality
function goBack() {
    window.history.back();
}

// Initialize the chart instance
let chartInstance;
let currentGraph = 1; // Track the current graph state

// Function to toggle graphs
function toggleGraph() {
    const graphCanvas = document.getElementById("graphCanvas");
    const toggleText = document.querySelector(".toggle-text");

    // Destroy existing graph before drawing a new one
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Switch between graphs
    if (currentGraph === 1) {
        drawGraph2();
        toggleText.textContent = "Monthly";
        currentGraph = 2;
    } else {
        drawGraph1();
        toggleText.textContent = "Yearly";
        currentGraph = 1;
    }
}

// Function to draw the first graph
function drawGraph1() {
    const ctx = document.getElementById("graphCanvas").getContext("2d");
    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["A", "B", "C", "D"],
            datasets: [{
                label: "Progress Data 1",
                data: [12, 19, 3, 5],
                backgroundColor: "blue"
            }]
        }
    });
}

// Function to draw the second graph
function drawGraph2() {
    const ctx = document.getElementById("graphCanvas").getContext("2d");
    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["X", "Y", "Z", "W"],
            datasets: [{
                label: "Progress Data 2",
                data: [5, 10, 15, 20],
                borderColor: "red",
                fill: false
            }]
        }
    });
}

// Draw the initial graph on page load
window.onload = drawGraph1;

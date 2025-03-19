// Store leaderboard data in localStorage
function getLeaderboardData() {
    const data = localStorage.getItem('leaderboard') || '[]';
    return JSON.parse(data);
}

function saveLeaderboardData(data) {
    localStorage.setItem('leaderboard', JSON.stringify(data));
}

// Function to load users from the text file
async function loadUsers() {
    try {
        const response = await fetch('users.txt');
        const text = await response.text();
        return text.split('\n').map(user => user.trim()).filter(user => user);
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
}

// Function to save users to the text file
async function saveUsers(users) {
    try {
        const response = await fetch('users.txt', {
            method: 'PUT',
            body: users.join('\n')
        });
        return response.ok;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
    }
}

// Function to add a user to the leaderboard
async function addUser(username) {
    const leaderboardData = getLeaderboardData();
    
    // Check if user is already on leaderboard
    if (leaderboardData.some(entry => entry.name === username)) {
        return false;
    }
    
    // Add user with random initial progress
    leaderboardData.push({
        name: username,
        progress: Math.floor(Math.random() * 100)
    });
    
    saveLeaderboardData(leaderboardData);
    return true;
}

// Function to get username suggestions based on input
async function getUserSuggestions(input) {
    const users = await loadUsers();
    const leaderboardData = getLeaderboardData();
    const usedUsers = new Set(leaderboardData.map(entry => entry.name));
    
    return users
        .filter(user => !usedUsers.has(user)) // Filter out users already on leaderboard
        .filter(user => user.toLowerCase().includes(input.toLowerCase()));
}

// Function to check if a username exists in users.txt
async function validateUsername(username) {
    const users = await loadUsers();
    return users.includes(username);
}

// Function to get user progress (mock data for now)
function getUserProgress(username) {
    const mockProgress = {
        'Walter': 80,
        'Saul': 70,
        'Fring': 50
    };
    return mockProgress[username] || Math.floor(Math.random() * 100);
} 
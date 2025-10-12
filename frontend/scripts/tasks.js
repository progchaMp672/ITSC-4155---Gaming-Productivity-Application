// Store our game data
let level = 1;
let currentXP = 5;
let maxXP = 10;
let gold = 5;
let tasksCompleted = 0;
let rolls = 0;

// When page loads, set up everything
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    setupTaskCheckboxes();
    setupAddTaskButton();
});

// Update the XP progress bar
function updateProgressBar() {
    let xpBar = document.getElementById('xpBar');
    let percentage = (currentXP / maxXP) * 100;
    xpBar.style.width = percentage + '%';
}

// Update the display on screen
function updateDisplay() {
    document.getElementById('currentXP').textContent = currentXP;
    document.getElementById('maxXP').textContent = maxXP;
    document.getElementById('goldAmount').textContent = gold;
    document.getElementById('levelDisplay').textContent = 'LEVEL ' + level;
    document.getElementById('rollCount').textContent = rolls;
    updateProgressBar();
}

// When a task is checked
function setupTaskCheckboxes() {
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.closest('.tasks')) {
            let checkbox = e.target;
            let label = checkbox.parentElement;
            
            if (checkbox.checked) {
                // Task completed!
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.6';
                
                // Give rewards
                currentXP += 10;
                gold += 5;
                rolls += 1;
                tasksCompleted += 1;
                
                // Update screen
                updateDisplay();
                
                // Add message to log
                addToLog('Task completed! +10 XP, +5 Gold, +1 Roll');
                
                // Check if leveled up
                checkLevelUp();
                
                // Check achievements
                checkAchievements();
            } else {
                // Task unchecked
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
            }
        }
    });
}

// Check if player leveled up
function checkLevelUp() {
    if (currentXP >= maxXP) {
        level += 1;
        currentXP = currentXP - maxXP;
        maxXP = Math.floor(maxXP * 1.5);
        updateDisplay();
        addToLog('🎉 LEVEL UP! You are now level ' + level + '!');
    }
}

// Check for achievements
function checkAchievements() {
    if (tasksCompleted === 5) {
        document.getElementById('recentAchievement').textContent = 'Task Master: Complete 5 tasks';
        addToLog('🏆 Achievement: Task Master!');
    }
    if (tasksCompleted === 10) {
        document.getElementById('recentAchievement').textContent = 'Task Veteran: Complete 10 tasks';
        addToLog('🏆 Achievement: Task Veteran!');
    }
}

// Add message to the log
function addToLog(message) {
    let logSection = document.querySelector('.log article');
    let newMessage = document.createElement('p');
    newMessage.textContent = message;
    logSection.appendChild(newMessage);
    
    // Auto-scroll to bottom
    let logBox = document.querySelector('.log');
    logBox.scrollTop = logBox.scrollHeight;
}

// Add new task when button clicked
function setupAddTaskButton() {
    let addButton = document.getElementById('addTaskButton');
    let input = document.getElementById('newTaskInput');
    
    addButton.addEventListener('click', function() {
        let taskText = input.value.trim();
        
        if (taskText !== '') {
            // Create new task
            let taskList = document.querySelector('.tasks ul');
            let newTask = document.createElement('li');
            let label = document.createElement('label');
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + taskText));
            newTask.appendChild(label);
            taskList.appendChild(newTask);
            
            // Clear input
            input.value = '';
            addToLog('New task added: ' + taskText);
        }
    });
    
    // Add task when Enter key is pressed
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });
}
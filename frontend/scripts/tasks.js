// Game data
let level = 1;
let currentXP = 5;
let maxXP = 10;
let gold = 5;
let tasksCompleted = 0;
let rolls = 0;
let sessionXPGained = 0;

// When page loads, set up everything
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    setupTaskCheckboxes();
    setupAddTaskButton();
});

// Updates the XP progress bar
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
    const xpTotalEl = document.getElementById('xpGainedTotal');
    if (xpTotalEl) xpTotalEl.textContent = sessionXPGained;
    updateProgressBar();
}

// When a task is checked effects
function setupTaskCheckboxes() {
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.closest('.tasks')) {
            let checkbox = e.target;
            let label = checkbox.parentElement;

            if (checkbox.checked) {
                // Task completed!
                const taskText = (label.textContent || '').trim();

                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.6';

                // Rewards fixed amounts
                currentXP      += 10;
                gold           += 5;
                rolls          += 1;
                tasksCompleted += 1;
                sessionXPGained += 10;

                // Update display
                updateDisplay();

                // ---- LOG LINES ----
                // Permanent history line:
                addToLog('You completed: ' + taskText);

                // Temporary reward lines / automatically disappear:
                addToLogTemp('You gain 10 XP!');
                addToLogTemp('You gain 5 gold!');
                addToLogTemp('🎲 +1 Roll');

                // Level/achievements
                checkLevelUp();
                checkAchievements();

                // Prevent double counting this task
                checkbox.disabled = true;

            } else {
                // If ever unchecked (rare, since we disable), restore style
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

// Add a TEMPORARY message to the log that auto-removes (default 2.5s)
function addToLogTemp(message, ms = 2500) {
    const logSection = document.querySelector('.log article');
    const p = document.createElement('p');
    p.textContent = message;
    p.classList.add('fade-out');
    logSection.appendChild(p);

    const logBox = document.querySelector('.log');
    logBox.scrollTop = logBox.scrollHeight;

    // fade-out then remove
    setTimeout(() => {
        p.classList.add('fading');
        setTimeout(() => {
            if (p.parentNode) p.parentNode.removeChild(p);
        }, 400);
    }, ms);
}

// Add new task when button clicked
function setupAddTaskButton() {
    let addButton = document.getElementById('addTaskButton');
    let input = document.getElementById('newTaskInput');

    if (!addButton || !input) return;

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

    // Task when Enter key is pressed
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });
}

// Simple function to update XP bar percentage

const API_URL = "https://web-production-75f23.up.railway.app/tasks";

const taskList = document.querySelector(".tasks ul");
const addTaskButton = document.getElementById("addTaskButton");
const newTaskTitleInput = document.getElementById("newTaskTitleInput");
const newTaskDescriptionInput = document.getElementById("newTaskDescriptionInput");
const newTaskDueDateInput = document.getElementById("newTaskDueDateInput");



function updateXPBar() {
    const currentXP = parseInt(document.getElementById('currentXP').textContent || "0", 10);
    const maxXP = parseInt(document.getElementById('maxXP').textContent || "10", 10);
    const xpBar = document.getElementById('xpBar');
    const percentage = maxXP > 0 ? (currentXP / maxXP) * 100 : 0;
    xpBar.style.width = percentage + '%';
}

document.addEventListener("DOMContentLoaded", () => {
    updateXPBar();
    loadTasks();
  });

/* ===============================================================================
                                LOADING TASK LIST
===============================================================================*/

function renderTask(task) {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "10px";
    li.style.marginBottom = "10px";
    li.style.borderRadius = "8px";
    li.style.backgroundColor = task.category.color || "#ddd";
    li.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    li.style.color = "rgba(0,0,0,.7)";
  /*
    const dueDateText = task.due_date
      ? `<p style="margin: 5px 0 0 0; font-size: 0.8em;">Due: ${new Date(task.due_date).toLocaleDateString()}</p>`
      : "";
  
    li.innerHTML = `
      <div>
        <label>
          <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
          <strong>${task.title}</strong>
          <p style="margin: 5px 0 0 0; font-size: 0.8em; font-style: italic;">Category: ${task.category ? task.category.name : "Uncategorized"}</p>
        </label>
        <p style="margin: 5px 0 0 0; font-size: 0.9em;">${task.description || ""}</p>
        ${dueDateText}
      </div>
      <button class="delete-btn" data-id="${task.id}" style="background: none; border: none; font-size: 1.2em; cursor: pointer;">🗑</button>
    `;
*/
    const wrapper = document.createElement("div");

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.id = task.id;
    checkbox.checked = !!task.completed;

    const titleStrong = document.createElement("strong");
    titleStrong.textContent = task.title; // SAFE

    const categoryP = document.createElement("p");
    categoryP.style.margin = "5px 0 0 0";
    categoryP.style.fontSize = "0.8em";
    categoryP.style.fontStyle = "italic";
    categoryP.textContent =
      " Category: " + (task.category ? task.category.name : "Uncategorized");

    const descP = document.createElement("p");
    descP.style.margin = "5px 0 0 0";
    descP.style.fontSize = "0.9em";
    descP.textContent = task.description || "";

    label.appendChild(checkbox);
    label.appendChild(titleStrong);
    label.appendChild(categoryP);

    wrapper.appendChild(label);
    wrapper.appendChild(descP);

    if (task.due_date) {
      const dueP = document.createElement("p");
      dueP.style.margin = "5px 0 0 0";
      dueP.style.fontSize = "0.8em";
      dueP.textContent = "Due: " + new Date(task.due_date).toLocaleDateString();
      wrapper.appendChild(dueP);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.dataset.id = task.id;
    deleteBtn.style.background = "none";
    deleteBtn.style.border = "none";
    deleteBtn.style.fontSize = "1.2em";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.textContent = "🗑";

    li.appendChild(wrapper);
    li.appendChild(deleteBtn);
  
    taskList.appendChild(li);
  }

async function loadTasks() {
  const userId = Number(localStorage.getItem("user_id"));
  if (!userId) {
    taskList.innerHTML = "";
    return;
  }

  const res = await fetch(`${API_URL}?user_id=${userId}`);
  if (!res.ok) {
    console.error("Failed to fetch tasks", await res.text());
    return;
  }

  const tasks = await res.json();
  taskList.innerHTML = "";
  tasks.forEach(task => renderTask(task));
}


/* ===============================================================================
                                ADD NEW TASK FUNCTION
                                  Need info:

                                title
                                description
                                priority
                                due date (optional)
                                completed at (optional)
                                points_reward
                                user_id (from backend)
                                category_id(maybe from a button?)

===============================================================================*/

const categoryButtons = document.querySelectorAll("#categoryButtons button");
let selectedCategoryId = null;

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedCategoryId = button.dataset.id;
      categoryButtons.forEach((btn) => (btn.style.outline = "none"));
      button.style.outline = "10px solid white"; // highlight selected category
    });
  });

addTaskButton.addEventListener("click", async () => {
    const title = newTaskTitleInput.value.trim();
    const description = newTaskDescriptionInput.value.trim();
    const dueDate = newTaskDueDateInput.value
        ? new Date(newTaskDueDateInput.value).toISOString()
        : null;

    const userId = Number(localStorage.getItem("user_id"));
    if (!userId) {
        alert("You must be logged in to create tasks!");
        return;
    }

    if (!title) return alert("Please enter a name for your new task!");
    if (!selectedCategoryId) return alert("Please select a category!");


    const newTask = {
        title,
        description,
        due_date: dueDate,
        user_id: userId,
        category_id: parseInt(selectedCategoryId, 10),
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("Failed to create task:", err);
            alert("Failed to create task: " + err);
            return;
        }

        const createdTask = await res.json();

        renderTask(createdTask);
        addToLog(`New task added: ${createdTask.title}`);
        showNotification("Task Created Successfully!");

        // reset form
        newTaskTitleInput.value = "";
        newTaskDescriptionInput.value = "";
        newTaskDueDateInput.value = "";
        categoryButtons.forEach((btn) => (btn.style.outline = "none"));
        selectedCategoryId = null;

    } catch (error) {
        console.error("Error creating task:", error);
        alert("An error occurred: " + error.message);
    }
});

    
        /*if (res.ok) {
            const createdTask = await res.json();
          
            // render it immediately
            renderTask(createdTask);
          
            // then reset inputs
            newTaskTitleInput.value = "";
            newTaskDescriptionInput.value = "";
            newTaskDueDateInput.value = "";
            categoryButtons.forEach(btn => btn.style.outline = "none");
            selectedCategoryId = null;
        } else {
          const err = await res.text();
          console.error("Failed to create task:", err);
          alert("Failed to create task"+ err.message);
        }
      } catch (error) {
        console.error("Error creating task:", error);
        alert("An error occurred: "+ error.message);
      }
    });
    */

/* ===============================================================================
                                COMPLETE TASK FUNCTION  
===============================================================================*/
taskList.addEventListener("change", async (e) => {
  if (!e.target.matches("input[type='checkbox']")) return;

  const id = e.target.dataset.id;
  const completed = e.target.checked;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to update task:", err);
      alert("Failed to update task");
      e.target.checked = !completed; // revert checkbox
      return;
    }

    if (completed) {
      const label = e.target.closest("label");
      const li = e.target.closest("li");
      const taskText = (label && label.textContent.trim()) || "Task";

      if (label) {
        label.style.textDecoration = "line-through";
        label.style.opacity = "0.6";
      }

      addToLog(`You completed: ${taskText}`);
      addToLogTemp("You gained 5 gold and 7 EXP!");
      showNotification("Task Completed! EXP and Gold awarded!");
      createCelebrationParticles();
      showXPPopup(`+7 XP, +5 Gold`);

      const userId = Number(localStorage.getItem("user_id"));
      if (window.updateTaskCompletedCount) {
        await window.updateTaskCompletedCount(userId);
      }

      const rollKey = `rolls_user_${userId}`;
      let numberOfRolls = Number(localStorage.getItem(rollKey)) || 0;
      numberOfRolls += 1;
      localStorage.setItem(rollKey, numberOfRolls);

      const rollCountEl = document.getElementById("rollCount");
      if (rollCountEl) rollCountEl.textContent = numberOfRolls;
      showRollPopup("+1 Roll");

      // Prevent double-counting this task
      e.target.disabled = true;

      // Fade out and remove the task after a short delay
      setTimeout(() => {
        if (!li) return;
        li.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        li.style.opacity = "0";
        li.style.transform = "translateX(50px)";
        setTimeout(() => li.remove(), 500);
      }, 2000);
    }

    // Refresh core stats from backend
    if (window.refreshUserStats) {
      await window.refreshUserStats();
    } else {
      updateXPBar();
    }

    // Refresh achievements + streak from backend so UI updates immediately
    const userId = Number(localStorage.getItem("user_id"));
    if (userId) {
      if (window.loadLatestAchievement) {
        await window.loadLatestAchievement(userId);
      }
      if (window.loadUserStreak) {
        await window.loadUserStreak(userId);
      }
    }
  } catch (error) {
    console.error("Error updating task:", error);
    alert("An error occurred while updating the task");
  }
});

  /* ===============================================================================
                                DELETE TASK FUNCTION  
===============================================================================*/

taskList.addEventListener("click", async (e) => {
    if (e.target.matches(".delete-btn")) {
      const id = e.target.dataset.id;
      if(!confirm("Are you sure you want to delete this task?")) return;

      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) {
          loadTasks();
          addToLog("Task deleted.");
        } else {
          alert("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("An error occurred while deleting the task");
      }
    }
  });

  
/* REMOVED FOR MERGING 
// Game data
let level = 1;
let currentXP = 5;
let maxXP = 10;
let gold = 5;
let tasksCompleted = 0;
let rolls = 0;
let sessionXPGained = 0;
*/

/* REMOVED FOR MERGING --> conflicts with backend

// When page loads, set up everything
document.addEventListener('DOMContentLoaded', function() {
    
  
  ssBar();
    setupTaskCheckboxes();
    setupAddTaskButton();
});

*/

/* REMOVED FOR MERGE --> the updateXPBar method works with the backend

// Updates the XP progress bar
function updateProgressBar() {
    let xpBar = document.getElementById('xpBar');
    let percentage = (currentXP / maxXP) * 100;
    xpBar.style.width = percentage + '%';
}
*/

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

/* REMOVED FOR MERGING, my code does this, it will just need to add rewards and XP and such

// When a task is checked effects
function setupTaskCheckboxes() {
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.closest('.tasks')) {
            let checkbox = e.target;
            let label = checkbox.parentElement;
            let taskItem = label.parentElement;

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

                // Show notification and celebration!
                showNotification('Task Completed! +10 XP, +5 Gold, +1 Roll!');
                createCelebrationParticles();

                // Prevent double counting this task
                checkbox.disabled = true;

                setTimeout(() => {
                    taskItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    taskItem.style.opacity = '0';
                    taskItem.style.transform = 'translateX(50px)';
                    
                    // Remove from DOM after fade animation completes
                    setTimeout(() => {
                        taskItem.remove();
                    }, 500);
                }, 2000);

            } else {
                // If ever unchecked (rare, since we disable), restore style
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
            }
        }
    });
}

*/
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
        document.getElementById('recentAchievement').textContent = 'Task Rookie: Complete 5 tasks';
        addToLog('🏆 Achievement: Task Rookie!');
    }
    if (tasksCompleted === 10) {
        document.getElementById('recentAchievement').textContent = 'Task Pro: Complete 10 tasks';
        addToLog('🏆 Achievement: Task Pro!');
    }
    if (tasksCompleted === 20) {
        document.getElementById('recentAchievement').textContent = 'Task Master: Complete 20 tasks';
        addToLog('🏆 Achievement: Task Master!');
    }
}

// Add message to the log
function addToLog(message) {
    const logSection = document.querySelector('.log article');
    if (!logSection) return;
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    logSection.appendChild(newMessage);

    const logBox = document.querySelector('.log');
    if (logBox) {
        logBox.scrollTop = logBox.scrollHeight;
    }
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


// Show notification toast message
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        font-weight: bold;
        font-size: 16px;
        z-index: 10000;
        animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 2.5s forwards;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Add celebration particles when task completed
function createCelebrationParticles() {
    const colors = ['⭐', '✨', '💫', '🌟'];
    const statsBox = document.querySelector('.stats');
    const rect = statsBox.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = colors[Math.floor(Math.random() * colors.length)];
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + rect.height / 2}px;
                font-size: 20px;
                pointer-events: none;
                z-index: 9999;
                animation: floatUp 1.5s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1500);
        }, i * 100);
    }
}

function showXPPopup(text = "+7 XP, +5 Gold") {
  const statsBox = document.querySelector(".stats");
  if (!statsBox) return;

  const rect = statsBox.getBoundingClientRect();
  const popup = document.createElement("div");
  popup.textContent = text;
  popup.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top - 10}px;
    transform: translateX(-50%);
    padding: 8px 14px;
    background: rgba(106, 190, 255, 0.95);
    color: #0b1020;
    border-radius: 999px;
    font-weight: bold;
    font-size: 14px;
    z-index: 10001;
    pointer-events: none;
    animation: xpFloat 1.2s ease-out forwards;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1200);
}

function showRollPopup(text = "+1 Roll") {
  const rollBtn = document.getElementById("rollButton");
  if (!rollBtn) return;

  const rect = rollBtn.getBoundingClientRect();
  const popup = document.createElement("div");
  popup.textContent = text;
  popup.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top - 10}px;
    transform: translateX(-50%);
    padding: 6px 12px;
    background: rgba(255, 215, 0, 0.95);
    color: #3b2a00;
    border-radius: 999px;
    font-weight: bold;
    font-size: 14px;
    z-index: 10001;
    pointer-events: none;
    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
    animation: xpFloat 1.1s ease-out forwards;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1100);
}


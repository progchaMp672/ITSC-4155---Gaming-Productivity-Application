// Simple function to update XP bar percentage

const API_URL = "http://127.0.0.1:8000/tasks";

const taskList = document.querySelector(".tasks ul");
const addTaskButton = document.getElementById("addTaskButton");
const newTaskTitleInput = document.getElementById("newTaskTitleInput");
const newTaskDescriptionInput = document.getElementById("newTaskDescriptionInput");
const newTaskDueDateInput = document.getElementById("newTaskDueDateInput");



function updateXPBar() {
    const currentXP = parseInt(document.getElementById('currentXP').textContent);
    const maxXP = parseInt(document.getElementById('maxXP').textContent);
    const xpBar = document.getElementById('xpBar');
    const percentage = (currentXP / maxXP) * 100;
    xpBar.style.width = percentage + '%';
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateXPBar();
});

document.addEventListener("DOMContentLoaded", loadTasks);


/* ===============================================================================
                                LOADING TASK LIST
===============================================================================*/

async function loadTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
  
    taskList.innerHTML = "";
    tasks.forEach(task => {
      const li = document.createElement("li");

        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "10px";
        li.style.marginBottom = "10px";
        li.style.borderRadius = "8px";
        li.style.backgroundColor = task.category.color || "#ddd"; // fallback color
        li.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        li.style.color = "rgba(0,0,0,.7)";

        const dueDateText = task.due_date
            ? `<p style="margin: 5px 0 0 0; font-size: 0.8em;">Due: ${new Date(task.due_date).toLocaleDateString()}</p>`
            : "";

        li.innerHTML = `
            <div>
                <label>
                    <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
                    <strong>${task.title}</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.8em; font-style: italic;">Category: ${task.category.name}</p>
                </label>
                <br>

                <p style="margin: 5px 0 0 0; font-size: 0.9em;">${task.description || ""}</p>
                ${dueDateText}
                </div>
            <button class="delete-btn" data-id="${task.id}" style="background: none; border: none; font-size: 1.2em; cursor: pointer;">🗑</button>
        `;
        taskList.appendChild(li);
    });
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
      categoryButtons.forEach(btn => btn.style.outline = "none");
      button.style.outline = "10px solid white"; // highlight selected category
    });
  });

addTaskButton.addEventListener("click", async () => {
    const title = newTaskTitleInput.value.trim();
    const description = newTaskDescriptionInput.value.trim();
    const dueDate = newTaskDueDateInput.value ? new Date(newTaskDueDateInput.value).toISOString() : null;

    if(!title) return alert("Please enter a name for your new task!");
    if (!selectedCategoryId) return alert("Please select a category!");
    
    /*Fix this:
    Ordering by goal type, then by due date
    Make scrollable
    Make only visible when logged in

     */

    const newTask = {
        title,
        description,
        due_date: dueDate,
        user_id: 1,
        category_id: parseInt(selectedCategoryId)
    };
   
    try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask)
        });
    
        if (res.ok) {
          newTaskTitleInput.value = "";
          newTaskDescriptionInput.value = "";
          newTaskDueDateInput.value = "";
          categoryButtons.forEach(btn => btn.style.outline = "none");
          selectedCategoryId = null;
          loadTasks();
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

/* ===============================================================================
                                COMPLETE TASK FUNCTION  
===============================================================================*/

taskList.addEventListener("change", async (e) => {
    if (e.target.matches("input[type='checkbox']")) {
      const id = e.target.dataset.id;
      const completed = e.target.checked;
  
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed, user_id: 1, title: e.target.parentNode.textContent.trim() })
      });
  
      if (!res.ok) {
        alert("Failed to update task");
      }
    }
  });

  /* ===============================================================================
                                DELETE TASK FUNCTION  
===============================================================================*/

taskList.addEventListener("click", async (e) => {
    if (e.target.matches(".delete-btn")) {
      const id = e.target.dataset.id;
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadTasks();
      } else {
        alert("Failed to delete task");
      }
    }
  });
  











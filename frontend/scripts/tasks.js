// Simple function to update XP bar percentage

const API_URL = "http://127.0.0.1:8000/tasks";

const taskList = document.querySelector(".tasks ul");
const addTaskButton = document.getElementById("addTaskButton");
const newTaskTitleInput = document.getElementById("newTaskTitleInput");
const newTaskDescriptionInput = document.getElementById("newTaskDescriptionInput");


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
      li.innerHTML = `
        <label>
          <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
          ${task.title}
        </label>
        <button class="delete-btn" data-id="${task.id}">🗑</button>
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

addTaskButton.addEventListener("click", async () => {
    const title = newTaskTitleInput.value.trim();
    const description = newTaskDescriptionInput.value.trim();

    if(!title) return alert("Please enter a name for your new task!");
    

    const newTask = {
        title,
        description: "",
        user_id: 1
    };

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(newTask)
    })

    if (res.ok) {
        newTaskTitleInput.value = "";
        loadTasks();
    } else {
        alert("Failed to create task");
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
  











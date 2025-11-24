const API_BASE = "https://web-production-75f23.up.railway.app";

async function refreshUserStats() {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  const response = await fetch(`${API_BASE}/users/${userId}`);
  if (!response.ok){ 
    console.error("Failed to fetch user data", await response.text());
    throw new Error("User not found");
  }

  const userData = await response.json();

  const statsHeader = document.querySelector(".stats h2");
  if (statsHeader) {
    statsHeader.textContent = `${userData.username || "Player"} Stats`;
  }

  // Compute level, XP, and xp thresholds
  const level = userData.level ?? 1;
  const xpCurrent = userData.exp ?? 0;
  const xpMax = level * 10; // EXP scales by 10 each level

  // Update numerical displays
  const currentXPEl = document.getElementById("currentXP");
  const maxXPEl = document.getElementById("maxXP");
  const goldAmountEl = document.getElementById("goldAmount");
  const levelDisplayEl = document.getElementById("levelDisplay");

  if (currentXPEl) currentXPEl.textContent = xpCurrent;
  if (maxXPEl) maxXPEl.textContent = xpMax;
  if (goldAmountEl) goldAmountEl.textContent = userData.gold ?? 0;
  if (levelDisplayEl) levelDisplayEl.textContent = `LEVEL ${level}`;

  const xpBar = document.getElementById("xpBar");
  const percent = Math.min((xpCurrent / xpMax) * 100, 100);

  if (xpBar) xpBar.style.width = `${percent}%`;
}

// Load and display user's current streak
async function loadUserStreak(userId) {
  const streakCountEl = document.getElementById("streakCount");
  if (!streakCountEl) return;

  try {
    const res = await fetch(`${API_BASE}/streaks`);
    if (!res.ok) {
      console.error("Failed to load streaks:", await res.text());
      streakCountEl.textContent = "0";
      return;
    }

    const allStreaks = await res.json();
    const userStreaks = allStreaks.filter(
      (s) => s.user_id === userId
    );

    if (!userStreaks.length) {
      streakCountEl.textContent = "0";
      return;
    }

    let streak =
      userStreaks.find((s) => s.streak_type === "daily_tasks") ||
      userStreaks.sort((a, b) => b.current_streak - a.current_streak)[0];

    streakCountEl.textContent = streak.current_streak ?? 0;
  } catch (err) {
    console.error("Error loading streak:", err);
    streakCountEl.textContent = "0";
  }
}
// Load and display user's latest achievement
async function loadLatestAchievement(userId) {
  const achievementEl = document.getElementById("recentAchievement");
  const achievementListEl = document.getElementById("achievementList");
  if (!achievementEl || !achievementListEl) return;

  try {
    const res = await fetch(`${API_BASE}/tasks?user_id=${userId}`);
    if (!res.ok) {
      console.error("Failed to load tasks for achievements:", await res.text());
      achievementEl.textContent = "Achievements unavailable";
      return;
    }

    const tasks = await res.json();

    // Count how many tasks THIS user has completed
    const completedCount = tasks.filter(
      (t) => t.completed
    ).length;

    // Our milestones
    const milestones = [
      { name: "Task Rookie", threshold: 5, text: "Task Rookie: Complete 5 tasks" },
      { name: "Task Pro", threshold: 10, text: "Task Pro: Complete 10 tasks" },
      { name: "Task Master", threshold: 20, text: "Task Master: Complete 20 tasks" },
    ];

    // Update the list: add/remove .achieved
    achievementListEl.querySelectorAll("li[data-name]").forEach((li) => {
      const milestone = milestones.find((m) => m.name === li.dataset.name);
      if (milestone && completedCount >= milestone.threshold) {
        li.classList.add("achieved");
      } else {
        li.classList.remove("achieved");
      }
    });

    // Figure out the "latest" achievement reached (highest threshold <= completedCount)
    let latest = null;
    for (const milestone of milestones) {
      if (completedCount >= milestone.threshold) {
        latest = milestone;
      }
    }

    if (!latest) {
      achievementEl.textContent = "No achievements yet!";
    } else {
      achievementEl.textContent = latest.text;
    }
  } catch (err) {
    console.error("Error computing achievements from tasks:", err);
    achievementEl.textContent = "Achievements unavailable";
  }
}
// Update and display count of completed tasks
async function updateTaskCompletedCount(userId) {
  const el = document.getElementById("taskCompletedCount");
  if (!el) return;

  try {
    const res = await fetch(`${API_BASE}/tasks?user_id=${userId}`);
    if (!res.ok) {
      console.error("Failed to fetch tasks for completion count", await res.text());
      return;
    }

    const tasks = await res.json();
    const completed = tasks.filter(
      (t) => t.completed
    ).length;

    el.textContent = completed;
  } catch (err) {
    console.error("Error counting completed tasks:", err);
  }
}
// Claim daily bonus for user
async function claimDailyBonus() {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  const btn = document.getElementById("dailyBonusButton");
  const msgEl = document.getElementById("dailyBonusMessage");

  try {
    if (btn) btn.disabled = true;

    const res = await fetch(`${API_BASE}/users/${userId}/daily-bonus`, {
      method: "POST",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to claim bonus:", text);

      //If it has been claimed, backend sends error 400
      if (res.status === 400 && msgEl) {
        msgEl.textContent = "Daily bonus already claimed today.";
      } else if (msgEl) {
        msgEl.textContent = "Could not claim bonus.";
      }

      return;
    }

    const data = await res.json();

    if (msgEl) {
      msgEl.textContent = "Daily bonus claimed! +20 XP";
    }

    //Pulls fresh stats so XP bar + level update
    if (window.refreshUserStats) {
      await window.refreshUserStats();
    }
  } catch (err) {
    console.error("Error claiming daily bonus:", err);
    if (msgEl) msgEl.textContent = "Error claiming bonus.";
  }
}
// Initialize and display user's roll count from localStorage
function initRollsDisplay() {
  const userId = Number(localStorage.getItem("user_id"));
  const rollCountEl = document.getElementById("rollCount");
  if (!userId || !rollCountEl) return;

  const rollKey = `rolls_user_${userId}`;
  const rolls = Number(localStorage.getItem(rollKey)) || 0;
  rollCountEl.textContent = rolls;
}


// Expose functions globally for use in other scripts
window.refreshUserStats = refreshUserStats;
window.loadUserStreak = loadUserStreak;
window.loadLatestAchievement = loadLatestAchievement;
window.updateTaskCompletedCount = updateTaskCompletedCount;

document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user_id");

  // If not logged in, send them to login page
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const uid = localStorage.getItem("user_id");

      if (uid) {
        localStorage.removeItem("user_id");
        localStorage.removeItem(`rolls_user_${uid}`);
      }

      window.location.href = "login.html";
    });
  }

  try {
    await refreshUserStats();
    await Promise.all([
      loadUserStreak(userId),
      loadLatestAchievement(userId),
      updateTaskCompletedCount(userId),
    ]);
  } catch (err) {
    console.error("Error loading user data:", err);
  }

  initRollsDisplay();

  const dailyBonusButton = document.getElementById("dailyBonusButton");
  if (dailyBonusButton) {
    dailyBonusButton.addEventListener("click", claimDailyBonus);
  }
});
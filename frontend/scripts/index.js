const API_BASE = "http://127.0.0.1:8000";

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

async function loadLatestAchievement(userId) {
  const achievementEl = document.getElementById("recentAchievement");
  const achievementListEl = document.getElementById("achievementList");
  if (!achievementEl || !achievementListEl) return;

  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) {
      console.error("Failed to load tasks for achievements:", await res.text());
      achievementEl.textContent = "Achievements unavailable";
      return;
    }

    const allTasks = await res.json();

    // Count how many tasks THIS user has completed
    const completedCount = allTasks.filter(
      (t) => t.user_id === Number(userId) && t.completed
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

async function updateTaskCompletedCount(userId) {
  const el = document.getElementById("taskCompletedCount");
  if (!el) return;

  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) {
      console.error("Failed to fetch tasks for completion count");
      return;
    }

    const tasks = await res.json();
    const completed = tasks.filter(
      (t) => t.user_id === Number(userId) && t.completed
    ).length;

    el.textContent = completed;
  } catch (err) {
    console.error("Error counting completed tasks:", err);
  }
}




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
});
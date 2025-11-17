/*
document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      // Not logged in — redirect to login page
      window.location.href = "login.html";
      return;
    }

    try {
      // Adjust this route to match your backend
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}`);
      if (!response.ok) throw new Error("User not found");

      const userData = await response.json();
      // Update header
      const statsHeader = document.querySelector(".stats h2");
      if (statsHeader) statsHeader.textContent = `${userData.username || userData.display_name || "Player"} Stats`;

      // Update stats values
      document.getElementById("currentXP").textContent = userData.exp ?? 0;
      document.getElementById("goldAmount").textContent = userData.gold ?? 0;
      document.getElementById("levelDisplay").textContent = `LEVEL ${userData.level ?? userData.points ?? 1}`;

      // Update XP bar
      const xpBar = document.getElementById("xpBar");
      const xpMax = userData.max_xp ?? 10;
      const xpCurrent = userData.exp ?? 0;
      const percent = Math.min((xpCurrent / xpMax) * 100, 100);
      xpBar.style.width = `${percent}%`;

    } catch (err) {
      console.error("Error loading user data:", err);
    }
  });
/*/
const API_BASE = "http://127.0.0.1:8000";

async function refreshUserStats() {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  const response = await fetch(`${API_BASE}/users/${userId}`);
  if (!response.ok) throw new Error("User not found");

  const userData = await response.json();

  const statsHeader = document.querySelector(".stats h2");
  if (statsHeader) {
    statsHeader.textContent = `${userData.username || "Player"} Stats`;
  }

  const currentXPEl = document.getElementById("currentXP");
  const goldAmountEl = document.getElementById("goldAmount");
  const levelDisplayEl = document.getElementById("levelDisplay");

  if (currentXPEl) currentXPEl.textContent = userData.exp ?? 0;
  if (goldAmountEl) goldAmountEl.textContent = userData.gold ?? 0;
  if (levelDisplayEl) {
    levelDisplayEl.textContent = `LEVEL ${userData.level ?? 1}`;
  }

  const xpBar = document.getElementById("xpBar");
  const xpMax = userData.max_xp ?? 10;   // fallback for now
  const xpCurrent = userData.exp ?? 0;
  const percent = Math.min((xpCurrent / xpMax) * 100, 100);

  if (xpBar) xpBar.style.width = `${percent}%`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user_id");

  // If not logged in, send them to login page
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  try {
    await refreshUserStats();
  } catch (err) {
    console.error("Error loading user data:", err);
  }
});
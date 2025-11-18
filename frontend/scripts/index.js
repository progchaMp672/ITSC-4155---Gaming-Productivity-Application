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

  const level = userData.level ?? 1;
  const xpCurrent = userData.exp ?? 0;
  const xpMax = level * 10; // EXP scales by 10 each level

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

window.refreshUserStats = refreshUserStats;

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
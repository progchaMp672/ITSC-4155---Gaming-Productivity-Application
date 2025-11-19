const character = document.getElementById('character');
const rollButton = document.getElementById('rollButton');

// Character starts on space 1
let currentSpace = 1;

function getRollKey() {
  const userId = localStorage.getItem('user_id');
  return userId ? `rolls_user_${userId}` : null;
}

function getCurrentRolls() {
  const key = getRollKey();
  if (!key) return 0;
  return Number(localStorage.getItem(key)) || 0;
}

function setCurrentRolls(value) {
  const key = getRollKey();
  if (!key) return;

  localStorage.setItem(key, String(value));

  const rollCountEl = document.getElementById('rollCount');
  if (rollCountEl) rollCountEl.textContent = value;
}

function updateRollUI() {
  setCurrentRolls(getCurrentRolls());
}

rollButton.addEventListener('click', () => {
  let rolls = getCurrentRolls();

  if (rolls <= 0) {
    alert("No rolls available! Complete more tasks to earn rolls.");
    return;
  }
  rolls -= 1;
  setCurrentRolls(rolls);

  const roll = Math.floor(Math.random() * 6) + 1;
  alert(`You rolled a ${roll}!`);

  if (rolls <= 0) {
    alert("No rolls available! Complete more tasks to earn rolls.");
    return;
  }

  // For testing: only 2 spaces exist
  if (currentSpace === 1 && roll >= 3) {
    moveToSpace(2);
  } else if (currentSpace === 2 && roll <= 3) {
    moveToSpace(1);
  } else {
    alert("You stay on your current space!");
  }
});

function moveToSpace(spaceNumber) {
  const targetSpace = document.getElementById(`space${spaceNumber}`);
  const rect = targetSpace.getBoundingClientRect(); // gets the position/size of the destination
  const mapRect = targetSpace.parentElement.getBoundingClientRect(); // gets the position of elements inside the map to move them around

  // Calculate relative position inside the map
  const x = rect.left - mapRect.left + rect.width / 2 - 20; // offset by half character size
  const y = rect.top - mapRect.top - 10;

  character.style.left = `${x}px`;
  character.style.top = `${y}px`;

  currentSpace = spaceNumber;
}

// Initialize on space 1 after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  moveToSpace(1);
  updateRollUI();
});


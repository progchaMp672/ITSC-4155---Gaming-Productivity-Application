const character = document.getElementById('character');
const rollButton = document.getElementById('rollButton');

// Character starts on space 1
let currentSpace = 1;

rollButton.addEventListener('click', () => {
  // Simulate a die roll (1–6)
  const roll = Math.floor(Math.random() * 6) + 1;
  alert(`You rolled a ${roll}!`);

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
document.addEventListener("DOMContentLoaded", () => moveToSpace(1));

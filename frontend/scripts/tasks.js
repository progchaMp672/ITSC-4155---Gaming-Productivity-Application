// Simple function to update XP bar percentage
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
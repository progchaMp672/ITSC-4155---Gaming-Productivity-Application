// Member details data
const memberDetails = {
    member1: {
        name: "Member 1",
        role: "Role",
        contributions: [
            "Contribuutions during the project goes here"
        ],
        tech: "Java"
    },
    member2: {
        name: "Member 2",
        role: "Role",
        contributions: [
            "Contribuutions during the project goes here"
        ],
        tech: "Java"
    },
    member3: {
        name: "Xia Lee",
        role: "Frontend Developer",
        contributions: [
            "Designed responsive UI with gaming-inspired aesthetics",
            "Implemented task creation and management interface",
            "Created interactive dashboard with real-time updates",
            "Developed CSS animations and transitions",
            "Created ERD diagrams for database schema design"
        ],
        tech: "HTML, CSS, JavaScript, UI/UX Design"
    },
    member4: {
        name: "Member 4",
        role: "Role",
        contributions: [
            "Contribuutions during the project goes here"
        ],
        tech: "Java"
    },
    member5: {
        name: "Member 5",
        role: "Role",
        contributions: [
            "Contribuutions during the project goes here"
        ],
        tech: "Java"
    }
};

// Modal functions
function openModal(memberId) {
    const modal = document.getElementById('memberModal');
    const details = memberDetails[memberId];
    
    document.getElementById('modalName').textContent = details.name;
    document.getElementById('modalRole').textContent = details.role;
    document.getElementById('modalTech').textContent = details.tech;
    
    const contributionsList = document.getElementById('modalContributions');
    contributionsList.innerHTML = '';
    details.contributions.forEach(contribution => {
        const li = document.createElement('li');
        li.textContent = contribution;
        contributionsList.appendChild(li);
    });
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('memberModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('memberModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Add fade-in animation on page load
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.team-member');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
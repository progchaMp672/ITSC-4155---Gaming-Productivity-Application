// Member details data
const memberDetails = {
    member1: {
        name: "Kei Vang",
        role: "Backend/Frontend Developer",
        contributions: [
            "Developed initial idea for project",
            "Implemented login logic",
            "Developed map and roll system for user interactivity",
            "Searched for images for map and character"
        ],
        tech: "HTML, Python, FastAPI, CSS, JavaScript, MySQL"
    },
    member2: {
        name: "Member 2",
        role: "Frontend/Backend Developer",
        contributions: [
            "Developed intial UI design concept", 
            "Implemented task manipulation logic using JavaScript",
            "Implemented task creation mechanic" ,
            "Implemented task completion mechanic", 
            "Connected task manipulation JavaScript to the MySQL Database",
            "Implemented a separate .env file with sensitive credentials securely stored outside the codebase."
        ],
        tech: "HTML, CSS, JavaScript, MySQL, FastAPI "
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
        name: "Alex Landeros Hernandez",
        role: "Backend Developer",
        contributions: [
            "Developed the backend API using Python and FastAPI",
            "Created Use Case Diagram to represent system interactions",
            "Designed and structured backend architecture using routers, models, and schemas for scalability",
            "Implemented data handling and business logic for achievement management"
        ],
        tech: "Python, FastAPI, Pydantic, API design, System Modeling, MySQL, Javascript, HTML"
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
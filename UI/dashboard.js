document.addEventListener("DOMContentLoaded", function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            this.querySelector('.dropdown-content').classList.toggle('show');
        });
    });

    loadContent('overview');
    loadUserList();
});

function loadContent(content) {
    document.querySelectorAll('.dashboard-panels > .panel').forEach(panel => {
        panel.style.display = 'none';
    });

    document.getElementById(`panel-${content}`).style.display = 'block';

    var sectionTitle = content.charAt(0).toUpperCase() + content.slice(1);
    document.querySelector('.dashboard-header h1').innerText = sectionTitle;
}


function loadUserList() {
    var users = [ // sample
        { name: "Juan Dela Cruz", idNumber: "12345", email: "juan@example.com", phone: "1234567890", address: "Real St, Manila", role: "Volunteer", online: true },
        { name: "Pepito Manaloto", idNumber: "54321", email: "pepito@example.com", phone: "0987654321", address: "Sampaguita St, Manila", role: "Donor", online: false }
        // Add more user data as needed
    ];
    var userList = document.getElementById('user-list');
    var totalUsers = document.getElementById('total-users');
    userList.innerHTML = '';

    var onlineCount = 0;

    users.forEach(function(user) {
        var listItem = document.createElement('tr');
        listItem.classList.add('user-item');
        listItem.innerHTML = `
            <td>${user.name}</td>
            <td>${user.idNumber}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address}</td>
            <td>${user.role}</td>
            <td><span class="${user.online ? 'online' : 'offline'}">${user.online ? 'Online' : 'Offline'}</span></td>
        `;
        userList.appendChild(listItem);

        if (user.online) {
            onlineCount++;
        }
    });

    totalUsers.textContent = users.length;
}

// Sample data for pending applications
const pendingApplications = [
    {
        type: "Volunteer with Us",
        name: "John Doe",
        email: "johndoe@example.com",
        skills: "Web development, Marketing",
        whyVolunteer: "I want to make a positive impact on society."
    },
    {
        type: "Partner with Us",
        organization: "ABC Organization",
        contactPerson: "Jane Smith",
        email: "janesmith@abc.org",
        interest: "Education, Community development"
    }
];

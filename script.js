let users = []; // stores full data
let filteredUsers = []; // stores filtered data

document.getElementById("fetchBtn").addEventListener("click", fetchUsers);
document.getElementById("searchInput").addEventListener("input", filterUsers);

function fetchUsers() {
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(data => {
            users = data;
            filteredUsers = data;
            renderUsers();
        });
}

function renderUsers() {
    const container = document.getElementById("userContainer");
    container.innerHTML = "";

    filteredUsers.forEach((user, index) => {
        const card = document.createElement("div");
        card.classList.add("user-card");
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>City:</strong> ${user.address.city}</p>
            <p><strong>Company:</strong> ${user.company.name}</p>

            <button class="delete-btn" onclick="deleteUser(${user.id})">
                Delete User
            </button>
        `;

        container.appendChild(card);
    });
}

function filterUsers() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();

    filteredUsers = users.filter(user => {
        return (
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue) ||
            user.username.toLowerCase().includes(searchValue) ||
            user.address.city.toLowerCase().includes(searchValue) ||
            user.company.name.toLowerCase().includes(searchValue)
        );
    });

    renderUsers();
}

function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            // simulate delete
            users = users.filter(u => u.id !== id);
            filteredUsers = filteredUsers.filter(u => u.id !== id);

            renderUsers();

            const msg = document.getElementById("message");
            msg.textContent = `User with ID ${id} has been deleted successfully!`;
            msg.style.opacity = "1";

            setTimeout(() => {
                msg.style.opacity = "0";
            }, 3000);
        });
}

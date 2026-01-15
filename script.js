let users = [];
let filteredUsers = [];
let currentPage = 1;
let usersPerPage = 4;
let selectedUserId = null;

document.getElementById("fetchBtn").addEventListener("click", fetchUsers);
document.getElementById("searchInput").addEventListener("input", filterUsers);
document.getElementById("sortSelect").addEventListener("change", sortUsers);
document.getElementById("prevPage").addEventListener("click", () => changePage(-1));
document.getElementById("nextPage").addEventListener("click", () => changePage(1));
document.getElementById("themeToggle").addEventListener("click", toggleTheme);
document.getElementById("closePanel").addEventListener("click", closePanel);
document.getElementById("saveEdit").addEventListener("click", saveEdit);

function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}
function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}

function fetchUsers() {
    showLoader();

    fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(data => {
            users = data;
            filteredUsers = data;
            hideLoader();
            renderUsers();
        });
}

function renderUsers() {
    const container = document.getElementById("userContainer");
    container.innerHTML = "";

    let start = (currentPage - 1) * usersPerPage;
    let end = start + usersPerPage;
    let paginated = filteredUsers.slice(start, end);

    paginated.forEach(user => {
        const card = document.createElement("div");
        card.classList.add("user-card");

        card.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <p>${user.address.city}</p>
            <button onclick="showDetails(${user.id})">Details</button>
            <button style="background:#ff3333" onclick="deleteUser(${user.id})">
                Delete
            </button>
        `;

        container.appendChild(card);
    });

    document.getElementById("pageNumber").textContent = currentPage;
}

function filterUsers() {
    const text = document.getElementById("searchInput").value.toLowerCase();

    filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(text) ||
        u.email.toLowerCase().includes(text) ||
        u.address.city.toLowerCase().includes(text) ||
        u.company.name.toLowerCase().includes(text)
    );

    currentPage = 1;
    renderUsers();
}

function sortUsers() {
    const value = document.getElementById("sortSelect").value;

    filteredUsers.sort((a, b) => {
        if (value === "city") return a.address.city.localeCompare(b.address.city);
        return a[value].localeCompare(b[value]);
    });

    renderUsers();
}

function changePage(direction) {
    const maxPage = Math.ceil(filteredUsers.length / usersPerPage);
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > maxPage) currentPage = maxPage;

    renderUsers();
}

function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "DELETE"
    }).then(() => {
        users = users.filter(u => u.id !== id);
        filteredUsers = filteredUsers.filter(u => u.id !== id);
        renderUsers();
    });
}

function showDetails(id) {
    selectedUserId = id;
    const user = users.find(u => u.id === id);

    document.getElementById("detailsContent").innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>City:</strong> ${user.address.city}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website}</p>
    `;

    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;

    document.getElementById("detailsPanel").classList.add("show");
}

function closePanel() {
    document.getElementById("detailsPanel").classList.remove("show");
}

function saveEdit() {
    const updatedName = document.getElementById("editName").value;
    const updatedEmail = document.getElementById("editEmail").value;

    users = users.map(u =>
        u.id === selectedUserId
            ? { ...u, name: updatedName, email: updatedEmail }
            : u
    );

    filteredUsers = [...users];
    renderUsers();
    closePanel();
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

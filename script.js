document.getElementById("fetchBtn").addEventListener("click", fetchUsers);
document.getElementById("deleteBtn").addEventListener("click", deleteUser);

function fetchUsers() {
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("userContainer");
            container.innerHTML = "";

            data.forEach((user, index) => {
                const card = document.createElement("div");
                card.classList.add("user-card");

                // delay each card animation
                card.style.animationDelay = `${index * 0.1}s`;

                card.innerHTML = `
                    <h3>${user.name}</h3>
                    <p>Email: ${user.email}</p>
                `;

                container.appendChild(card);
            });
        });
}

function deleteUser() {
    fetch("https://jsonplaceholder.typicode.com/users/2", {
        method: "DELETE"
    })
        .then(() => {
            const msg = document.getElementById("message");
            msg.textContent = "User with ID 2 deleted successfully!";
            msg.style.opacity = "1";

            setTimeout(() => {
                msg.style.opacity = "0";
            }, 3000);
        });
}

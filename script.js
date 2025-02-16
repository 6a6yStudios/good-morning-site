document.addEventListener("DOMContentLoaded", function () {
    loadMessages();
});

async function loadMessages() {
    const messagesDiv = document.getElementById("messages");

    // Simulated file list with the date in the filename (for testing purposes)
    const messageFiles = [
        "messages/2025-02-16.md",
        "messages/2025-02-17.md",
        "messages/2025-02-15.md"
    ];

    messagesDiv.innerHTML = "<p>Loading messages...</p>";

    // Sort files by date in the filename (YYYY-MM-DD)
    messageFiles.sort((a, b) => {
        const dateA = a.split("/")[1].split(".")[0]; // Get date from filename
        const dateB = b.split("/")[1].split(".")[0];

        return new Date(dateB) - new Date(dateA); // Sort in descending order (latest first)
    });

    // Fetch and display the messages
    for (let file of messageFiles) {
        const response = await fetch(file);
        const text = await response.text();
        const messageDate = file.split("/")[1].split(".")[0]; // Extract date from filename

        const messageHTML = `
            <div class="message">
                <h2>Good Morning - ${messageDate}</h2>
                <p>${text}</p>
            </div>
        `;
        messagesDiv.innerHTML += messageHTML;
    }
}

async function loadMessages() {
    const messagesContainer = document.getElementById("messages-container");
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.github.com/repos/6a6yStudios/good-morning-site/contents/messages`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status: ${response.status}`);
        }
        const data = await response.json();

        // Filter for .md files
        const messageFiles = data.filter(item => item.name.endsWith('.md'));

        // Sort files by date (from filename: yyyy-mm-dd)
        messageFiles.sort((a, b) => {
            const dateA = a.name.split("-").slice(0, 3).join("-");
            const dateB = b.name.split("-").slice(0, 3).join("-");
            return dateB.localeCompare(dateA);  // Sort descending by date
        });

        // Clear any loading message
        messagesContainer.innerHTML = "<p>Loading messages...</p>";

        // Loop through all the message files and fetch their contents
        for (let file of messageFiles) {
            const fileResponse = await fetch(file.download_url);  // Use the correct download URL
            const markdownText = await fileResponse.text();        // Fetch the raw markdown content
            const messageHTML = marked(markdownText);              // Convert Markdown to HTML
            const messageDate = file.name.split(".")[0];           // Extract date from filename

            const messageContent = `
                <div class="message">
                    <h2>Good Morning - ${messageDate}</h2>
                    <div class="message-content">${messageHTML}</div>
                </div>
            `;
            messagesContainer.innerHTML += messageContent;
        }
    } catch (error) {
        console.error("Error loading messages:", error);
        messagesContainer.innerHTML = "<p>Failed to load messages. Please try again later.</p>";
    }
}

// Call the function when the page loads
loadMessages();

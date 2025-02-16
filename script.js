async function loadMessages() {
    const messagesContainer = document.getElementById("messages-container");
    const apiUrl = `https://api.github.com/repos/YOUR_GITHUB_USERNAME/good-morning-site/contents/messages`;

    try {
        // Fetch the list of files in the 'messages' directory
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status: ${response.status}`);
        }
        const data = await response.json();

        // Filter for .md files
        const messageFiles = data.filter(item => item.name.endsWith('.md'));

        // Sort files by date (from filename: yyyy-mm-dd)
        messageFiles.sort((a, b) => {
            const dateA = a.name.split("-").slice(0, 3).join("-"); // Format yyyy-mm-dd
            const dateB = b.name.split("-").slice(0, 3).join("-");
            return dateB.localeCompare(dateA);  // Sort descending by date
        });

        // Display the messages
        messagesContainer.innerHTML = "<p>Loading messages...</p>"; // Show loading message
        for (let file of messageFiles) {
            const fileResponse = await fetch(file.download_url);
            const markdownText = await fileResponse.text();

            // Convert Markdown to HTML (using 'marked' library)
            const messageHTML = marked(markdownText);

            // Insert the message and its date
            const messageDate = file.name.split(".")[0]; // Extract date from filename
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

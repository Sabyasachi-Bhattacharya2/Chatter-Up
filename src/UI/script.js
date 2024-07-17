document.addEventListener("DOMContentLoaded", () => {
    const socket = io.connect('http://localhost:3000');
    const sendButton = document.getElementById("send-button");
    const messageContainer = document.getElementById("message-container");
    const inputBox = document.getElementById("message-input");
    const userList = document.getElementById("user-list");

    socket.on("connect", () => {
        console.log("Connected to server");
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from the server");
    });

    let userName = "";

    // Prompt for username when the page loads
    function promptForUsername() {
        userName = prompt("Enter your name");

        if (userName) {
            // If username is entered, proceed with chat setup
            console.log("Username entered:", userName);
            initializeChat(userName);
        } else {
            alert("You must enter a name to join the chat");
            promptForUsername(); // Prompt again if username is not entered
        }
    }

    // Function to initialize chat interface after username is obtained
    function initializeChat(userName) {
        // Emit new_join event to server
        socket.emit("new_join", userName);
        console.log("New joining emitted client");

        // Listen for chat history from server
        socket.on("chat_history", (chatHistory) => {
            console.log("Received chat history", chatHistory);
            displayChatHistory(chatHistory);
            const welcomeUser = document.createElement('div');
            welcomeUser.innerText = `Welcome, ${userName}`;
            messageContainer.appendChild(welcomeUser);
            scrollToBottom();
        });


        // Event listener for sending messages
        sendButton.addEventListener("click", () => {
            const message = inputBox.value.trim();
            if (message) {
                const messageData = {
                    userName: userName,
                    msg: message
                };
                socket.emit("new_message", messageData);

                const newMessageElement = document.createElement("div");
                newMessageElement.innerText = `${userName}: ${message}`;
                messageContainer.appendChild(newMessageElement);
                scrollToBottom();

                inputBox.value = ""; // Clear input box after sending message
            } else {
                alert("Please enter a message to send");
            }
        });

        inputBox.addEventListener("input", () => {
            
            if(inputBox.value.trim() !== "") {
            
                
                socket.emit("typing", userName);
            } else {
                socket.emit("typing_stopped", userName);
            }
        })

        // Listen for broadcasted messages from other users
        socket.on("broadcast_message", (userMessage) => {
            console.log("Received broadcasted message", userMessage);
            displayMessage(userMessage.username, userMessage.msg);
        });

        // Listen for broadcasted join messages from other users
        socket.on("broadcast_join_msg", (newName) => {
            console.log("Received broadcasted join message", newName);
            displayJoinMessage(newName);
        });

        // Listen for the left messages
        socket.on("broadcast_leave_msg", (name) => {
            console.log("User has left the chat client");
            displayLeftMessage(name);
        });

        socket.on("broadcast_typing_msg", (userName) => {
            displayTypingMessage(userName);
        })

        socket.on("broadcast_stop_typing_msg", (userData) => {
            const typingElement = document.getElementById(`typing-${userData}`);
            if(typingElement) {
                typingElement.remove();
            }
        })

        // Function to display chat history
        function displayChatHistory(history) {
            history.forEach(chat => {
                displayMessage(chat.userName, chat.message);
            });
            scrollToBottom();
        }

        // Function to display a new message
        function displayMessage(username, message) {
            const messageElement = document.createElement("div");
            messageElement.innerText = `${username}: ${message}`;
            messageContainer.appendChild(messageElement);
            scrollToBottom();
        }

        // Function to display join message
        function displayJoinMessage(newName) {
            const joinMessage = document.createElement("div");
            joinMessage.innerText = `${newName} has joined the chat`;
            messageContainer.appendChild(joinMessage);
            scrollToBottom();

            const userListItem = document.createElement("div");
            userListItem.innerText = newName;
            userList.appendChild(userListItem);
        }

        function displayLeftMessage(userName) {
            const messageElement = document.createElement("div");
            messageElement.innerText = `${userName} left the chat`;
            messageContainer.appendChild(messageElement);
            scrollToBottom();
        }

        function displayTypingMessage(typingData) {
            let typingElement = document.getElementById(`typing-${typingData}`);
            if(!typingElement) {
                typingElement = document.createElement("div");
                typingElement.id = `typing-${typingData}`;
                typingElement.innerText = `${typingData} is typing...`;
                messageContainer.appendChild(typingElement);
                scrollToBottom();
            }
        }
    }

    // Start by prompting for username
    promptForUsername();

    // Function to scroll to the bottom of the message container
    function scrollToBottom() {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

});

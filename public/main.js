const socket = io();


const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

// I just use this message tone but don't have file now
const messageTone = new Audio("/message.mp3");


messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    if (messageInput.value === "") return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    }
    socket.emit("message", data);
    addMessagetoUi(true, data);
    messageInput.value = "";
}

socket.on("chat-message", (data) => {
    // messageTone.play();
    addMessagetoUi(false, data);
});


function addMessagetoUi(isOwnMessage, data) {
    clearFeedback();
    const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
        <p class="message">
            ${data.message}
        </p>
       <span>${data.name} 💬${moment(data.dateTime).fromNow()}</span>
    </li>
    `;
    messageContainer.innerHTML += element;
    scrollToBottom();
}


const clientsTotal = document.getElementById("clients-total")

// Get connected users
socket.on("clients-total", (data) => {
    clientsTotal.innerText = `Total clients: ${data}`;
});


function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

messageInput.addEventListener("focus", () => {
    socket.emit("typing", {
        feedback: `${nameInput.value} is typing...`,
    });
});
messageInput.addEventListener("keypress", () => {
    socket.emit("typing", {
        feedback: `${nameInput.value} is typing...`,
    });
});

messageInput.addEventListener("blur", () => {
    socket.emit("typing", {
        feedback: ``,
    });
});

socket.on("typing", (data) => {
    clearFeedback();
    const element = `
    <li class="message-feedback">
        <p class="feedback">
            ${data.feedback}
        </p>
    </li>
    `;
    messageContainer.innerHTML += element;
    scrollToBottom();
});

function clearFeedback() {
    document.querySelectorAll('.message-feedback').forEach(e => e.remove());
}
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

const userName = window.contact.firstName;
const currentUser = window.currentUser.firstName;

const messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

socket.emit("user:join", { receiver: window.contact._id, sender: window.currentUser._id});

socket.on("global:message", (message) => {
    messages.innerHTML += `
    <p class="join_message" >${message}</p>
    `;
});

socket.on("message:receive", (payload) => {
    if (payload.receiver._id === window.currentUser._id) {
        const timestamp = new Date(payload.message.timestamp); // Парсим временную метку
        const formattedTimestamp = timestamp.toLocaleString(); // Форматируем дату и время
        messages.innerHTML += `          
        <div class="receive_message_container" >
            <p class="receiver_name" >${payload.sender.firstName}</p>
            <p class="sent_message" >${payload.message.message}</p>
            <p class="sent_message" >${formattedTimestamp}</p>
        </div>
        `;
        scrollChatToBottom();
    }
});

form.addEventListener("submit", (e) => {
    if (input.value === '') {
        input.value = "";
        return;
    }
    else {
        const timestamp = new Date(); // Парсим временную метку
        const formattedTimestamp = timestamp.toLocaleString(); // Форматируем дату и время
        e.preventDefault();
        messages.innerHTML += `          
        <div class="sent_message_container" >
            <p class="your_name" >You</p>
            <p class="sent_message" >${input.value}</p>
            <p class="sent_message" >${formattedTimestamp}</p>
        </div>
        `;
        socket.emit("message:send", { receiver: window.contact._id, sender: window.currentUser._id, message: input.value });
        input.value = "";
        scrollChatToBottom();
    }
});

function scrollChatToBottom() {
    var chatContainer = document.querySelector(".chat_container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

function redirectToUser(userId) {
    window.location.href = '/users/' + userId;
}


document.addEventListener("DOMContentLoaded", function() {
    var chatContainer = document.querySelector(".chat_container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });   



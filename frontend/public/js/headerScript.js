const socket = io();

socket.on("new-notification", (data) => {
    
    const currentUserId = document.getElementById('currentUserId').value;
    console.log(data.notification.receiver);
    console.log(currentUserId);

    if (data.notification.receiver === currentUserId) {
        const notificationsLink = document.querySelector('#notificationsLink').querySelector('.nav-link');
        notificationsLink.textContent = 'Notifications 🔴';
    }
});
const checkNotification = window.checkNotification;

// Находим ссылку на странице
const notificationsLink = document.querySelector('#notificationsLink').querySelector('.nav-link');

if (checkNotification === true) {
    notificationsLink.textContent = 'Notifications 🔴';
} else {
    notificationsLink.textContent = 'Notifications';
}
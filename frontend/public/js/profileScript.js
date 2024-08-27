
function redirectToUser(endPoint, userId) {
    const currentUserId = document.getElementById('currentUserId').value;
    if (endPoint === 'like') {
        socket.emit('like', { sender: currentUserId, receiver: userId });
    } 
    window.location.href = `/${endPoint}/${userId}`;
}
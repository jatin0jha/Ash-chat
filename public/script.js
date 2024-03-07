// script.js
const socket = io();
let username = localStorage.getItem('username');

// Function to show the popup modal
function showModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
}

// Function to hide the popup modal
function hideModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Function to save the username and hide the modal
function saveUsername() {
  username = document.getElementById('username').value;
  localStorage.setItem('username', username);
  hideModal();
}

// Event listener to show the popup modal when the page loads
document.addEventListener('DOMContentLoaded', () => {
  if (!username) {
    showModal();
  }
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const messagesList = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const message = { username: username, message: input.value };
    socket.emit('chat message', message);
    saveMessageToLocalStorage(message);
    input.value = '';
  }
});

socket.on('chat message', (data) => {
  const item = document.createElement('li');
  item.textContent = `${data.username}: ${data.message}`;
  if (data.username === username) {
    item.classList.add('sent');
  } else {
    item.style.color = getUsernameColor(data.username);
    showNotification(data.username, data.message);
  }
  messagesList.appendChild(item);
  saveMessageToLocalStorage(data);
});

// Function to save message to local storage
function saveMessageToLocalStorage(message) {
  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));
}

// Function to load messages from local storage
function loadMessagesFromLocalStorage() {
  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.forEach((message) => {
    const item = document.createElement('li');
    item.textContent = `${message.username}: ${message.message}`;
    if (message.username === username) {
      item.classList.add('sent');
    } else {
      item.style.color = getUsernameColor(message.username);
    }
    messagesList.appendChild(item);
  });
}

// Load messages from local storage when the page loads
document.addEventListener('DOMContentLoaded', loadMessagesFromLocalStorage);

// Function to generate a unique color for each user
function getUsernameColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 50%, 50%)`;
}

// Function to show notification
function showNotification(sender, message) {
  if (Notification.permission === 'granted') {
    new Notification(sender, { body: message });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(sender, { body: message });
      }
    });
  }
}

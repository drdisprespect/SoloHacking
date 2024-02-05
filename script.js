document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const suggestions = document.getElementById('suggestions');
    const aiAvatarContainer = document.getElementById('ai-avatar-container');
    const aiGreeting = document.querySelector('.ai-greeting');
    const aiAvatar = document.querySelector('.ai-avatar');
    let suggestionsVisible = true;

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    document.querySelectorAll('.suggestion-btn').forEach(button => {
        button.addEventListener('click', function() {
            userInput.value = button.textContent;
            sendMessage();
        });
    });

    function sendMessage() {
        const userText = userInput.value.trim();
        if (userText) {
            fadeOutElements([suggestions, aiAvatarContainer], function() {
                appendMessage('user-message', userText);
                userInput.value = '';
                fadeInElements([document.getElementById('input-area')]);

                fetch('/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userText }),
                })
                .then(response => response.json())
                .then(data => {
                    appendMessage('ai-message-enter', data.response, true);
                })
                .catch(error => console.error('Error:', error));
            });
        }
    }

    function appendMessage(className, text, isAI) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);

        if (isAI && className === 'ai-message-enter') {
            const avatarClone = aiAvatar.cloneNode(true);
            messageDiv.appendChild(avatarClone);
        }

        messageDiv.innerHTML += `<span>${text}</span>`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function fadeOutElements(elements, callback) {
        elements.forEach(element => {
            element.style.animation = 'fadeOutHeight 0.5s ease-out forwards';
        });

        setTimeout(() => {
            elements.forEach(element => {
                element.style.display = 'none';
            });
            if (callback) callback();
        }, 500);
    }

    function fadeInElements(elements) {
        elements.forEach(element => {
            element.style.transition = 'opacity 0.5s ease-out';
            element.style.opacity = '1';
        });
    }
});

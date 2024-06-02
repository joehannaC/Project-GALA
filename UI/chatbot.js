let qaData = [];

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const messageText = userInput.value.trim();

    if (messageText !== '') {
        displayMessage(messageText, 'user-message');
        userInput.value = '';

        const botResponse = getBotResponse(messageText);
        setTimeout(() => {
            displayMessage(botResponse, 'bot-message');
        }, 500);
    }
}

function displayMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addQA() {
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (question !== '' && answer !== '') {
        qaData.push({ question, answer });
        displayQAList();
        questionInput.value = '';
        answerInput.value = '';
    }
}

function displayQAList() {
    const qaTableBody = document.getElementById('qa-table').querySelector('tbody');
    qaTableBody.innerHTML = '';
    qaData.forEach((qa, index) => {
        const row = document.createElement('tr');
        const numberCell = document.createElement('td');
        const questionCell = document.createElement('td');
        const answerCell = document.createElement('td');

        numberCell.textContent = index + 1;
        questionCell.textContent = qa.question;
        answerCell.textContent = qa.answer;

        row.appendChild(numberCell);
        row.appendChild(questionCell);
        row.appendChild(answerCell);
        qaTableBody.appendChild(row);
    });
}

function getBotResponse(userMessage) {
    for (let i = 0; i < qaData.length; i++) {
        if (userMessage.toLowerCase() === qaData[i].question.toLowerCase()) {
            return qaData[i].answer;
        }
    }
    return "Sorry, I don't understand that question.";
}

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});



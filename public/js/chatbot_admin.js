let qaData = [];
let qaCount = 0;

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

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
        
        const qaTableBody = document.querySelector('#qa-table tbody');
        const newRow = qaTableBody.insertRow();

        const cellNumber = newRow.insertCell(0);
        cellNumber.textContent = ++qaCount;

        const cellQuestion = newRow.insertCell(1);
        cellQuestion.textContent = question;

        const cellAnswer = newRow.insertCell(2);
        cellAnswer.textContent = answer;

        const cellActions = newRow.insertCell(3);
        
        const deleteButton = document.createElement('img');
        deleteButton.src = 'delete.png';
        deleteButton.alt = 'Delete';
        deleteButton.title = 'Delete';
        deleteButton.classList.add('action-icon');
        deleteButton.onclick = () => deleteQA(newRow);
        cellActions.appendChild(deleteButton);
        
        const editButton = document.createElement('img');
        editButton.src = 'edit.png';
        editButton.alt = 'Edit';
        editButton.title = 'Edit';
        editButton.classList.add('action-icon');
        editButton.onclick = () => editQA(newRow);
        cellActions.appendChild(editButton);

        questionInput.value = '';
        answerInput.value = '';
    }
}

function editQA(row) {
    const cells = row.cells;
    document.getElementById('question').value = cells[1].textContent;
    document.getElementById('answer').value = cells[2].textContent;

    const index = Array.from(row.parentNode.children).indexOf(row);
    qaData.splice(index, 1);
    
    row.remove();
    qaCount--;

    updateQuestionNumbers();
}

function deleteQA(row) {
    const index = Array.from(row.parentNode.children).indexOf(row);
    qaData.splice(index, 1);

    row.remove();
    qaCount--;

    updateQuestionNumbers();
}

function updateQuestionNumbers() {
    const rows = document.querySelectorAll('#qa-table tbody tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
    qaCount = rows.length;
}

function getBotResponse(userMessage) {
    for (let i = 0; i < qaData.length; i++) {
        if (userMessage.toLowerCase() === qaData[i].question.toLowerCase()) {
            return qaData[i].answer;
        }
    }
    return "Sorry, I don't understand that question.";
}

function cancelAdd() {
    window.location.href = "home_admin.html";
}

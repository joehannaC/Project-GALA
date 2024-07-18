let uniqueKey = 0;
let users = [];
let userId = 0;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('forgot-password').style.display = 'none';
    document.getElementById('emailForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        uniqueKey = generateUniqueKey();

        const resetData = {
            email: email,
            uniqueKey: uniqueKey
        };

        fetch('/verifyEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resetData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userId = data.userID;
                resetPassword(userId);
            } else {
                alert('An error occurred: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

function generateUniqueKey() {
    let digits = [...Array(10).keys()];

    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    let uniqueSixDigitNumber = digits.slice(0, 6).join('');

    return uniqueSixDigitNumber;
}

function resetPassword(userId) {
    document.getElementById('forgot-password').style.display = 'block';
    document.getElementById('verify-email').style.display = 'none';

    document.getElementById('passwordForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const enteredKey = document.getElementById('unique-keys');
        const newPassword = document.getElementById('new-password');

        if (uniqueKey === enteredKey) {
            fetch(`/resetPassword/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to reset password');
                }
                return response.json();
            })
            .then(data => {
                console.log('Password successfully changed!');
                window.location.href = "index.html";
            })
            .catch(error => {
                console.error('Error resetting password:', error);
            });
        }
        else {
            alert('Incorrect unique key entered!');
        }
    });    
}
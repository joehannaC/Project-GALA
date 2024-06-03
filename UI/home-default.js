function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const formattedDateTime = now.toLocaleDateString('en-US', options);
    document.getElementById('datetime').innerHTML = formattedDateTime;
}

setInterval(updateDateTime, 1000);
updateDateTime();

let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 5000); // Change image every 5 seconds
}

function plusSlides(n) {
    slideIndex += n;
    let slides = document.getElementsByClassName("mySlides");
    if (slideIndex > slides.length) {slideIndex = 1}
    if (slideIndex < 1) {slideIndex = slides.length}
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex-1].style.display = "block"; 
}

document.addEventListener("DOMContentLoaded", function() {
    const dropdownItems = document.querySelectorAll("nav ul li");
    dropdownItems.forEach(item => {
        item.addEventListener("click", function() {
            this.classList.toggle("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const dropdownItems = document.querySelectorAll("nav ul li.dropdown.login");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const switchSlider = document.querySelector(".switch .slider");
    let timeoutId;

    dropdownItems.forEach(item => {
        item.addEventListener("mouseover", function() {
            clearTimeout(timeoutId);
            this.querySelector(".dropdown-content").style.display = "block";
        });

        item.addEventListener("mouseout", function() {
            timeoutId = setTimeout(() => {
                this.querySelector(".dropdown-content").style.display = "none";
            }, 300); // Adjust delay as needed
        });
    });

    const switchButtons = document.querySelectorAll(".switch button");

    switchButtons.forEach(button => {
        button.addEventListener("click", function() {
            switchButtons.forEach(btn => btn.classList.remove("active-btn"));
            this.classList.add("active-btn");
            if (this.id.includes("loginBtn")) {
                loginForm.classList.add("active-form");
                registerForm.classList.remove("active-form");
                switchSlider.style.transform = "translateX(0)";
            } else {
                loginForm.classList.remove("active-form");
                registerForm.classList.add("active-form");
                switchSlider.style.transform = "translateX(100%)";
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const chatbotCircle = document.getElementById('chatbot-circle');
    const chatbox = document.getElementById('chatbox');
    const chatboxClose = document.getElementById('chatbox-close');
    const chatboxInput = document.getElementById('chatbox-input');
    const chatboxMessages = document.getElementById('chatbox-messages');

    let previousUserTimestampElement = null;
    let previousBotTimestampElement = null;

    chatbox.style.display = 'none';
    chatbotCircle.style.display = 'flex';

    chatbotCircle.addEventListener('click', function() {
        chatbox.style.display = 'flex'; 
        chatbotCircle.style.display = 'none';
    });

    chatboxClose.addEventListener('click', function() {
        chatbox.style.display = 'none'; 
        chatbotCircle.style.display = 'flex'; 
    });

    chatboxInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && chatboxInput.value.trim() !== '') {
            event.preventDefault();
            const userMessage = document.createElement('div');
            userMessage.classList.add('chatbox-message', 'user-message');
            userMessage.innerHTML = `<span>${chatboxInput.value.trim()}</span>`;
            chatboxMessages.appendChild(userMessage);
            chatboxInput.value = '';
            chatboxMessages.scrollTop = chatboxMessages.scrollHeight;

            addTimestamp(chatboxMessages, 'user');

            
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.classList.add('chatbox-message', 'bot-message');
                botMessage.innerHTML = `<img src="images/image.png" alt="Bot"><span>Thank you for your message!</span>`;
                chatboxMessages.appendChild(botMessage);
                chatboxMessages.scrollTop = chatboxMessages.scrollHeight;

                addTimestamp(chatboxMessages, 'bot');
            }, 1000);
        }
    });

    function addTimestamp(chatboxMessages, messageType) {
        if (messageType === 'user' && previousUserTimestampElement) {
            previousUserTimestampElement.remove();
        }
        if (messageType === 'bot' && previousBotTimestampElement) {
            previousBotTimestampElement.remove();
        }

        const timestampElement = document.createElement('div');
        timestampElement.classList.add('timestamp');
        if (messageType === 'user') {
            timestampElement.classList.add('user-timestamp');
        } else if (messageType === 'bot') {
            timestampElement.classList.add('bot-timestamp');
        }
        timestampElement.innerText = new Date().toLocaleString('en-US', {
            weekday: 'long', hour: '2-digit', minute: '2-digit',
        });

        chatboxMessages.appendChild(timestampElement);
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;

        if (messageType === 'user') {
            previousUserTimestampElement = timestampElement;
        } else if (messageType === 'bot') {
            previousBotTimestampElement = timestampElement;
        }
    }
});
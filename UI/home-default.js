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
    setTimeout(showSlides, 5000); 
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

const userSwitch = document.getElementById('userSwitch');
const adminSwitch = document.getElementById('adminSwitch');

userSwitch.addEventListener('click', () => {
    userSwitch.classList.add('active');
    adminSwitch.classList.remove('active');
});

adminSwitch.addEventListener('click', () => {
    adminSwitch.classList.add('active');
    userSwitch.classList.remove('active');
});


    const modal = document.getElementById('myModal');

    const adminSwitch = document.getElementById('adminSwitch');
    const passkeyInputs = document.querySelectorAll('.passkey-digit');
    const passkeySubmit = document.getElementById('passkeySubmit');

    const span = document.getElementsByClassName('close')[0];

    adminSwitch.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    span.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    passkeyInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (input.value.length === 1 && index < passkeyInputs.length - 1) {
                passkeyInputs[index + 1].focus();
            }
        });
    });

    passkeySubmit.addEventListener('click', function() {
        let passkey = '';
        passkeyInputs.forEach(input => {
            passkey += input.value;
        });
        if (passkey === '1234') {
            showLoadingAndRedirect('index.html');
        } else {
            alert('Incorrect passkey! Access denied.');
        }
    });

    function showLoadingAndRedirect(url) {
        console.log('Loading...');
        setTimeout(function() {
            window.location.href = url;
        }, 3000); 
    }
});



document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (email === 'admin@example.com' && password === 'password') {
        alert('Login successful!');
    } else {
        alert('Invalid email or password!');
    }
});

        function login() {
            window.location.href = "home.html";
        }

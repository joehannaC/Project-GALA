document.getElementById("loginBtn").addEventListener("click", function() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
    this.classList.add("active-btn");
    this.classList.remove("inactive-btn");
    document.getElementById("registerBtn").classList.remove("active-btn");
    document.getElementById("registerBtn").classList.add("inactive-btn");
    document.querySelector(".slider").style.transform = "translateX(0)";
});

document.getElementById("registerBtn").addEventListener("click", function() {
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
    this.classList.add("active-btn");
    this.classList.remove("inactive-btn");
    document.getElementById("loginBtn").classList.remove("active-btn");
    document.getElementById("loginBtn").classList.add("inactive-btn");
    document.querySelector(".slider").style.transform = "translateX(100%)";
});

document.getElementById("loginBtn").classList.add("active-btn");
document.getElementById("registerBtn").classList.add("inactive-btn");

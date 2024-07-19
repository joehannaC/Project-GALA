document.addEventListener('DOMContentLoaded', function() {
    const form1 = document.getElementById("partner-form");

    form1.addEventListener("submit", function(event) {
    // document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        var orgName = document.getElementById('organization-name').value;
        var contactPerson = document.getElementById('contact-person').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var website = document.getElementById('website').value;
        var project = document.getElementById('project').value;
        var description = document.getElementById('organization-description').value;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'process_form.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                alert(xhr.responseText);
            } else {
                alert('There was an error submitting your form. Please try again.');
            }
        };
        xhr.onerror = function() {
            alert('There was an error submitting your form. Please try again.');
        };
        xhr.send('organization-name=' + encodeURIComponent(orgName) +
                 '&contact-person=' + encodeURIComponent(contactPerson) +
                 '&email=' + encodeURIComponent(email) +
                 '&phone=' + encodeURIComponent(phone) +
                 '&website=' + encodeURIComponent(website) +
                 '&project=' + encodeURIComponent(project) +
                 '&organization-description=' + encodeURIComponent(description));
    });

    const form2 = document.getElementById("volunteer-form");
  
    form2.addEventListener("submit", function(event) {
        event.preventDefault();
        
        var full_name = document.getElementById('full-name').value;
        var volunteer_email = document.getElementById('volunteer-email').value;
        var volunteer_phone = document.getElementById('volunteer-phone').value;
        var volunteer_skills = document.getElementById('volunteer-skills').value;
        var availability = document.getElementById('availability').value;
        var previous_experience = document.getElementById('previous-experience').value;
        var why_volunteer = document.getElementById('why-volunteer').value;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'process_form.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                alert(xhr.responseText);
            } else {
                alert('There was an error submitting your form. Please try again.');
            }
        };
        xhr.onerror = function() {
            alert('There was an error submitting your form. Please try again.');
        };
        xhr.send('full-name=' + encodeURIComponent(full_name) +
                 '&volunteer-email=' + encodeURIComponent(volunteer_email) +
                 '&volunteer-phone=' + encodeURIComponent(volunteer_phone) +
                 '&volunteer-skills=' + encodeURIComponent(volunteer_skills) +
                 '&availability=' + encodeURIComponent(availability) +
                 '&previous-experience=' + encodeURIComponent(previous_experience) +
                 '&why-volunteer=' + encodeURIComponent(why_volunteer));
    });
});

function goBack() {
    window.history.back();
}
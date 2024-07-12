let selectedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateDateTime, 1000);
    updateDateTime();
    setupImageUploadPreview()
});

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const formattedDateTime = now.toLocaleDateString('en-US', options);
    document.getElementById('datetime').innerHTML = formattedDateTime;
}

function setupImageUploadPreview() {
    const contactImagesInput = document.getElementById('photo-upload');
    contactImagesInput.addEventListener('change', handleFileSelect);
}

function previewPhoto(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const photo = document.getElementById('uploaded-photo');
        photo.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

function addContactInfo() {
    const contactAddress = document.getElementById('address').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const contactNetwork = document.getElementById('networkCategory').value;
    const contactEmail = document.getElementById('email').value;

    const schedule = {
        day: [],
        start: [],
        end: []
    };

    document.querySelectorAll('.day-checkbox input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            const day = checkbox.id;
            const startTime = document.getElementById(`${day}-start-time`).value;
            const endTime = document.getElementById(`${day}-end-time`).value;
            schedule.day.push(day);
            schedule.start.push(startTime);
            schedule.end.push(endTime);
        }
    });

    const contact = {
        address: contactAddress,
        number: contactNumber,
        network: contactNetwork,
        email: contactEmail,
        images: [],
        schedule: schedule
    };

    const formData = new FormData();
    formData.append('image', selectedFile);

    fetch('/uploadImage', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        return response.json();
    })
    .then(data => {
        contact.images.push(data.imagePath);
        return fetch('/addContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save contact');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('contactForm').reset();
        document.getElementById('contactPreviewContainer').innerHTML = '';
        selectedFile = null; 
    })
    .catch(error => {
        console.error('Error saving contact:', error);
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0]; 
    console.log('Selected File:', file); 

    const previewContainer = document.getElementById('contactPreviewContainer');
    previewContainer.innerHTML = ''; 

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'photo-preview-item';

            const image = new Image();
            image.src = e.target.result;
            image.className = 'preview-image';

            imageContainer.appendChild(image);
            previewContainer.appendChild(imageContainer);
            selectedFile = file;
        };

        reader.readAsDataURL(file);
    }
}

// const saveButton = document.querySelector('.save-button');

// saveButton.addEventListener('click', function() {
    
//     const addressValue = document.getElementById('address').value.trim();
//     const businessHoursValue = document.getElementById('business-hours').value.trim();
//     const contactNumberValue = document.getElementById('contact-number').value.trim();
//     const emailValue = document.getElementById('email').value.trim();

//     if (addressValue || businessHoursValue || contactNumberValue || emailValue) {
//         alert('Changes saved successfully!');
//     } else {
//         alert('No changes made.');
//     }
// });

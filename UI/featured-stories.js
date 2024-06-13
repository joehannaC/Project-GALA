// featured-stories.js

let currentAlbumImages = [];
let currentImageIndex = 0;
let selectedFile = null;
let albumCounter = 0;
const albumsPerRow = 4;
let albumsInFirstRow = 0;
let album = [];

document.addEventListener('DOMContentLoaded', () => {
    setupImageUploadPreview();
});

function setupImageUploadPreview() {
    const albumImagesInput = document.getElementById('albumImages');
    albumImagesInput.addEventListener('change', handleFileSelect);
}

function openCreateAlbumModal() {
    document.getElementById('createAlbumModal').style.display = 'block';
}

function closeCreateAlbumModal() {
    document.getElementById('createAlbumModal').style.display = 'none';
}

function createAlbum() {
    const albumTitle = document.getElementById('albumTitle').value;
    const albumCaption = document.getElementById('albumCaption').value;
    const albumCategory = document.getElementById('albumCategory').value;
    const albumAuthor = document.getElementById('albumAuthor').value;

    const album = {
        title: albumTitle,
        caption: albumCaption,
        author: albumAuthor,
        category: albumCategory,
        images: [],
    };

    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            album.images.push(event.target.result);

            displayAlbum(album);
            closeCreateAlbumModal();
            document.getElementById('createAlbumForm').reset();
            selectedFile = null; 
            document.getElementById('albumPreviewContainer').innerHTML = ''; 
        };
        reader.readAsDataURL(selectedFile);
    }
}

function displayAlbum(album) {
    const photoGallery = document.getElementById('photoGallery');

    const albumElement = document.createElement('div');
    albumElement.classList.add('album');
    const albumId = `album-${albumCounter++}`; 
    albumElement.id = albumId;

    albumElement.innerHTML = `
        <h3>${album.title}</h3>
        <p><strong>Description:</strong> ${album.caption}</p>
        <p><strong>Author:</strong> ${album.author}</p>
        <p><strong>Category:</strong> ${album.category}</p>
        <div class="photo-container">
            ${album.images.map((src) => `<img src="${src}" onclick="viewFullSize('${src}')">`).join('')}
        </div>
        <div class="album-actions">
            <button onclick="deleteAlbum('${albumId}')">
                <img src="delete.png" alt="Delete" style="width: 15px; height= 15px;" title="Delete">
            </button>
            <button onclick="editAlbum('${albumId}')">
                <img src="edit.png" alt="Edit" style="width: 15px; height: 15px;" title="Edit">
            </button>
        </div>
    `;

    photoGallery.appendChild(albumElement);

    const albums = photoGallery.querySelectorAll('.album');
    const albumsInRow = albums.length % albumsPerRow;

    // Check if the current row is full
    if (albumsInRow === 0 && albums.length !== 0) {
        const br = document.createElement('br');
        br.classList.add('album-row-break');
        photoGallery.appendChild(br); 
    }

    if (albumsInRow !== 0 && albumsInRow !== albumsPerRow - 1) {
        albumElement.style.marginRight = '10px';
    }
}

function adjustAlbumLayout() {
    const photoGallery = document.getElementById('photoGallery');
    const albums = photoGallery.querySelectorAll('.album');
    const albumsInCurrentRow = albumsInFirstRow;

    if (albumsInCurrentRow === albumsPerRow) {
        const br = document.createElement('br');
        br.classList.add('album-row-break');
        photoGallery.appendChild(br); 
        albumsInFirstRow = 0; 
    }
}

function deleteAlbum(albumId) {
    console.log('Deleting album:', albumId);

    const albumElement = document.getElementById(albumId);
    if (albumElement) {
        albumElement.remove();
    }

    fetch(`/api/albums/${albumId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete album');
        }
       
    })
    .catch(error => {
        console.error('Error deleting album:', error);
     });
}

const originalAlbumDetails = {};

function editAlbum(albumId) {
    const albumElement = document.getElementById(albumId);
    if (!albumElement) return;

    const titleElement = albumElement.querySelector('h3');
    const captionElement = albumElement.querySelector('p:nth-of-type(1)');
    const categoryElement = albumElement.querySelector('p:nth-of-type(3)');
    const authorElement = albumElement.querySelector('p:nth-of-type(2)'); 

    const title = titleElement.textContent.replace('Story Title:', '').trim();
    const caption = captionElement.textContent.replace('Description:', '').trim();
    const category = categoryElement.textContent.replace('Category:', '').trim();
    const author = authorElement.textContent.replace('Author:', '').trim(); 

    originalAlbumDetails[albumId] = {
        title: titleElement.innerHTML,
        caption: captionElement.innerHTML,
        category: categoryElement.innerHTML,
        author: authorElement.innerHTML 
    };

    titleElement.innerHTML = `<label for="editTitle-${albumId}"><strong>Story Title:</strong></label>
                                <input type="text" id="editTitle-${albumId}" value="${title}" required>`;
    categoryElement.innerHTML = `<label for="editCategory-${albumId}"><strong>Category:</strong></label>
                                    <select id="editCategory-${albumId}" required>
                                        <option value="Educational">Educational</option>
                                        <option value="Community Outreach">Community Outreach</option>
                                        <option value="Advocacy">Advocacy</option>
                                        <option value="Volunteer Engagement">Volunteer Engagement</option>
                                    </select>`;
    captionElement.innerHTML = `<label for="editCaption-${albumId}"><strong>Description:</strong></label>
                                <textarea id="editCaption-${albumId}" rows="4" required>${caption}</textarea>`;
    authorElement.innerHTML = `<label for="editAuthor-${albumId}"><strong>Author:</strong></label>
                                <input type="text" id="editAuthor-${albumId}" value="${author}" required>`; // Input field for author

    const categorySelect = document.getElementById(`editCategory-${albumId}`);
    categorySelect.value = category;

    const albumActions = albumElement.querySelector('.album-actions');
    albumActions.innerHTML = `
        <button class="action-button bold-button" onclick="saveAlbum('${albumId}')">Update</button>
        <button class="action-button bold-button" onclick="cancelEdit('${albumId}')">Cancel</button>`;
}


function cancelEdit(albumId) {
    const albumElement = document.getElementById(albumId);
    if (!albumElement) return;

    const originalDetails = originalAlbumDetails[albumId];
    if (!originalDetails) return;

    const titleElement = albumElement.querySelector('h3');
    const captionElement = albumElement.querySelector('p:nth-of-type(1)');
    const categoryElement = albumElement.querySelector('p:nth-of-type(3)');

    titleElement.innerHTML = originalDetails.title;
    captionElement.innerHTML = originalDetails.caption;
    categoryElement.innerHTML = originalDetails.category;

    const albumActions = albumElement.querySelector('.album-actions');
    albumActions.innerHTML = `
        <button onclick="deleteAlbum('${albumId}')">
            <img src="delete.png" alt="Delete" style="width: 15px; height: 15px;" title="Delete">
        </button>
        <button onclick="editAlbum('${albumId}')">
            <img src="edit.png" alt="Edit" style="width: 15px; height: 15px;" title="Edit">
        </button>`;

    delete originalAlbumDetails[albumId];
}

function saveAlbum(albumId) {

    const editedTitle = document.getElementById(`editTitle-${albumId}`).value;
    const editedCaption = document.getElementById(`editCaption-${albumId}`).value;
    const editedCategory = document.getElementById(`editCategory-${albumId}`).value;

    const albumElement = document.getElementById(albumId);
    albumElement.querySelector('h3').innerHTML = `<strong>Album Title:</strong> ${editedTitle}`;
    albumElement.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Description:</strong> ${editedCaption}`;
    albumElement.querySelector('p:nth-of-type(3)').innerHTML = `<strong>Category:</strong> ${editedCategory}`;

    const albumActions = albumElement.querySelector('.album-actions');
    albumActions.innerHTML = `
        <button onclick="deleteAlbum('${albumId}')">
            <img src="delete.png" alt="Delete" style="width: 15px; height: 15px; margin-top:15px" title="Delete">
        </button>
        <button onclick="editAlbum('${albumId}')">
            <img src="edit.png" alt="Edit" style="width: 15px; height: 15px; margin-top:15px" title="Edit">
        </button>`;

    delete originalAlbumDetails[albumId];
}

function viewFullSize(imageSrc) {
    const fullSizeOverlay = document.getElementById('fullSizeOverlay');
    const fullSizeImage = document.getElementById('fullSizeImage');
    fullSizeImage.src = imageSrc;
    fullSizeOverlay.style.display = 'block';
}

function closeFullSize() {
    document.getElementById('fullSizeOverlay').style.display = 'none';
}

function handleFileSelect(event) {
    const file = event.target.files[0]; 
    console.log('Selected File:', file);

    const previewContainer = document.getElementById('albumPreviewContainer');
    previewContainer.innerHTML = ''; 

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'photo-preview-item';

            const image = new Image();
            image.src = e.target.result;
            image.className = 'preview-image';
            
            const removeButton = document.createElement('span');
            removeButton.innerHTML = '&times;';
            removeButton.className = 'remove-image';
            removeButton.addEventListener('click', function () {
                imageContainer.remove();
                selectedFile = null; 
                document.getElementById('albumImages').value = ''; 
            });

            imageContainer.appendChild(image);
            imageContainer.appendChild(removeButton);

            previewContainer.appendChild(imageContainer);

            selectedFile = file;
        };

        reader.readAsDataURL(file);
    }
}

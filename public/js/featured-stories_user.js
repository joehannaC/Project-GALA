document.addEventListener("DOMContentLoaded", function() {
    loadStories();
    async function checkLoginStatus() {
        try {
            const response = await fetch('/checkLogin');
            const data = await response.json();
            return data.isLoggedIn;
        } catch (error) {
            console.error('Error checking login status:', error);
            return false;
        }
    }

    async function updateNavigation() {
        const isLoggedIn = await checkLoginStatus();
        const accountLink = document.getElementById('account-link');

        if (isLoggedIn) {
            accountLink.className = 'dropdown logout';
            accountLink.innerHTML = `
                <a href="#logout" data-arrow>MY ACCOUNT</a>
                <div class="dropdown-content logout-dropdown">
                    <a href="My_Account.html">ACCOUNT SETTINGS</a>
                    <a href="home-default.html" id="logout-link">LOGOUT</a>
                </div>
            `;

            document.getElementById('logout-link').addEventListener('click', async function() {
                await fetch('/logout');
                sessionStorage.removeItem('isLoggedIn');
                window.location.href = 'home-default.html';
            });
        } else {
            accountLink.className = 'dropdown login';
            accountLink.innerHTML = `
                <a href="user-login-register.html" data-arrow>LOGIN / REGISTER</a>
            `;
        }
    }

    updateNavigation();
});

function loadStories() {
    fetch('/allStories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch stories');
            }
            return response.json();
        })
        .then(data => {
            stories = data.stories;
            stories.forEach(story => {
                displayStory(story);
            });
        })
        .catch(error => {
            console.error('Error loading stories:', error);
        });
}

function displayStory(story) {
    const photoGallery = document.getElementById('photoGallery');
    const storyElement = document.createElement('div');
    storyElement.classList.add('album');
    storyElement.id = `story-${story.StoryID}`;

    const titleElement = document.createElement('h3');
    titleElement.textContent = story.StoryTitle;
    storyElement.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = story.Description;
    storyElement.appendChild(descriptionElement);

    const authorElement = document.createElement('p');
    authorElement.textContent = `Author: ${story.Author}`;
    storyElement.appendChild(authorElement);

    const roleElement = document.createElement('p');
    roleElement.textContent = `Author's Role: ${story.AuthorRole}`;
    storyElement.appendChild(roleElement);

    const highlightsElement = document.createElement('p');
    highlightsElement.textContent = `Story Highlights: ${story.StoryHighlights}`;
    storyElement.appendChild(highlightsElement);

    const categoryElement = document.createElement('p');
    categoryElement.textContent = `Category: ${story.Category}`;
    storyElement.appendChild(categoryElement);

    story.images.forEach(imagePath => {
        const imageElement = document.createElement('img');
        imageElement.src = imagePath;
        imageElement.alt = 'Story Image';
        imageElement.style.width = '100px';
        imageElement.style.height = '100px';
        imageElement.classList.add('album-image');
        imageElement.onclick = () => viewFullSize(`${imagePath}`);
        storyElement.appendChild(imageElement);
    });

    const storyActions = document.createElement('div');
    storyActions.classList.add('album-actions');

    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', () => deleteStory(story.StoryID));
    const deleteImage = document.createElement('img');
    deleteImage.src = 'images/delete.png';
    deleteImage.alt = 'Delete';
    deleteImage.style.width = '20px';
    deleteImage.style.height = '20px';
    deleteImage.title = 'Delete';
    deleteButton.appendChild(deleteImage);
    storyActions.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.addEventListener('click', () => editStory(story.StoryID));
    const editImage = document.createElement('img');
    editImage.src = 'images/edit.png';
    editImage.alt = 'Edit';
    editImage.style.width = '20px';
    editImage.style.height = '20px';
    editImage.title = 'Edit';
    editButton.appendChild(editImage);
    storyActions.appendChild(editButton);

    storyElement.appendChild(storyActions);
    photoGallery.appendChild(storyElement);
}

function openModal() {
    document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

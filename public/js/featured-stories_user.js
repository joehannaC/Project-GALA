document.addEventListener('DOMContentLoaded', function() {
    fetch('/path/to/your/database/api') // Adjust with the actual API endpoint
        .then(response => response.json())
        .then(data => {
            const storiesContainer = document.getElementById('stories-container');
            data.forEach(story => {
                const storyHTML = `
                    <div class="story-container">
                        <div class="story">
                            <div class="story-header">
                                <div class="author-image-container">
                                    <img src="${story.authorImage}" alt="${story.authorName}'s image" class="author-image">
                                </div>
                                <div class="story-details">
                                    <h2>${story.title}</h2>
                                    <p class="summary">${story.summary}</p>
                                </div>
                            </div>
                            <div class="story-footer">
                                <div class="author-info">
                                    <p class="author-name">${story.authorName}</p>
                                    <p class="author-role">${story.authorRole}</p>
                                </div>
                                <a href="${story.link}" class="read-story" onclick="openModal()">Read author's story</a>
                            </div>
                        </div>
                    </div>`;
                storiesContainer.insertAdjacentHTML('beforeend', storyHTML);
            });
        });
});

function openModal(story) {
    document.getElementById('modal-author-image').src = story.authorImage;
    document.getElementById('modal-author-name').textContent = story.authorName;
    document.getElementById('modal-author-role').textContent = story.authorRole;
    document.getElementById('modal-story-title').textContent = story.title;
    document.getElementById('modal-story-content').textContent = story.content;
    document.getElementById('myModal').style.display = "block";
    // document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

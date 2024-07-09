document.addEventListener("DOMContentLoaded", function() {


});

document.addEventListener('DOMContentLoaded', function () {
    const descriptionContainers = document.querySelectorAll('.founder-description-container');

    function checkOverflow() {
        descriptionContainers.forEach(container => {
            const description = container.querySelector('.founder-description');
            const showMore = container.querySelector('.show-more');
            const isExpanded = description.style.maxHeight === 'none';
            
            if (description.scrollHeight > description.clientHeight || isExpanded) {
                showMore.style.display = 'block';
            } else {
                showMore.style.display = 'none';
            }
        });
    }

    checkOverflow();

    window.addEventListener('resize', checkOverflow);
});

function toggleDescription(element) {
    const description = element.previousElementSibling;
    const isExpanded = description.style.maxHeight === 'none';
    
    if (isExpanded) {
        description.style.maxHeight = description.scrollHeight + 'px';
        setTimeout(() => {
            description.style.maxHeight = '200px';
        }, 10);
        element.innerHTML = '&#x25B2;';
        element.classList.add('rotate');
    } else {
        description.style.maxHeight = description.scrollHeight + 'px';
        setTimeout(() => {
            description.style.maxHeight = 'none';
        }, 500); // This should match the transition duration
        element.innerHTML = '&#x25BC;';
        element.classList.add('rotate');
    }
}












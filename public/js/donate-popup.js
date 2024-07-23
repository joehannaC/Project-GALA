function showDonateModal() {
    document.getElementById('donateModal').style.display = 'block';
}

function closeDonateModal() {
    document.getElementById('donateModal').style.display = 'none';
}

function showImage(type) {
    var donationImage = document.getElementById('donationImage');
    if (type === 'bank') {
        donationImage.src = 'images/Donation/Payment Method/Bank.jpg'; 
    } else if (type === 'gcash') {
        donationImage.src = 'images/Donation/Payment Method/Gcash.jpg'; 
    }
    donationImage.style.display = 'block';
}
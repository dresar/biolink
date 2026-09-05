/**
 * WhatsApp Float JavaScript
 * Handles the WhatsApp floating button and modal functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi modal WhatsApp
    var whatsappModalEl = document.getElementById('whatsappModal');
    var whatsappModal = new bootstrap.Modal(whatsappModalEl);
    
    // Smooth scroll untuk tombol up
    document.getElementById('floatingUpBtn').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // WhatsApp button click handler
    document.getElementById('floatingWhatsappBtn').addEventListener('click', function() {
        whatsappModal.show();
    });
    
    // Template selection
    document.querySelectorAll('.template-item').forEach(function(item) {
        item.addEventListener('click', function() {
            document.getElementById('whatsappMessage').value = this.getAttribute('data-message');
        });
    });
    
    // Send WhatsApp message
    document.getElementById('sendWhatsappBtn').addEventListener('click', function() {
        var message = document.getElementById('whatsappMessage').value;
        if (message) {
            var encodedMessage = encodeURIComponent(message);
            var whatsappNumber = document.getElementById('sendWhatsappBtn').getAttribute('data-whatsapp');
            window.open('https://wa.me/' + whatsappNumber + '?text=' + encodedMessage, '_blank');
            whatsappModal.hide();
            removeBackdrop();
        }
    });
    
    // Event listener untuk tombol close dan cancel
    document.querySelector('#whatsappModal .btn-close').addEventListener('click', function() {
        removeBackdrop();
    });
    
    document.querySelector('#whatsappModal .btn-secondary').addEventListener('click', function() {
        removeBackdrop();
    });
    
    // Event listener untuk modal hidden event
    whatsappModalEl.addEventListener('hidden.bs.modal', function () {
        removeBackdrop();
    });
    
    // Fungsi untuk menghapus backdrop secara manual
    function removeBackdrop() {
        // Hapus backdrop yang tersisa
        var backdrops = document.getElementsByClassName('modal-backdrop');
        if (backdrops.length > 0) {
            for (var i = 0; i < backdrops.length; i++) {
                backdrops[i].classList.remove('show');
                backdrops[i].classList.remove('fade');
                document.body.removeChild(backdrops[i]);
            }
        }
        // Hapus class modal-open dari body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
});
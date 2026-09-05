/**
 * Product Detail Modal JavaScript
 * Handles the product detail modal functionality for the home page
 */

// Variable to store the Swiper instance
let productSwiper;

// Variable to store the Medium Zoom instance
let productZoom;

// Function to show product detail modal
function showProductDetailModal(productId) {
    fetch(`/product/detail/${productId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            const data = response.data;
            
            // Clear existing swiper slides except the first one
            const swiperWrapper = document.getElementById('product-images-container');
            while (swiperWrapper.children.length > 1) {
                swiperWrapper.removeChild(swiperWrapper.lastChild);
            }
            
            // Populate the main image
            if (data.image_url) {
                document.getElementById('detail-product-image').src = data.image_url;
                document.getElementById('detail-product-image').style.display = 'block';
                document.getElementById('detail-product-image').setAttribute('data-zoom', data.image_url);
            } else {
                document.getElementById('detail-product-image').style.display = 'none';
            }
            
            // Add additional images to the slider if available
            if (data.images && data.images.length > 0) {
                data.images.forEach(img => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'product-detail-image';
                    
                    const image = document.createElement('img');
                    image.src = img.url;
                    image.alt = `${data.title} - Image ${img.order}`;
                    image.className = 'img-zoomable';
                    image.setAttribute('data-zoom', img.url);
                    
                    imageContainer.appendChild(image);
                    slide.appendChild(imageContainer);
                    swiperWrapper.appendChild(slide);
                });
            }
            
            document.getElementById('detail-product-title').textContent = data.title;
            document.getElementById('detail-product-description').textContent = data.description;
            
            // Handle price display
            const priceElement = document.getElementById('detail-product-price');
            const discountElement = document.getElementById('detail-product-discount');
            
            priceElement.textContent = `Rp ${data.price}`;
            
            if (data.discount_price) {
                priceElement.classList.add('strikethrough');
                discountElement.textContent = `Rp ${data.discount_price}`;
                discountElement.style.display = 'inline-block';
            } else {
                priceElement.classList.remove('strikethrough');
                discountElement.style.display = 'none';
            }
            
            // Handle primary link display
            const linkContainer = document.getElementById('detail-product-link-container');
            const linkElement = document.getElementById('detail-product-link');
            const linkTextElement = document.getElementById('detail-product-link-text');
            
            if (data.link) {
                linkElement.href = data.link;
                linkContainer.style.display = 'block';
                
                // Update link button text with custom label if available
                if (data.link_label) {
                    linkTextElement.textContent = data.link_label;
                } else {
                    linkTextElement.textContent = 'Lihat Product';
                }
            } else {
                linkContainer.style.display = 'none';
            }
            
            // Handle additional link display
            const additionalLinkContainer = document.getElementById('detail-product-additional-link-container');
            const additionalLinkElement = document.getElementById('detail-product-additional-link');
            const additionalLinkTextElement = document.getElementById('detail-product-additional-link-text');
            
            if (data.additional_link && additionalLinkContainer && additionalLinkElement) {
                additionalLinkElement.href = data.additional_link;
                additionalLinkContainer.style.display = 'block';
                
                // Update additional link button text with custom label if available
                if (data.additional_link_label) {
                    additionalLinkTextElement.textContent = data.additional_link_label;
                } else {
                    additionalLinkTextElement.textContent = 'Link Tambahan';
                }
            } else if (additionalLinkContainer) {
                additionalLinkContainer.style.display = 'none';
            }
            
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
            modal.show();
            
            // Initialize Swiper after modal is shown
            modal._element.addEventListener('shown.bs.modal', function () {
                // Destroy existing swiper if it exists
                if (productSwiper) {
                    productSwiper.destroy();
                }
                
                // Initialize new Swiper
                productSwiper = new Swiper('.product-image-slider', {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: data.images && data.images.length > 0,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
                
                // Initialize Medium Zoom for all zoomable images
                if (productZoom) {
                    productZoom.detach();
                }
                productZoom = mediumZoom('.img-zoomable', {
                    margin: 50,
                    background: 'rgba(0, 0, 0, 0.9)',
                    scrollOffset: 0,
                });
            }, { once: true });
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            if (window.showToast) {
                window.showToast({
                    type: 'error',
                    message: 'Gagal memuat detail produk'
                });
            }
        });
}

// Initialize product cards to be clickable
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing product detail modal functionality...');
    
    // Make product cards clickable (for older browsers that might not support onclick in HTML)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (!card.getAttribute('onclick')) {
            const productId = card.getAttribute('data-product-id');
            if (productId) {
                card.addEventListener('click', function() {
                    showProductDetailModal(productId);
                });
            }
        }
    });
    
    console.log('Product detail modal functionality initialized');
});
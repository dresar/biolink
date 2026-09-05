/**
 * Preview Modal JavaScript
 * Handles the preview functionality for services, products, and social media
 */

// Service Preview Function
function showServicePreview(serviceId) {
    fetch(`/eka/service/preview/${serviceId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            const data = response.data;
            // Populate the modal with service data
            if (data.icon_url) {
                // If icon_url is provided, use an img element
                document.getElementById('preview-service-icon').innerHTML = `<img src="${data.icon_url}" alt="${data.title}">`;
                document.getElementById('preview-service-icon').className = '';
            } else if (data.icon) {
                // If icon class is provided, use it
                document.getElementById('preview-service-icon').className = data.icon;
                document.getElementById('preview-service-icon').innerHTML = '';
            }
            
            document.getElementById('preview-service-title').textContent = data.title;
            document.getElementById('preview-service-description').textContent = data.description;
            
            // Apply color styles
            const servicePreview = document.querySelector('.service-preview');
            if (data.gradient_type && data.gradient_color) {
                let gradientStyle = '';
                if (data.gradient_type === 'linear') {
                    const direction = data.gradient_direction || 'to right';
                    gradientStyle = `linear-gradient(${direction}, ${data.color}, ${data.gradient_color})`;
                } else if (data.gradient_type === 'radial') {
                    gradientStyle = `radial-gradient(circle, ${data.color}, ${data.gradient_color})`;
                }
                servicePreview.style.background = gradientStyle;
            } else {
                servicePreview.style.background = data.color || '#007bff';
            }
            
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('servicePreviewModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching service data:', error);
            showToast('error', 'Gagal memuat preview layanan');
        });
}

// Variable to store the Preview Product Swiper instance
let previewProductSwiper;

// Variable to store the Preview Product Zoom instance
let previewProductZoom;

// Product Preview Function
function showProductPreview(productId) {
    fetch(`/eka/product/preview/${productId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            const data = response.data;
            
            // Clear existing swiper slides except the first one
            const swiperWrapper = document.getElementById('preview-product-images-container');
            while (swiperWrapper.children.length > 1) {
                swiperWrapper.removeChild(swiperWrapper.lastChild);
            }
            
            // Populate the main image
            if (data.image_url) {
                document.getElementById('preview-product-image').src = data.image_url;
                document.getElementById('preview-product-image').style.display = 'block';
                document.getElementById('preview-product-image').setAttribute('data-zoom', data.image_url);
            } else {
                document.getElementById('preview-product-image').style.display = 'none';
            }
            
            // Add additional images to the slider if available
            if (data.additional_images && data.additional_images.length > 0) {
                data.additional_images.forEach(img => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'product-preview-image';
                    
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
            
            document.getElementById('preview-product-title').textContent = data.title;
            document.getElementById('preview-product-description').textContent = data.description;
            
            // Handle price display
            const priceElement = document.getElementById('preview-product-price');
            const discountElement = document.getElementById('preview-product-discount');
            
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
            const linkContainer = document.getElementById('preview-product-link-container');
            const linkElement = document.getElementById('preview-product-link');
            const linkLabelElement = document.getElementById('preview-product-link-label');
            
            if (data.link) {
                linkElement.href = data.link;
                linkContainer.style.display = 'block';
                
                // Update link button text with custom label if available
                if (data.link_label) {
                    linkLabelElement.textContent = data.link_label;
                } else {
                    linkLabelElement.textContent = 'Link Produk';
                }
            } else {
                linkContainer.style.display = 'none';
            }
            
            // Handle additional link display
            const additionalLinkContainer = document.getElementById('preview-product-additional-link-container');
            const additionalLinkElement = document.getElementById('preview-product-additional-link');
            const additionalLinkLabelElement = document.getElementById('preview-product-additional-link-label');
            
            if (data.additional_link) {
                additionalLinkElement.href = data.additional_link;
                additionalLinkContainer.style.display = 'block';
                
                // Update additional link button text with custom label if available
                if (data.additional_link_label) {
                    additionalLinkLabelElement.textContent = data.additional_link_label;
                } else {
                    additionalLinkLabelElement.textContent = 'Link Tambahan';
                }
            } else {
                additionalLinkContainer.style.display = 'none';
            }
            
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('productPreviewModal'));
            modal.show();
            
            // Initialize Swiper after modal is shown
            modal._element.addEventListener('shown.bs.modal', function () {
                // Destroy existing swiper if it exists
                if (previewProductSwiper) {
                    previewProductSwiper.destroy();
                }
                
                // Initialize new Swiper
                previewProductSwiper = new Swiper('#productPreviewModal .product-image-slider', {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: data.additional_images && data.additional_images.length > 0,
                    pagination: {
                        el: '#productPreviewModal .swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '#productPreviewModal .swiper-button-next',
                        prevEl: '#productPreviewModal .swiper-button-prev',
                    },
                });
                
                // Initialize Medium Zoom for all zoomable images if available
                if (typeof mediumZoom !== 'undefined') {
                    if (previewProductZoom) {
                        previewProductZoom.detach();
                    }
                    previewProductZoom = mediumZoom('#productPreviewModal .img-zoomable', {
                        margin: 50,
                        background: 'rgba(0, 0, 0, 0.9)',
                        scrollOffset: 0,
                    });
                }
            }, { once: true });
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            showToast('error', 'Gagal memuat preview produk');
        });
}

// Social Media Preview Function
function showSocialPreview(socialId) {
    fetch(`/eka/social/preview/${socialId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            const data = response.data;
            // Populate the modal with social media data
            document.getElementById('preview-social-icon').className = `fab fa-${data.platform.toLowerCase()}`;
            document.getElementById('preview-social-platform').textContent = data.platform_display || data.platform;
            document.getElementById('preview-social-username').textContent = data.username;
            
            const urlElement = document.getElementById('preview-social-url');
            urlElement.href = data.link || data.url;
            urlElement.textContent = data.link || data.url;
            
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('socialPreviewModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching social media data:', error);
            showToast('error', 'Gagal memuat preview media sosial');
        });
}
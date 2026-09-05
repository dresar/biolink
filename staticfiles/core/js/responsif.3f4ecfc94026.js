/**
 * Responsif.js - Script untuk menangani responsivitas tambahan
 * Untuk Bio Link - Mendukung main.js tanpa konflik
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Responsif.js: DOM Content Loaded');
    
    // Tunggu sebentar agar main.js selesai inisialisasi
    setTimeout(() => {
        initAdditionalResponsiveFeatures();
        initLazyLoading();
        initResponsiveTables();
        initAccessibilityFeatures();
    }, 100);
});

/**
 * Inisialisasi fitur responsif tambahan
 */
function initAdditionalResponsiveFeatures() {
    console.log('Responsif.js: Initializing additional responsive features');
    
    // Deteksi perubahan orientasi
    handleOrientationChange();
    
    // Optimasi untuk perangkat dengan memory rendah
    handleLowMemoryDevices();
    
    // Perbaikan untuk keyboard navigation
    improveKeyboardNavigation();
}

/**
 * Handle orientation changes
 */
function handleOrientationChange() {
    function adjustForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.body.classList.toggle('landscape-mobile', isLandscape);
            
            // Adjust floating elements in landscape mode
            const floatingButtons = document.querySelector('.floating-buttons');
            const themeToggle = document.querySelector('.theme-toggle');
            
            if (isLandscape) {
                if (floatingButtons) {
                    floatingButtons.style.bottom = '0.5rem';
                    floatingButtons.style.right = '0.5rem';
                }
                if (themeToggle) {
                    themeToggle.style.top = '0.5rem';
                    themeToggle.style.right = '0.5rem';
                }
            } else {
                if (floatingButtons) {
                    floatingButtons.style.bottom = '1rem';
                    floatingButtons.style.right = '1rem';
                }
                if (themeToggle) {
                    themeToggle.style.top = '1rem';
                    themeToggle.style.right = '1rem';
                }
            }
        }
    }
    
    // Initial check
    adjustForOrientation();
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustForOrientation, 100);
    });
    
    // Also listen for resize as backup
    window.addEventListener('resize', adjustForOrientation, { passive: true });
}

/**
 * Handle low memory devices
 */
function handleLowMemoryDevices() {
    // Check if device has limited memory
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isLowEnd = connection && (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    if (isLowEnd) {
        console.log('Low-end device detected, optimizing...');
        document.body.classList.add('low-memory-device');
        
        // Reduce animations
        const style = document.createElement('style');
        style.textContent = `
            .low-memory-device * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Improve keyboard navigation
 */
function improveKeyboardNavigation() {
    // Add visible focus indicators
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });
    
    // Improve focus management for modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const firstInput = modal.querySelector('input, button, [tabindex]');
            if (firstInput) {
                firstInput.focus();
            }
        });
    });
}

/**
 * Inisialisasi lazy loading untuk gambar
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
        
        console.log(`Lazy loading initialized for ${lazyImages.length} images`);
    }
}

/**
 * Inisialisasi responsive tables
 */
function initResponsiveTables() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.parentElement.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

/**
 * Inisialisasi fitur aksesibilitas
 */
function initAccessibilityFeatures() {
    // Skip to content link
    if (!document.querySelector('.skip-to-content')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        // Menggunakan event click untuk scroll ke main-content tanpa mengubah URL
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                // Gunakan scrollIntoView tanpa smooth behavior untuk performa lebih baik
                mainContent.scrollIntoView({ behavior: 'auto' });
            }
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Add main content id if not exists
    const mainContent = document.querySelector('main, .bio-container, .container');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
        // Tambahkan tabindex agar elemen dapat menerima fokus
        mainContent.setAttribute('tabindex', '-1');
        // Tambahkan style untuk menghilangkan outline saat fokus
        mainContent.style.outline = 'none';
    }
    
    // Improve button accessibility
    const buttons = document.querySelectorAll('button:not([aria-label]):not([title])');
    buttons.forEach(button => {
        const text = button.textContent.trim() || button.innerHTML.replace(/<[^>]*>/g, '').trim();
        if (text) {
            button.setAttribute('aria-label', text);
        }
    });
}

/**
 * Utility function untuk debug
 */
function debugResponsive() {
    console.log('=== RESPONSIVE DEBUG INFO ===');
    console.log('Window size:', window.innerWidth, 'x', window.innerHeight);
    console.log('Device pixel ratio:', window.devicePixelRatio);
    console.log('User agent:', navigator.userAgent);
    console.log('Touch support:', 'ontouchstart' in window);
    console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Stored theme:', localStorage.getItem('theme'));
    console.log('==============================');
}

// Export debug function to global scope
window.debugResponsive = debugResponsive;

// Auto-debug on development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(debugResponsive, 1000);
}

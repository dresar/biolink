/**
 * Main JavaScript file for Bio Link
 * Contains functionality for responsive elements, theme toggle, and notifications
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing...');
    
    // Initialize in order
    initNotificationSystem();
    initThemeToggle();
    initResponsiveElements();
    
    console.log('All systems initialized');
});

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    console.log('Initializing theme toggle...');
    
    let themeToggleBtn = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    
    // Create theme toggle button if it doesn't exist
    if (!themeToggleBtn) {
        console.log('Creating theme toggle button...');
        themeToggleBtn = createThemeToggleButton();
    }
    
    // Get stored theme or system preference
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    setTheme(initialTheme);
    
    // Add click event listener (remove any existing ones first)
    const newThemeToggleBtn = themeToggleBtn.cloneNode(true);
    themeToggleBtn.parentNode.replaceChild(newThemeToggleBtn, themeToggleBtn);
    
    newThemeToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log(`Switching theme from ${currentTheme} to ${newTheme}`);
        setTheme(newTheme);
        
        // Show notification
        if (window.showToast) {
            window.showToast({
                type: 'info',
                message: `Mode ${newTheme === 'dark' ? 'Gelap' : 'Terang'} Diaktifkan`,
                duration: 2000
            });
        }
    });
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
        }
    });
    
    console.log('Theme toggle initialized successfully');
}

/**
 * Set theme and update UI
 */
function setTheme(theme) {
    console.log(`Setting theme to: ${theme}`);
    
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.querySelector('.theme-toggle');
    
    // Set theme attribute
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    if (themeToggleBtn) {
        updateThemeIcon(theme, themeToggleBtn);
    }
    
    // Force repaint to ensure CSS changes take effect
    htmlElement.style.display = 'none';
    htmlElement.offsetHeight; // Trigger reflow
    htmlElement.style.display = '';
    
    console.log(`Theme set to ${theme} successfully`);
}

/**
 * Update theme toggle icon
 */
function updateThemeIcon(theme, button) {
    if (!button) return;
    
    const icon = button.querySelector('i') || document.createElement('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    if (!button.contains(icon)) {
        button.appendChild(icon);
    }
    
    // Update aria-label for accessibility
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    button.setAttribute('title', `Mode ${theme === 'dark' ? 'Terang' : 'Gelap'}`);
}

/**
 * Create theme toggle button
 */
function createThemeToggleButton() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    button.setAttribute('title', 'Ubah Tema');
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-moon';
    button.appendChild(icon);
    
    document.body.appendChild(button);
    
    console.log('Theme toggle button created');
    return button;
}

/**
 * Initialize responsive elements
 */
function initResponsiveElements() {
    console.log('Initializing responsive elements...');
    
    // Handle card animations on touch devices
    const cards = document.querySelectorAll('.service-card, .product-card');
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    if (isTouchDevice) {
        console.log('Touch device detected, adding touch handlers');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('card-touch');
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.classList.remove('card-touch');
                this.classList.add('card-clicked');
                setTimeout(() => {
                    this.classList.remove('card-clicked');
                }, 500);
            }, { passive: true });
        });
    }
    
    // Fix for iOS 100vh issue
    function setVhProperty() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVhProperty();
    window.addEventListener('resize', setVhProperty, { passive: true });
    
    // Handle fixed position elements during scroll on mobile
    const fixedElements = document.querySelectorAll('.floating-buttons, .theme-toggle');
    let ticking = false;
    
    function updateFixedElements() {
        if (window.innerWidth <= 576) {
            fixedElements.forEach(el => {
                if (el) {
                    el.style.transform = 'translateZ(0)';
                }
            });
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking && window.innerWidth <= 576) {
            requestAnimationFrame(updateFixedElements);
            ticking = true;
        }
    }, { passive: true });
    
    console.log('Responsive elements initialized');
}

/**
 * Initialize notification system
 */
function initNotificationSystem() {
    console.log('Initializing notification system...');
    
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
        console.log('Notification container created');
    }
    
    // Global notification function
    window.showToast = function(options) {
        showNotification(options);
    };
    
    console.log('Notification system initialized');
}

/**
 * Show notification
 */
function showNotification(options) {
    const { type = 'info', message, duration = 3000 } = options;
    const container = document.getElementById('notification-container');
    
    if (!container || !message) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let iconClass = 'fa-info-circle';
    switch (type) {
        case 'success':
            iconClass = 'fa-check-circle';
            break;
        case 'error':
            iconClass = 'fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fa-exclamation-triangle';
            break;
    }
    
    // Create notification HTML
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${iconClass} notification-icon"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">×</button>
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        removeNotification(notification);
    });
    
    // Add to container
    container.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
}

/**
 * Remove notification with animation
 */
function removeNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Expose functions globally for debugging
window.setTheme = setTheme;
window.initThemeToggle = initThemeToggle;

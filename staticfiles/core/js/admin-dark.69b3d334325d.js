/**
 * Admin Dark Theme JavaScript
 * Handles dark mode toggle and responsive sidebar functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add dark mode toggle button to navbar
    const navbarNav = document.querySelector('.navbar .d-flex');
    if (navbarNav) {
        const darkModeToggle = document.createElement('div');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.setAttribute('title', 'Toggle Dark Mode');
        navbarNav.prepend(darkModeToggle);
        
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Dark mode toggle functionality
        darkModeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
                this.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
                this.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }
    
    // Add sidebar toggle button for mobile
    const navbar = document.querySelector('.navbar .container-fluid');
    if (navbar) {
        // Cek apakah tombol toggle sudah ada
        let sidebarToggle = document.querySelector('.sidebar-toggle');
        
        // Jika belum ada, buat tombol baru
        if (!sidebarToggle) {
            sidebarToggle = document.createElement('button');
            sidebarToggle.className = 'sidebar-toggle';
            sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
            sidebarToggle.setAttribute('title', 'Toggle Sidebar');
            sidebarToggle.setAttribute('type', 'button');
            document.body.appendChild(sidebarToggle);
            
            // Ensure sidebar toggle is visible on mobile and add Dashboard text
            if (window.innerWidth <= 768) {
                sidebarToggle.style.display = 'block';
                sidebarToggle.innerHTML = '<i class="fas fa-bars"></i> Dashboard';
                sidebarToggle.style.width = 'auto';
                sidebarToggle.style.fontSize = '1rem';
                sidebarToggle.style.padding = '8px 12px';
            }
        }
        
        // Sidebar toggle functionality for mobile
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('show');
            
            // Tambahkan overlay untuk menutup sidebar saat diklik di luar
            if (sidebar.classList.contains('show')) {
                // Tambahkan tombol close (silang) di sidebar
                let closeButton = document.querySelector('.sidebar-close-btn');
                if (!closeButton) {
                    closeButton = document.createElement('button');
                    closeButton.className = 'sidebar-close-btn';
                    closeButton.innerHTML = '<i class="fas fa-times"></i>';
                    closeButton.style.position = 'absolute';
                    closeButton.style.top = '10px';
                    closeButton.style.right = '10px';
                    closeButton.style.background = 'transparent';
                    closeButton.style.border = 'none';
                    closeButton.style.color = '#fff';
                    closeButton.style.fontSize = '1.5rem';
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.zIndex = '1060';
                    sidebar.insertBefore(closeButton, sidebar.firstChild);
                    
                    closeButton.addEventListener('click', function() {
                        sidebar.classList.remove('show');
                        const existingOverlay = document.querySelector('.sidebar-overlay');
                        if (existingOverlay) {
                            existingOverlay.remove();
                        }
                    });
                }
                
                const overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
                overlay.style.zIndex = '1030';
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('show');
                    overlay.remove();
                });
            } else {
                const existingOverlay = document.querySelector('.sidebar-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
            }
        });
    }
    
    // Handle window resize to reset sidebar state
    window.addEventListener('resize', function() {
        if (window.innerWidth > 576) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('show');
            }
        }
    });
    
    // Add responsive behavior to tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.parentElement.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
    
    // Add touch support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        // Swipe right to open sidebar
        if (touchEndX - touchStartX > 100 && window.innerWidth <= 576) {
            sidebar.classList.add('show');
        }
        
        // Swipe left to close sidebar
        if (touchStartX - touchEndX > 100 && window.innerWidth <= 576) {
            sidebar.classList.remove('show');
        }
    }
});
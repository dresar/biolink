/**
 * Particles.js - Interactive particle animations for Bio Link
 * Uses tsParticles library for creating interactive and touch-responsive particle effects
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Particles.js: Initializing particle effects...');
    
    // Create a container for particles if it doesn't exist
    if (!document.getElementById('tsparticles')) {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'tsparticles';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.zIndex = '-1';
        particlesContainer.style.pointerEvents = 'none';
        document.body.prepend(particlesContainer);
    }
    
    // Load tsParticles library dynamically
    loadTsParticles();
});

/**
 * Load tsParticles library and initialize
 */
function loadTsParticles() {
    // Check if tsParticles is already loaded
    if (window.tsParticles) {
        console.log('tsParticles already loaded, initializing...');
        initParticles();
        return;
    }
    
    // Load tsParticles library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js';
    script.onload = function() {
        console.log('tsParticles loaded successfully');
        initParticles();
    };
    script.onerror = function() {
        console.error('Failed to load tsParticles, trying alternative version');
        const alternativeScript = document.createElement('script');
        alternativeScript.src = 'https://cdn.jsdelivr.net/npm/tsparticles@1.42.4/tsparticles.min.js';
        alternativeScript.onload = initParticlesLegacy;
        document.head.appendChild(alternativeScript);
    };
    document.head.appendChild(script);
}

/**
 * Initialize particles with interactive configuration for tsParticles v2+
 */
async function initParticles() {
    console.log('tsParticles loaded, initializing...');
    
    try {
        // Check if tsParticles has the load method (v2+)
        if (typeof tsParticles.load === 'function') {
            await tsParticles.load("tsparticles", getParticlesConfig());
            console.log('Particles initialized successfully with tsParticles v2+');
            
            // Add interaction detection
            const container = document.getElementById('tsparticles');
            if (container) {
                container.addEventListener('mousemove', function() {
                    container.classList.add('interacting');
                    setTimeout(() => container.classList.remove('interacting'), 500);
                });
                
                container.addEventListener('touchmove', function() {
                    container.classList.add('interacting');
                    setTimeout(() => container.classList.remove('interacting'), 500);
                });
            }
        } else {
            // Fallback to legacy initialization
            initParticlesLegacy();
        }
    } catch (error) {
        console.error('Error initializing particles:', error);
        // Try legacy version as fallback
        initParticlesLegacy();
    }
}

/**
 * Initialize particles with interactive configuration for tsParticles v1.x
 */
function initParticlesLegacy() {
    console.log('Using legacy tsParticles initialization...');
    
    try {
        if (typeof tsParticles.loadJSON === 'function') {
            tsParticles.loadJSON('tsparticles', getParticlesConfig())
                .then(function() {
                    console.log('Particles initialized successfully with legacy method');
                })
                .catch(function(error) {
                    console.error('Error initializing particles with legacy method:', error);
                });
        } else if (window.particlesJS) {
            // Super fallback to particles.js if available
            window.particlesJS('tsparticles', getParticlesConfig());
            console.log('Particles initialized with particlesJS fallback');
        } else {
            console.error('Could not initialize particles: No compatible library found');
        }
    } catch (error) {
        console.error('Error in legacy particles initialization:', error);
    }
}

/**
 * Get particles configuration
 * @returns {Object} Particles configuration object
 */
function getParticlesConfig() {
    return {
        fullScreen: {
            enable: true,
            zIndex: -1
        },
        fpsLimit: 60,
        particles: {
            number: {
                value: 30,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ["#4a6bff", "#764ba2", "#667eea"],
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.6,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 5,
                random: true,
                anim: {
                    enable: true,
                    speed: 4,
                    size_min: 0.3,
                    sync: false
                }
            },
            links: {
                enable: true,
                distance: 150,
                color: "#808080",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true,
                // Touch events for mobile
                touchstart: {
                    enable: true,
                    mode: "push"
                },
                touchmove: {
                    enable: true,
                    mode: "grab"
                }
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true,
        background: {
            color: "transparent",
            image: "",
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover"
        }
    };
}

/**
 * Create a custom CSS for particles
 */
function createParticlesStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #tsparticles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }
        
        /* Adjust particle visibility based on theme */
        html[data-theme="dark"] #tsparticles canvas {
            opacity: 0.7;
        }
        
        html[data-theme="light"] #tsparticles canvas {
            opacity: 0.5;
        }
    `;
    document.head.appendChild(style);
}

// Create styles when DOM is loaded
document.addEventListener('DOMContentLoaded', createParticlesStyles);
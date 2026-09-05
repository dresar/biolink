/**
 * Vanilla Particles - Simple fallback particle system using pure JavaScript
 * Creates interactive particles that respond to mouse/touch movement
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Vanilla Particles: Initializing fallback particle system...');
    
    // Check if tsParticles is working
    const tsParticlesContainer = document.getElementById('tsparticles');
    if (tsParticlesContainer && tsParticlesContainer.children.length > 0) {
        console.log('tsParticles is working, no need for vanilla fallback');
        return;
    }
    
    // Create canvas for particles
    const canvas = document.createElement('canvas');
    canvas.id = 'vanilla-particles';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);
    
    // Initialize the particle system
    initVanillaParticles(canvas);
});

/**
 * Initialize vanilla particle system
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
function initVanillaParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let touchX = 0;
    let touchY = 0;
    let isTouch = false;
    
    // Resize canvas to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Create particles
    function createParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 20), 50); // Responsive count
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 4 + 1,
                color: getRandomColor(),
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    // Get random color from theme
    function getRandomColor() {
        const colors = ['#4a6bff', '#764ba2', '#667eea'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Draw particles
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }
            
            // Interact with mouse/touch
            if (isTouch) {
                const dx = particle.x - touchX;
                const dy = particle.y - touchY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    const force = (100 - distance) / 100;
                    
                    particle.speedX += Math.cos(angle) * force * 0.2;
                    particle.speedY += Math.sin(angle) * force * 0.2;
                }
            } else {
                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    const force = (100 - distance) / 100;
                    
                    particle.speedX += Math.cos(angle) * force * 0.2;
                    particle.speedY += Math.sin(angle) * force * 0.2;
                }
            }
            
            // Limit speed
            const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (speed > 2) {
                particle.speedX = (particle.speedX / speed) * 2;
                particle.speedY = (particle.speedY / speed) * 2;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = particle.color;
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.stroke();
                }
            });
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawParticles);
    }
    
    // Event listeners
    window.addEventListener('resize', function() {
        resizeCanvas();
        createParticles();
    });
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isTouch = false;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
            isTouch = true;
            
            // Add visual effect on touch
            for (let i = 0; i < 3; i++) {
                particles.push({
                    x: touchX + Math.random() * 20 - 10,
                    y: touchY + Math.random() * 20 - 10,
                    radius: Math.random() * 4 + 2,
                    color: getRandomColor(),
                    speedX: Math.random() * 4 - 2,
                    speedY: Math.random() * 4 - 2,
                    opacity: 0.8
                });
                
                // Keep particle count in check
                if (particles.length > 100) {
                    particles.shift();
                }
            }
        }
    });
    
    document.addEventListener('click', function(e) {
        // Add particles on click
        for (let i = 0; i < 8; i++) {
            particles.push({
                x: e.clientX + Math.random() * 20 - 10,
                y: e.clientY + Math.random() * 20 - 10,
                radius: Math.random() * 4 + 2,
                color: getRandomColor(),
                speedX: Math.random() * 6 - 3,
                speedY: Math.random() * 6 - 3,
                opacity: 0.8
            });
            
            // Keep particle count in check
            if (particles.length > 100) {
                particles.shift();
            }
        }
    });
    
    // Initialize
    resizeCanvas();
    createParticles();
    drawParticles();
    
    console.log('Vanilla particles initialized with', particles.length, 'particles');
}
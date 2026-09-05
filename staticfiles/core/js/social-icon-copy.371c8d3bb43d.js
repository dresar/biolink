/**
 * Social Icon Copy Functionality
 * Handles copying icon class names to clipboard in the admin panel
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all copy buttons in the icon reference section
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    // Add click event listener to each button
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the icon class from the data attribute
            const iconClass = this.getAttribute('data-icon-class');
            
            // Create a temporary textarea element to copy from
            const textarea = document.createElement('textarea');
            textarea.value = iconClass;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            // Select and copy the text
            textarea.select();
            document.execCommand('copy');
            
            // Remove the temporary textarea
            document.body.removeChild(textarea);
            
            // Visual feedback that the text was copied
            const originalText = this.textContent;
            this.textContent = 'Tersalin!';
            this.classList.add('copied');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('copied');
            }, 2000);
        });
    });
});
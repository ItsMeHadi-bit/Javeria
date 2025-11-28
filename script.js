document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const loveMeter = document.getElementById('loveMeter');
    const heartsContainer = document.getElementById('heartsContainer');
    const flipbook = document.querySelector('.flipbook');
    
    let currentPage = 0;
    let isAnimating = false;
    let scale = 1; // For zoom
    let lastTap = 0; // For double-tap detection
    
    function updatePage() {
        if (isAnimating) return;
        isAnimating = true;
        
        pages.forEach((page, index) => {
            page.classList.toggle('active', index === currentPage);
        });
        pageIndicator.textContent = `Page ${currentPage + 1} of ${pages.length}`;
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pages.length - 1;
        
        // Add flip animation with a "hot" twist
        flipbook.style.transform = `rotateY(${currentPage * -10}deg) scale(${scale})`;
        
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePage();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentPage > 0) {
            currentPage--;
            updatePage();
        } else if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
            currentPage++;
            updatePage();
        }
    });
    
    // Enhanced Touch/Swipe for mobile
    let startX = 0;
    let startY = 0;
    flipbook.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        // Double-tap zoom
        const currentTime = new Date().getTime();
        const tapGap = currentTime - lastTap;
        if (tapGap < 300 && tapGap > 0) {
            scale = scale === 1 ? 1.5 : 1; // Toggle zoom
            updatePage();
            // Simulate haptic feedback (vibration effect)
            flipbook.style.animation = 'vibrate 0.3s';
            setTimeout(() => flipbook.style.animation = '', 300);
        }
        lastTap = currentTime;
    });
    
    flipbook.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = Math.abs(startY - endY);
        
        // Only swipe if horizontal movement is greater (ignore vertical scrolls)
        if (Math.abs(diffX) > 50 && diffY < 100) {
            if (diffX > 0 && currentPage < pages.length - 1) {
                currentPage++;
                updatePage();
            } else if (diffX < 0 && currentPage > 0) {
                currentPage--;
                updatePage();
            }
        }
    });
    
    // Love Meter interactivity with "heat" effect
    loveMeter.addEventListener('input', () => {
        const value = loveMeter.value;
        heartsContainer.innerHTML = '❤️🔥'.repeat(Math.floor(value / 10)); // Add flames for heat
        heartsContainer.style.textShadow = `0 0 ${value / 10}px #ff4500`; // Glow intensifies
    });
    
    // Add vibrate animation for mobile feedback
    const style = document.createElement('style');
    style.textContent = `
        @keyframes vibrate {
            0% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            50% { transform: translateX(2px); }
            75% { transform: translateX(-2px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
    
    updatePage(); // Initialize
});
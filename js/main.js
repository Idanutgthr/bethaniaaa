// CONFIGURATION - Anda bisa ubah nilai ini sesuai kebutuhan
const LOADING_CONFIG = {
    totalDuration: 20000, // Total durasi loading dalam milidetik (default: 2000ms = 2 detik)
    minLoadingTime: 1500, // Waktu minimum loading (meski cepat tetap menunggu)
    steps: 100, // Jumlah step persentase (default: 100 step = 1% per step)
    fallbackTime: 20000, // Fallback timeout jika ada error (8 detik)
};

// Main JavaScript untuk Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website Loading for Bethania... 💖');
    console.log('Loading Config:', LOADING_CONFIG);
    
    // Elements
    const loadingScreen = document.getElementById('loading-screen');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Variables
    let percentage = 0;
    let startTime = Date.now();
    const intervalTime = LOADING_CONFIG.totalDuration / LOADING_CONFIG.steps;
    
    // Animate loading percentage
    function animateLoading() {
        const interval = setInterval(() => {
            // Calculate percentage based on elapsed time
            const elapsedTime = Date.now() - startTime;
            percentage = Math.min(100, (elapsedTime / LOADING_CONFIG.totalDuration) * 100);
            
            // Update UI
            loadingPercentage.textContent = Math.floor(percentage) + '%';
            loadingProgress.style.width = percentage + '%';
            
            // Check if loading is complete
            if (percentage >= 100) {
                clearInterval(interval);
                
                // Ensure minimum loading time is respected
                const actualElapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, LOADING_CONFIG.minLoadingTime - actualElapsedTime);
                
                setTimeout(() => {
                    // Fade out loading screen dengan efek smooth
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transform = 'scale(0.95)';
                    loadingScreen.style.transition = 'all 0.8s ease';
                    
                    // Setelah fade out, redirect ke screen1.html
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        window.location.href = 'screen1.html';
                    }, 800);
                }, remainingTime);
            }
        }, intervalTime);
    }
    
    // Responsive emoji size adjustment
    function adjustEmojiSize() {
        const heartsContainer = document.querySelector('.loading-hearts-horizontal');
        const hearts = document.querySelectorAll('.loading-hearts-horizontal .heart');
        const containerWidth = heartsContainer.offsetWidth;
        
        if (hearts.length > 0 && containerWidth > 0) {
            // Hitung ukuran maksimal yang sesuai
            const gap = 10; // Sesuai dengan CSS
            const maxEmojiWidth = (containerWidth - (gap * (hearts.length - 1))) / hearts.length;
            const maxFontSize = maxEmojiWidth * 0.8; // 80% dari width untuk font
            
            // Terapkan font size yang sesuai
            hearts.forEach(heart => {
                const currentFontSize = parseFloat(window.getComputedStyle(heart).fontSize);
                const newFontSize = Math.min(currentFontSize, maxFontSize);
                heart.style.fontSize = `${newFontSize}px`;
            });
        }
    }
    
    // Initialize loading animation
    function initLoading() {
        // Adjust emoji size first
        adjustEmojiSize();
        
        // Start loading animation
        startTime = Date.now();
        animateLoading();
        
        // Adjust on resize
        window.addEventListener('resize', adjustEmojiSize);
        window.addEventListener('orientationchange', function() {
            setTimeout(adjustEmojiSize, 100);
        });
    }
    
    // Start everything
    initLoading();
    
    // Fallback jika loading terlalu lama
    setTimeout(function() {
        if (loadingScreen.style.display !== 'none' && 
            loadingScreen.style.opacity !== '0' &&
            percentage < 100) {
            console.log('Loading fallback activated');
            window.location.href = 'screen1.html';
        }
    }, LOADING_CONFIG.fallbackTime);
    
    // Tambahkan event untuk manual skip (untuk testing)
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Escape') {
            console.log('Manual skip activated');
            window.location.href = 'screen1.html';
        }
    });
    
    // Tambahkan click to skip (opsional, bisa diaktifkan jika perlu)
    // loadingScreen.addEventListener('click', function() {
    //     console.log('Click skip activated');
    //     window.location.href = 'screen1.html';
    // });
});

// Export config untuk akses dari console (untuk debugging)
window.LOADING_CONFIG = LOADING_CONFIG;
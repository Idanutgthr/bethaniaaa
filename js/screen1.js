document.addEventListener('DOMContentLoaded', function() {
    console.log('Screen 1 Initialized 🎉');
    
    // Elements
    const clickMeBtn = document.getElementById('clickMeBtn');
    const floatingEmojis = document.getElementById('floating-emojis');
    const clickSound = document.getElementById('clickSound');
    const screenContainer = document.querySelector('.screen1-container');
    const screenWatermark = document.querySelector('.screen-watermark');
    
    // Emoji list for floating animation
    const emojis = ['❤️', '💖', '💕', '😊', '😍', '🥰', '🌸', '🌺', '🌷', '💐', '🎀', '🧁', '🍰', '🎂', '🍭', '🍬', '🦋', '🐇', '🐰', '💝'];
    
    // Create floating emojis
    function createFloatingEmojis() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createFloatingEmoji();
            }, i * 400);
        }
        
        // Continue creating emojis
        setInterval(createFloatingEmoji, 1000);
    }
    
    function createFloatingEmoji() {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.fontSize = (Math.random() * 25 + 18) + 'px';
        
        // Random animation duration and delay
        const duration = Math.random() * 8 + 4;
        const delay = Math.random() * 2;
        
        emoji.style.animation = `floatUp ${duration}s linear ${delay}s forwards`;
        
        floatingEmojis.appendChild(emoji);
        
        // Remove emoji after animation completes
        setTimeout(() => {
            if (emoji.parentNode) {
                emoji.remove();
            }
        }, (duration + delay) * 1000);
    }
    
    // Fade in all elements in screen1-container saat halaman dimuat
    function fadeInScreenElements() {
        // Set semua elemen ke opacity 0 dan posisi bawah
        const allElements = screenContainer.querySelectorAll('*');
        
        // Set initial state untuk semua elemen
        allElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.95)';
            element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            element.style.transitionDelay = `${(index * 0.08) + 0.3}s`; // Staggered delay
        });
        
        // Set initial state untuk container
        screenContainer.style.opacity = '0';
        screenContainer.style.transform = 'scale(0.95)';
        screenContainer.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s';
        
        // Set initial state untuk watermark
        if (screenWatermark) {
            screenWatermark.style.opacity = '0';
            screenWatermark.style.transition = 'opacity 0.6s ease 1.2s';
        }
        
        // Set initial state untuk floating emojis
        floatingEmojis.style.opacity = '0';
        floatingEmojis.style.transition = 'opacity 1s ease 0.5s';
        
        // Trigger fade in dengan timeout
        setTimeout(() => {
            // Animate in semua elemen
            allElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            });
            
            // Animate in container
            screenContainer.style.opacity = '1';
            screenContainer.style.transform = 'scale(1)';
            
            // Animate in watermark
            if (screenWatermark) {
                screenWatermark.style.opacity = '0.9';
            }
            
            // Animate in floating emojis
            floatingEmojis.style.opacity = '1';
        }, 100);
    }
    
    // Fade out all elements in screen1-container
    function fadeOutScreenElements() {
        // Get all elements inside screen1-container
        const allElements = screenContainer.querySelectorAll('*');
        
        // Add fade-out animation to each element with staggered delay
        allElements.forEach((element, index) => {
            element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transitionDelay = `${index * 0.05}s`;
            element.style.opacity = '0';
            element.style.transform = 'translateY(-20px) scale(0.95)';
        });
        
        // Also fade out the container itself
        screenContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s';
        screenContainer.style.opacity = '0';
        screenContainer.style.transform = 'scale(0.9) translateY(30px)';
        
        // Fade out watermark
        if (screenWatermark) {
            screenWatermark.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s';
            screenWatermark.style.opacity = '0';
        }
        
        // Fade out floating emojis background
        floatingEmojis.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
        floatingEmojis.style.opacity = '0';
        
        // Return promise to know when animation completes
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }
    
    // Button click handler
    async function handleButtonClick() {
        // Play click sound
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Sound play failed'));
        }
        
        // Disable button to prevent multiple clicks
        clickMeBtn.disabled = true;
        clickMeBtn.style.pointerEvents = 'none';
        
        // Add click effect
        clickMeBtn.style.animation = 'none';
        clickMeBtn.style.transform = 'scale(0.95)';
        
        // Create burst effect dengan warna palette
        createClickBurst();
        
        // Fade out all screen elements
        await fadeOutScreenElements();
        
        // Navigate to next screen after fade out completes
        setTimeout(() => {
            window.location.href = 'screen2.html';
        }, 300);
    }
    
    // Create particle burst on click
    function createClickBurst() {
        const rect = clickMeBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const colors = ['#FEEAC9', '#FFCDC9', '#FDACAC', '#FD7979'];
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            particle.innerHTML = '❤️';
            
            // Random position around button
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 60 + 40;
            
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
            particle.style.zIndex = '9999';
            particle.style.pointerEvents = 'none';
            particle.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(particle);
            
            // Animate particle
            const animation = particle.animate([
                {
                    transform: `translate(0, 0) scale(1) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0) rotate(${Math.random() * 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            animation.onfinish = () => particle.remove();
        }
    }
    
    // Add CSS for burst particles and animations
    const burstStyle = document.createElement('style');
    burstStyle.textContent = `
        .burst-particle {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            filter: drop-shadow(0 0 5px rgba(253, 121, 121, 0.5));
        }
        
        /* Animation for fade in */
        @keyframes fadeInUp {
            0% {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Animation for fade out */
        @keyframes fadeOutUp {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
        }
        
        /* Animation for container fade in */
        @keyframes containerFadeIn {
            0% {
                opacity: 0;
                transform: scale(0.95);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        /* Animation for container fade out */
        @keyframes containerFadeOut {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(0.9) translateY(30px);
            }
        }
    `;
    document.head.appendChild(burstStyle);
    
    // Initialize
    function init() {
        // Start floating emojis
        createFloatingEmojis();
        
        // Add fade in animation saat halaman dimuat
        fadeInScreenElements();
        
        // Add event listeners
        clickMeBtn.addEventListener('click', handleButtonClick);
        
        // Add hover effect
        clickMeBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        clickMeBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Touch device support
        clickMeBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
        });
        
        clickMeBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
        });
        
        // REMOVED AUTO-CLICK TIMEOUT
        // Tidak ada timeout untuk auto-click
    }
    
    // Start everything
    init();
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            handleButtonClick();
        }
    });
});
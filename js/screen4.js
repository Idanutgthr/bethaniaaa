// CONFIGURATION FOR SCREEN 4
const SCREEN4_CONFIG = {
    messages: [
        "Halooo Bethaaa Gimanaa udah liatt memories kitaa kannn",
        "Gimanaaa lucu lucu kannn?",
        "Iyalahhh Lucu Kan Ada Kamunyaaa Hehe",
        "Aku mau ngomong sesuatu nihhh",
        "Tapi jangan kaget yaaa",
        "Rasanya nyaman ya deket kamuu tuuu",
        "Setiap ngobrol sama kamu tuh rasanya beda",
        "Kayaa jadi lebih asikk gituu",
        "Kayanya emang ini yang namanya jatuh cintaa yaa",
        "Hmmmm",
        "Aku jadi pengen kenal kamuu lebih dalemm",
        "Soooooo"
    ],
    currentMessageIndex: 0,
    totalMessages: 12,
    isTransitioning: false,
    floatingEmojis: [],
    noButtonClickCount: 0,
    maxNoButtonClicks: 100,
    isProposalShown: false
};

// Initialize Screen 4
document.addEventListener('DOMContentLoaded', function() {
    console.log('💌 Screen 4 - Special Message Initialized');
    
    // Elements
    const messageBox = document.getElementById('message-box');
    const progressDots = document.getElementById('progress-dots');
    const progressText = document.getElementById('progress-text');
    const nextMessageBtn = document.getElementById('next-message-btn');
    const navSection = document.querySelector('.navigation-section');
    const proposalSection = document.getElementById('proposal-section');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const celebrationSection = document.getElementById('celebration-section');
    const messageSound = document.getElementById('messageSound');
    const celebrationSound = document.getElementById('celebrationSound');
    const floatingEmojisContainer = document.getElementById('floating-emojis');
    
    // Elements yang akan di-hide sebelum proposal
    const headerSection = document.querySelector('.header-section');
    const messageContainer = document.querySelector('.message-container');
    const mainContent = document.querySelector('.main-content');
    
    // Initialize
    createFloatingEmojis();
    setupMessageDots();
    updateProgress();
    
    // Event Listeners
    nextMessageBtn.addEventListener('click', showNextMessage);
    yesBtn.addEventListener('click', handleYesClick);
    noBtn.addEventListener('click', handleNoClick);
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
            if (!proposalSection.classList.contains('show')) {
                showNextMessage();
            }
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Update button positions jika perlu
            if (SCREEN4_CONFIG.noButtonClickCount > 0) {
                moveNoButtonWithinBounds();
            }
        }, 250);
    });
    
    // Initialize message content
    setupMessageContent();
    
    // ============================================
    // FUNCTIONS
    // ============================================
    
    // Setup message content dynamically
    function setupMessageContent() {
        messageBox.innerHTML = '';
        
        SCREEN4_CONFIG.messages.forEach((message, index) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-content';
            messageDiv.dataset.index = index;
            messageDiv.innerHTML = `<p class="message-text">${message}</p>`;
            
            if (index === 0) {
                messageDiv.classList.add('active');
            }
            
            messageBox.appendChild(messageDiv);
        });
    }
    
    // Setup progress dots
    function setupMessageDots() {
        progressDots.innerHTML = '';
        
        // Untuk mobile, batasi jumlah dots yang ditampilkan
        const maxVisibleDots = window.innerWidth < 480 ? 6 : SCREEN4_CONFIG.totalMessages;
        const startIndex = Math.max(0, SCREEN4_CONFIG.currentMessageIndex - Math.floor(maxVisibleDots/2));
        const endIndex = Math.min(SCREEN4_CONFIG.totalMessages, startIndex + maxVisibleDots);
        
        for (let i = 0; i < SCREEN4_CONFIG.totalMessages; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === SCREEN4_CONFIG.currentMessageIndex) {
                dot.classList.add('active');
            }
            
            // Untuk mobile, sembunyikan dots yang tidak perlu
            if (window.innerWidth < 480 && (i < startIndex || i >= endIndex)) {
                dot.style.display = 'none';
            }
            
            progressDots.appendChild(dot);
        }
    }
    
    // Update progress indicator
    function updateProgress() {
        // Update dots
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            if (index === SCREEN4_CONFIG.currentMessageIndex) {
                dot.classList.add('active');
                dot.style.display = 'block';
            } else {
                dot.classList.remove('active');
                // Untuk mobile, sembunyikan dots yang jauh dari current
                if (window.innerWidth < 480) {
                    const diff = Math.abs(index - SCREEN4_CONFIG.currentMessageIndex);
                    if (diff > 3) {
                        dot.style.display = 'none';
                    } else {
                        dot.style.display = 'block';
                    }
                }
            }
        });
        
        // Update text
        if (progressText) {
            progressText.textContent = `Pesan ${SCREEN4_CONFIG.currentMessageIndex + 1} of ${SCREEN4_CONFIG.totalMessages}`;
        }
    }
    
    // Show next message
    function showNextMessage() {
        if (SCREEN4_CONFIG.isTransitioning) return;
        
        SCREEN4_CONFIG.isTransitioning = true;
        
        // Disable button during transition
        nextMessageBtn.disabled = true;
        nextMessageBtn.style.cursor = 'wait';
        
        // Play sound
        if (messageSound) {
            messageSound.currentTime = 0;
            messageSound.volume = 0.3;
            messageSound.play().catch(e => console.log('Message sound failed'));
        }
        
        // Get current and next message elements
        const currentMsg = document.querySelector(`.message-content[data-index="${SCREEN4_CONFIG.currentMessageIndex}"]`);
        const nextIndex = SCREEN4_CONFIG.currentMessageIndex + 1;
        
        // Jika ini adalah pesan terakhir (Soooooo)
        if (nextIndex >= SCREEN4_CONFIG.totalMessages) {
            console.log('Ini adalah pesan terakhir, membersihkan elemen...');
            
            // 1. Fade out semua elemen lama dengan animasi
            fadeOutOldElements();
            
            // 2. Tunggu animasi selesai, lalu show proposal section
            setTimeout(() => {
                // Hide semua elemen lama
                hideOldElements();
                
                // Show proposal section
                if (proposalSection) {
                    proposalSection.classList.add('show');
                    SCREEN4_CONFIG.isProposalShown = true;
                    
                    // Add floating hearts animation
                    createFloatingHearts();
                }
                
                // Reset transition flag
                SCREEN4_CONFIG.isTransitioning = false;
                nextMessageBtn.disabled = false;
                nextMessageBtn.style.cursor = 'pointer';
            }, 800);
            
            return;
        }
        
        // Normal message transition
        if (currentMsg) {
            // Fade out current message
            currentMsg.style.opacity = '0';
            currentMsg.style.transform = 'translateY(-20px)';
            currentMsg.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                currentMsg.classList.remove('active');
                
                // Show next message
                const nextMsg = document.querySelector(`.message-content[data-index="${nextIndex}"]`);
                if (nextMsg) {
                    nextMsg.classList.add('active');
                    nextMsg.style.opacity = '1';
                    nextMsg.style.transform = 'translateY(0)';
                    
                    // Update current index
                    SCREEN4_CONFIG.currentMessageIndex = nextIndex;
                    updateProgress();
                    
                    // Reset transition flag
                    setTimeout(() => {
                        SCREEN4_CONFIG.isTransitioning = false;
                        nextMessageBtn.disabled = false;
                        nextMessageBtn.style.cursor = 'pointer';
                    }, 300);
                }
            }, 800);
        }
    }
    
    // Fade out semua elemen lama sebelum proposal
    function fadeOutOldElements() {
        const elementsToFade = [
            headerSection,
            messageContainer,
            navSection
        ];
        
        elementsToFade.forEach(element => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px) scale(0.95)';
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    }
    
    // Hide semua elemen lama
    function hideOldElements() {
        const elementsToHide = [
            headerSection,
            messageContainer,
            navSection
        ];
        
        elementsToHide.forEach(element => {
            if (element) {
                element.classList.add('hidden');
                element.style.display = 'none';
            }
        });
    }
    
    // Handle YES button click
    function handleYesClick() {
        if (SCREEN4_CONFIG.isTransitioning) return;
        
        SCREEN4_CONFIG.isTransitioning = true;
        
        // Play celebration sound
        if (celebrationSound) {
            celebrationSound.currentTime = 0;
            celebrationSound.volume = 0.5;
            celebrationSound.play().catch(e => console.log('Celebration sound failed'));
        }
        
        // Hide proposal section dengan animasi
        proposalSection.style.opacity = '0';
        proposalSection.style.transform = 'translate(-50%, -50%) scale(0.9)';
        proposalSection.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Show celebration section setelah delay
        setTimeout(() => {
            proposalSection.classList.remove('show');
            
            // Show celebration section
            celebrationSection.classList.add('show');
            
            // Create confetti effect
            createConfetti();
            
            // Reset transition flag
            setTimeout(() => {
                SCREEN4_CONFIG.isTransitioning = false;
            }, 500);
        }, 800);
    }
    
    // Handle NO button click - DENGAN BATASAN AREA YANG RESPONSIF
    function handleNoClick() {
        SCREEN4_CONFIG.noButtonClickCount++;
        
        // Pindahkan tombol NO dalam batasan yang wajar
        moveNoButtonWithinBounds();
        
        // Jika diklik terlalu banyak kali, force YES
        if (SCREEN4_CONFIG.noButtonClickCount >= SCREEN4_CONFIG.maxNoButtonClicks) {
            // Auto-click YES button
            setTimeout(() => {
                yesBtn.click();
            }, 500);
            
            // Show message
            showTemporaryMessage("Okay, I'll choose for you! 💖");
        } else {
            // Show encouragement message
            const messages = [
                "Are you sure? 😢",
                "Please say yes! 🥺",
                "Think again! 💖",
                "I'll keep asking! 😊",
                "One more chance? 🥰"
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showTemporaryMessage(randomMessage);
        }
    }
    
    // Move NO button dalam batasan yang responsif
    function moveNoButtonWithinBounds() {
        const proposalContent = document.querySelector('.proposal-content');
        
        if (!proposalContent) return;
        
        // Dapatkan dimensi container proposal
        const containerRect = proposalContent.getBoundingClientRect();
        const buttonRect = noBtn.getBoundingClientRect();
        
        // Hitung batas maksimal berdasarkan ukuran container
        const maxX = containerRect.width - buttonRect.width - 20;
        const maxY = containerRect.height - buttonRect.height - 20;
        
        // Batas minimal
        const minX = 10;
        const minY = 10;
        
        // Pastikan batasan valid
        if (maxX <= minX || maxY <= minY) {
            // Jika container terlalu kecil, jangan pindahkan
            return;
        }
        
        // Generate random position dalam batasan
        const randomX = Math.random() * (maxX - minX) + minX;
        const randomY = Math.random() * (maxY - minY) + minY;
        
        // Apply new position dengan animation
        noBtn.style.position = 'absolute';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        noBtn.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // Add shake animation
        noBtn.classList.add('shake');
        setTimeout(() => {
            noBtn.classList.remove('shake');
        }, 500);
    }
    
    // Show temporary message
    function showTemporaryMessage(message) {
        const tempMsg = document.createElement('div');
        tempMsg.className = 'temporary-message';
        tempMsg.textContent = message;
        tempMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: clamp(12px, 3vw, 18px) clamp(20px, 5vw, 30px);
            border-radius: clamp(20px, 5vw, 30px);
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
            font-size: clamp(1rem, 3vw, 1.3rem);
            text-align: center;
            max-width: 80%;
            backdrop-filter: blur(10px);
            white-space: nowrap;
        `;
        
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            tempMsg.remove();
        }, 2000);
    }
    
    // Create floating hearts for proposal section
    function createFloatingHearts() {
        const hearts = ['❤️', '💖', '💕', '💗', '💓', '💘'];
        const heartCount = window.innerWidth < 768 ? 10 : 15;
        
        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.cssText = `
                    position: fixed;
                    font-size: clamp(1.5rem, 4vw, 2.5rem);
                    z-index: 5;
                    pointer-events: none;
                    left: ${Math.random() * 100}vw;
                    top: 100vh;
                    animation: floatHeartUp ${Math.random() * 3 + 2}s ease-in forwards;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 5000);
            }, i * 200);
        }
    }
    
    // Create confetti effect
    function createConfetti() {
        const confettiCount = window.innerWidth < 768 ? 70 : 100;
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#FF8BA0', '#A8E6CF'];
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.cssText = `
                    position: fixed;
                    width: clamp(8px, 2vw, 12px);
                    height: clamp(8px, 2vw, 12px);
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -20px;
                    left: ${Math.random() * 100}vw;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    z-index: 9998;
                    pointer-events: none;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                
                document.body.appendChild(confetti);
                
                // Animate confetti
                const animation = confetti.animate([
                    {
                        transform: `translateY(0) rotate(0deg)`,
                        opacity: 1
                    },
                    {
                        transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: Math.random() * 3000 + 2000,
                    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
                });
                
                animation.onfinish = () => confetti.remove();
            }, i * 20);
        }
    }
    
    // Create floating emojis
    function createFloatingEmojis() {
        const emojis = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌟', '💫', '🌸', '💌', '💘', '🥰', '😍', '💝'];
        const initialCount = window.innerWidth < 768 ? 15 : 20;
        const intervalTime = window.innerWidth < 768 ? 2000 : 1500;
        
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => {
                createFloatingEmoji();
            }, i * 200);
        }
        
        setInterval(createFloatingEmoji, intervalTime);
        
        function createFloatingEmoji() {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + 'vw';
            emoji.style.fontSize = (Math.random() * 25 + 20) + 'px';
            
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 3;
            
            emoji.style.animation = `floatUp ${duration}s linear ${delay}s forwards`;
            
            floatingEmojisContainer.appendChild(emoji);
            SCREEN4_CONFIG.floatingEmojis.push(emoji);
            
            setTimeout(() => {
                if (emoji.parentNode) {
                    emoji.remove();
                    const index = SCREEN4_CONFIG.floatingEmojis.indexOf(emoji);
                    if (index > -1) {
                        SCREEN4_CONFIG.floatingEmojis.splice(index, 1);
                    }
                }
            }, (duration + delay) * 1000);
        }
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatHeartUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .no-btn.shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes glowSweep {
            0% { background-position: -200% 0%; }
            100% { background-position: 200% 0%; }
        }
    `;
    document.head.appendChild(style);
});
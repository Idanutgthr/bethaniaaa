// Configuration untuk Screen 2
const SCREEN2_CONFIG = {
    chatFiles: [],
    currentChatIndex: 0,
    totalChats: 0,
    chatSound: null,
    isTransitioning: false,
    floatingEmojis: [],
    chatQueue: [],
    isChatCompleted: false,
    isCharactersInitialized: false,
    // Responsive settings
    responsive: {
        characterSpacing: 0.4, // 40% dari viewport width antara karakter
        isMobile: window.innerWidth <= 768,
        isSmallMobile: window.innerWidth <= 480
    },
    idleAnimations: {
        characters: {
            minAmplitude: 5,
            maxAmplitude: 15,
            minDuration: 2.5,
            maxDuration: 4,
            minDelay: 0,
            maxDelay: 1
        },
        chatBubbles: {
            minAmplitude: 2,
            maxAmplitude: 8,
            minDuration: 3,
            maxDuration: 5,
            minDelay: 0,
            maxDelay: 2
        }
    }
};

// Initialize Screen 2
document.addEventListener('DOMContentLoaded', function() {
    console.log('Screen 2 Initialized 💬 - Responsive Mode');
    
    // Update responsive settings
    SCREEN2_CONFIG.responsive.isMobile = window.innerWidth <= 768;
    SCREEN2_CONFIG.responsive.isSmallMobile = window.innerWidth <= 480;
    
    // Elements
    const chatSound = document.getElementById('chatSound');
    const chatContainer = document.querySelector('.chat-container');
    const charactersSection = document.querySelector('.characters-section');
    const letsGoSection = document.querySelector('.lets-go-section');
    const chatInstruction = document.querySelector('.chat-instruction');
    const floatingEmojisContainer = document.getElementById('floating-emojis');
    const letsGoBtn = document.querySelector('.lets-go-btn');
    const screenContainer = document.querySelector('.screen2-container');
    const gradientBackground = document.querySelector('.gradient-background');
    const screenWatermark = document.querySelector('.screen-watermark');
    
    // Set config
    SCREEN2_CONFIG.chatSound = chatSound;
    
    // Inisialisasi karakter dengan posisi responsif
    initializeCharactersResponsive();
    
    // Nonaktifkan Let's Go Button awal
    if (letsGoBtn) {
        letsGoBtn.style.pointerEvents = 'none';
        letsGoBtn.style.opacity = '0.5';
        letsGoBtn.style.cursor = 'not-allowed';
    }
    
    // Start floating emojis
    createFloatingEmojis();
    
    // Detect available chat images
    detectChatImages();
    
    // Setup chat container
    setupChatContainer();
    
    // Animasi karakter masuk setelah delay
    setTimeout(() => {
        animateCharactersEntryResponsive();
    }, 300);
    
    // Event Listeners
    document.addEventListener('click', handleScreenClick);
    document.addEventListener('touchstart', handleScreenClick);
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
            handleScreenClick();
        }
    });
    
    // Initialize first chat setelah delay
    setTimeout(() => {
        showNextChat();
    }, 1800);
    
    // Resize handler untuk responsive adjustments
    window.addEventListener('resize', handleResize);
    
    // ⚠️ FUNCTION UNTUK INISIALISASI KARAKTER RESPONSIF
    function initializeCharactersResponsive() {
        const bethaChar = document.querySelector('.betha-character');
        const wildanChar = document.querySelector('.wildan-character');
        const spacing = SCREEN2_CONFIG.responsive.characterSpacing;
        
        if (bethaChar) {
            // Hitung posisi berdasarkan viewport
            const viewportWidth = window.innerWidth;
            let offset = viewportWidth * (spacing / 2);
            
            // Adjust untuk mobile
            if (SCREEN2_CONFIG.responsive.isMobile) {
                offset = viewportWidth * (spacing * 0.35);
            }
            
            if (SCREEN2_CONFIG.responsive.isSmallMobile) {
                offset = viewportWidth * (spacing * 0.3);
            }
            
            // Reset posisi awal
            bethaChar.style.opacity = '0';
            bethaChar.style.transform = `translateX(-${offset}px) translateY(20px) scale(0.9)`;
            bethaChar.style.transition = 'none';
            
            // Set left position secara dinamis
            bethaChar.style.left = `calc(50% - ${offset}px)`;
        }
        
        if (wildanChar) {
            const viewportWidth = window.innerWidth;
            let offset = viewportWidth * (spacing / 2);
            
            if (SCREEN2_CONFIG.responsive.isMobile) {
                offset = viewportWidth * (spacing * 0.35);
            }
            
            if (SCREEN2_CONFIG.responsive.isSmallMobile) {
                offset = viewportWidth * (spacing * 0.3);
            }
            
            wildanChar.style.opacity = '0';
            wildanChar.style.transform = `translateX(${offset}px) translateY(20px) scale(0.9)`;
            wildanChar.style.transition = 'none';
            
            wildanChar.style.right = `calc(50% - ${offset}px)`;
        }
    }
    
    // ⚠️ FUNCTION ANIMASI MASUK KARAKTER RESPONSIF
    function animateCharactersEntryResponsive() {
        const bethaChar = document.querySelector('.betha-character');
        const wildanChar = document.querySelector('.wildan-character');
        
        if (bethaChar) {
            // Reset CSS animation
            bethaChar.style.animation = 'none';
            void bethaChar.offsetWidth;
            
            // Apply transition dengan timing yang responsif
            const transitionTime = SCREEN2_CONFIG.responsive.isSmallMobile ? '0.8s' : '1.2s';
            bethaChar.style.transition = `all ${transitionTime} cubic-bezier(0.34, 1.56, 0.64, 1)`;
            
            // Animate masuk
            setTimeout(() => {
                bethaChar.style.opacity = '1';
                bethaChar.style.transform = 'translateX(0) translateY(0) scale(1)';
                
                // Tambahkan animasi idle
                setTimeout(() => {
                    applyCharacterIdleAnimation(bethaChar, 'betha');
                    bethaChar.style.transition = 'none';
                }, parseInt(transitionTime) * 1000);
            }, 100);
        }
        
        if (wildanChar) {
            // Wildan masuk dengan delay yang responsif
            const delay = SCREEN2_CONFIG.responsive.isSmallMobile ? 300 : 500;
            
            setTimeout(() => {
                wildanChar.style.animation = 'none';
                void wildanChar.offsetWidth;
                
                const transitionTime = SCREEN2_CONFIG.responsive.isSmallMobile ? '0.8s' : '1.2s';
                wildanChar.style.transition = `all ${transitionTime} cubic-bezier(0.34, 1.56, 0.64, 1)`;
                
                setTimeout(() => {
                    wildanChar.style.opacity = '1';
                    wildanChar.style.transform = 'translateX(0) translateY(0) scale(1)';
                    
                    setTimeout(() => {
                        applyCharacterIdleAnimation(wildanChar, 'wildan');
                        wildanChar.style.transition = 'none';
                        
                        // Set flag karakter sudah siap
                        SCREEN2_CONFIG.isCharactersInitialized = true;
                    }, parseInt(transitionTime) * 1000);
                }, 100);
            }, delay);
        }
    }
    
    // ⚠️ FUNCTION UNTUK ANIMASI IDLE KARAKTER (TIDAK BERUBAH)
    function applyCharacterIdleAnimation(characterElement, characterName) {
        const config = SCREEN2_CONFIG.idleAnimations.characters;
        
        // Adjust amplitude untuk mobile
        let amplitude = (characterName === 'betha') ? 
            config.minAmplitude + Math.random() * (config.maxAmplitude - config.minAmplitude) :
            config.minAmplitude + Math.random() * (config.maxAmplitude - config.minAmplitude);
        
        if (SCREEN2_CONFIG.responsive.isSmallMobile) {
            amplitude *= 0.7; // Kurangi amplitude di mobile kecil
        }
        
        const duration = config.minDuration + Math.random() * (config.maxDuration - config.minDuration);
        const delay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
        
        // Hapus animasi sebelumnya jika ada
        characterElement.style.animation = 'none';
        void characterElement.offsetWidth;
        
        // Terapkan animasi idle baru
        const animationName = `idleFloat_${characterName}_${Date.now()}`;
        
        // Buat keyframes dinamis
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ${animationName} {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                25% {
                    transform: translateY(-${amplitude * 0.7}px) rotate(-0.5deg);
                }
                50% {
                    transform: translateY(-${amplitude}px) rotate(0deg);
                }
                75% {
                    transform: translateY(-${amplitude * 0.7}px) rotate(0.5deg);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Terapkan animasi
        characterElement.style.animation = `${animationName} ${duration}s ease-in-out ${delay}s infinite`;
        
        // Simpan style element untuk dibersihkan nanti
        if (!characterElement.idleStyle) {
            characterElement.idleStyle = style;
        } else {
            characterElement.idleStyle.remove();
            characterElement.idleStyle = style;
        }
    }
    
    // ⚠️ FUNCTION UNTUK ANIMASI IDLE CHAT BUBBLE RESPONSIF
    function applyChatBubbleIdleAnimation(chatBubble, index) {
        const config = SCREEN2_CONFIG.idleAnimations.chatBubbles;
        
        // Adjust untuk mobile
        let amplitude = config.minAmplitude + Math.random() * (config.maxAmplitude - config.minAmplitude);
        if (SCREEN2_CONFIG.responsive.isSmallMobile) {
            amplitude *= 0.6;
        } else if (SCREEN2_CONFIG.responsive.isMobile) {
            amplitude *= 0.8;
        }
        
        const duration = config.minDuration + Math.random() * (config.maxDuration - config.minDuration);
        const delay = index * 0.3;
        
        // Buat animasi unik untuk chat bubble ini
        const animationName = `chatIdle_${index}_${Date.now()}`;
        
        // Buat keyframes dinamis
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ${animationName} {
                0%, 100% {
                    transform: translateY(0) scale(1);
                }
                25% {
                    transform: translateY(-${amplitude * 0.5}px) scale(1.002);
                }
                50% {
                    transform: translateY(-${amplitude}px) scale(1.005);
                }
                75% {
                    transform: translateY(-${amplitude * 0.5}px) scale(1.002);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Terapkan animasi pada chat bubble
        chatBubble.style.animation = `${animationName} ${duration}s ease-in-out ${delay}s infinite`;
        
        // Simpan style element untuk dibersihkan nanti
        if (!chatBubble.idleStyle) {
            chatBubble.idleStyle = style;
        } else {
            chatBubble.idleStyle.remove();
            chatBubble.idleStyle = style;
        }
    }
    
    // Function untuk membuat floating emojis
    function createFloatingEmojis() {
        const emojis = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌟', '💫', '🌸', '💌'];
        
        // Jumlah emoji berdasarkan ukuran layar
        const emojiCount = SCREEN2_CONFIG.responsive.isSmallMobile ? 10 : 15;
        
        for (let i = 0; i < emojiCount; i++) {
            setTimeout(() => {
                createFloatingEmoji();
            }, i * 300);
        }
        
        setInterval(createFloatingEmoji, 1200);
        
        function createFloatingEmoji() {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + 'vw';
            emoji.style.fontSize = (Math.random() * 15 + 10) + 'px';
            
            const duration = Math.random() * 6 + 3;
            const delay = Math.random() * 2;
            
            emoji.style.animation = `floatUp ${duration}s linear ${delay}s forwards`;
            
            floatingEmojisContainer.appendChild(emoji);
            SCREEN2_CONFIG.floatingEmojis.push(emoji);
            
            setTimeout(() => {
                if (emoji.parentNode) {
                    emoji.remove();
                    const index = SCREEN2_CONFIG.floatingEmojis.indexOf(emoji);
                    if (index > -1) {
                        SCREEN2_CONFIG.floatingEmojis.splice(index, 1);
                    }
                }
            }, (duration + delay) * 1000);
        }
    }
    
    function detectChatImages() {
        const maxChats = 8;
        const chatFiles = [];
        
        for (let i = 1; i <= maxChats; i++) {
            const filename = `chat${i}.png`;
            chatFiles.push(filename);
        }
        
        SCREEN2_CONFIG.chatFiles = chatFiles;
        SCREEN2_CONFIG.totalChats = chatFiles.length;
        
        console.log(`Detected ${SCREEN2_CONFIG.totalChats} chat images`);
    }
    
    function setupChatContainer() {
        chatContainer.innerHTML = '';
        
        SCREEN2_CONFIG.chatFiles.forEach((filename, index) => {
            const isYou = (index % 2 === 0);
            const chatMessage = createChatMessage(filename, isYou, index);
            chatContainer.appendChild(chatMessage);
        });
    }
    
    function createChatMessage(filename, isYou, index) {
        const chatDiv = document.createElement('div');
        chatDiv.className = `chat-message ${isYou ? 'you' : 'betha'}`;
        chatDiv.dataset.index = index;
        
        const profilePhoto = isYou ? 'wildan_profile.png' : 'betha_profile.png';
        
        chatDiv.innerHTML = `
            ${!isYou ? `
                <div class="profile-photo">
                    <img src="assets/profile_photos/${profilePhoto}" alt="${isYou ? 'Wildan' : 'Betha'}" 
                         onerror="this.style.display='none'; this.parentElement.innerHTML='👤'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center';">'
                </div>
            ` : ''}
            
            <div class="chat-bubble">
                <img src="assets/chats/${filename}" alt="Chat ${index + 1}" class="chat-image"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='💬 Chat ${index + 1}'; this.parentElement.style.color='white';">'
            </div>
            
            ${isYou ? `
                <div class="profile-photo">
                    <img src="assets/profile_photos/${profilePhoto}" alt="${isYou ? 'Wildan' : 'Betha'}"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='👤'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center';">'
                </div>
            ` : ''}
        `;
        
        // Tambahkan animasi idle untuk chat bubble
        const chatBubble = chatDiv.querySelector('.chat-bubble');
        if (chatBubble) {
            setTimeout(() => {
                applyChatBubbleIdleAnimation(chatBubble, index);
            }, 100);
        }
        
        return chatDiv;
    }
    
    function handleScreenClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (SCREEN2_CONFIG.isChatCompleted) {
            return;
        }
        
        if (SCREEN2_CONFIG.isTransitioning) return;
        
        if (SCREEN2_CONFIG.chatSound) {
            SCREEN2_CONFIG.chatSound.currentTime = 0;
            SCREEN2_CONFIG.chatSound.volume = 0.2;
            SCREEN2_CONFIG.chatSound.play().catch(err => console.log('Sound play failed'));
        }
        
        showNextChat();
    }
    
    function showNextChat() {
        if (SCREEN2_CONFIG.isTransitioning) return;
        
        const currentIndex = SCREEN2_CONFIG.currentChatIndex;
        const totalChats = SCREEN2_CONFIG.totalChats;
        
        if (currentIndex >= totalChats) {
            endChatSequence();
            return;
        }
        
        SCREEN2_CONFIG.isTransitioning = true;
        
        if (currentIndex > 0) {
            const prevChat = document.querySelector(`.chat-message[data-index="${currentIndex - 1}"]`);
            if (prevChat && prevChat.classList.contains('active')) {
                const isPrevYou = (currentIndex - 1) % 2 === 0;
                prevChat.classList.add(isPrevYou ? 'slide-out' : 'slide-out');
                
                setTimeout(() => {
                    prevChat.classList.remove('active', 'slide-out');
                    prevChat.style.display = 'none';
                    showNewChat(currentIndex);
                }, 800);
            } else {
                showNewChat(currentIndex);
            }
        } else {
            showNewChat(currentIndex);
        }
    }
    
    function showNewChat(index) {
        const nextChat = document.querySelector(`.chat-message[data-index="${index}"]`);
        if (nextChat) {
            nextChat.style.display = 'flex';
            nextChat.classList.remove('slide-in', 'slide-out');
            
            setTimeout(() => {
                nextChat.classList.add('slide-in');
                
                setTimeout(() => {
                    nextChat.classList.add('active');
                    SCREEN2_CONFIG.currentChatIndex = index + 1;
                    
                    setTimeout(() => {
                        SCREEN2_CONFIG.isTransitioning = false;
                        
                        const activeChatBubble = nextChat.querySelector('.chat-bubble');
                        if (activeChatBubble) {
                            activeChatBubble.style.animation = 'none';
                            void activeChatBubble.offsetWidth;
                            applyChatBubbleIdleAnimation(activeChatBubble, index);
                        }
                    }, 300);
                }, 50);
            }, 10);
        } else {
            SCREEN2_CONFIG.isTransitioning = false;
            endChatSequence();
        }
    }
    
    function endChatSequence() {
        console.log('All chats displayed, showing Let\'s Go button');
        
        SCREEN2_CONFIG.isChatCompleted = true;
        document.removeEventListener('click', handleScreenClick);
        document.removeEventListener('touchstart', handleScreenClick);
        
        fadeOutAllElements();
    }
    
    // ⚠️ FUNCTION UNTUK FADE OUT SEMUA ELEMEN
    function fadeOutAllElements() {
        createFadeOutParticles();
        
        screenContainer.style.transition = 'all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        screenContainer.style.filter = 'blur(10px)';
        screenContainer.style.transform = 'scale(0.95)';
        
        if (chatInstruction) {
            chatInstruction.style.transition = 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            chatInstruction.style.opacity = '0';
            chatInstruction.style.transform = 'translateY(-40px) scale(1.2)';
            
            setTimeout(() => {
                chatInstruction.style.display = 'none';
            }, 900);
        }
        
        chatContainer.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        chatContainer.style.opacity = '0';
        chatContainer.style.transform = 'translateY(60px) rotate(5deg) scale(0.9)';
        
        animateCharactersExit();
        
        floatingEmojisContainer.style.transition = 'all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        floatingEmojisContainer.style.opacity = '0';
        floatingEmojisContainer.style.transform = 'scale(1.5)';
        
        gradientBackground.style.transition = 'all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        gradientBackground.style.opacity = '0.5';
        gradientBackground.style.filter = 'blur(20px)';
        
        setTimeout(() => {
            chatContainer.style.display = 'none';
            floatingEmojisContainer.style.display = 'none';
            
            screenContainer.style.filter = 'blur(0)';
            screenContainer.style.transform = 'scale(1)';
            screenContainer.style.transition = 'all 0.8s ease 0.3s';
            
            gradientBackground.style.opacity = '1';
            gradientBackground.style.filter = 'blur(0)';
            gradientBackground.style.transition = 'all 0.8s ease 0.3s';
            
            if (letsGoSection) {
                letsGoSection.style.opacity = '0';
                letsGoSection.style.transform = 'translate(-50%, -50%) scale(0.8)';
                letsGoSection.style.display = 'flex';
                letsGoSection.style.transition = 'all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s';
                
                setTimeout(() => {
                    letsGoSection.classList.add('show');
                    letsGoSection.style.opacity = '1';
                    letsGoSection.style.transform = 'translate(-50%, -50%) scale(1)';
                    
                }, 50);
            }
            
            if (letsGoBtn) {
                setTimeout(() => {
                    letsGoBtn.style.pointerEvents = 'auto';
                    letsGoBtn.style.opacity = '1';
                    letsGoBtn.style.cursor = 'pointer';
                    letsGoBtn.style.animation = 'buttonEntrance 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                    letsGoBtn.addEventListener('click', goToScreen3);
                }, 1500);
            }
        }, 1200);
    }
    
    // ⚠️ FUNCTION UNTUK MEMBUAT PARTIKEL FADE OUT
    function createFadeOutParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'fade-out-particles';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '9999';
        document.body.appendChild(particlesContainer);
        
        const emojis = ['✨', '🌟', '💫', '🌸', '💖', '💕', '💗', '💓', '❤️', '💌'];
        const colors = ['#FF6B8B', '#FF8E53', '#FFCE53', '#6BFF8E', '#53B3FF', '#8E53FF'];
        
        const particleCount = SCREEN2_CONFIG.responsive.isSmallMobile ? 20 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'fade-particle';
                particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                particle.style.position = 'absolute';
                particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
                particle.style.color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.top = Math.random() * 100 + 'vh';
                particle.style.opacity = '0.8';
                particle.style.filter = 'drop-shadow(0 0 10px currentColor)';
                
                particlesContainer.appendChild(particle);
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 200;
                const duration = 0.8 + Math.random() * 0.5;
                
                particle.style.transition = `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                    particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.2)`;
                }, 10);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, duration * 1000 + 100);
            }, i * 30);
        }
        
        setTimeout(() => {
            if (particlesContainer.parentNode) {
                particlesContainer.remove();
            }
        }, 2000);
    }
    
    // ⚠️ FUNCTION ANIMASI KARAKTER KELUAR
    function animateCharactersExit() {
        const bethaChar = document.querySelector('.betha-character');
        const wildanChar = document.querySelector('.wildan-character');
        
        if (bethaChar) {
            bethaChar.style.animation = 'none';
            bethaChar.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                bethaChar.style.opacity = '0';
                bethaChar.style.transform = 'translateY(-80px) translateX(-50px) rotate(-15deg) scale(1.2)';
                bethaChar.style.filter = 'blur(10px)';
            }, 100);
        }
        
        if (wildanChar) {
            setTimeout(() => {
                wildanChar.style.animation = 'none';
                wildanChar.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                
                setTimeout(() => {
                    wildanChar.style.opacity = '0';
                    wildanChar.style.transform = 'translateY(-80px) translateX(50px) rotate(15deg) scale(1.2)';
                    wildanChar.style.filter = 'blur(10px)';
                }, 100);
            }, 300);
        }
    }
    
    // ⚠️ FUNCTION UNTUK ANIMASI LET'S GO SECTION FADE OUT
    function animateLetsGoSectionFadeOut() {
        console.log('Animating Let\'s Go section fade out');
        
        screenContainer.style.animation = 'none';
        letsGoSection.style.animation = 'none';
        letsGoBtn.style.animation = 'none';
        
        createTransitionParticles();
        
        letsGoBtn.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        letsGoBtn.style.transform = 'scale(1.5) rotate(360deg)';
        letsGoBtn.style.opacity = '0';
        letsGoBtn.style.filter = 'blur(20px)';
        
        const titleContainer = document.querySelector('.title-container');
        if (titleContainer) {
            titleContainer.style.transition = 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s';
            titleContainer.style.transform = 'translateY(-100px) rotateX(90deg)';
            titleContainer.style.opacity = '0';
        }
        
        letsGoSection.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        letsGoSection.style.transform = 'translate(-50%, -50%) scale(1.5)';
        letsGoSection.style.opacity = '0';
        letsGoSection.style.filter = 'blur(30px)';
        
        gradientBackground.style.transition = 'all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        gradientBackground.style.opacity = '0';
        gradientBackground.style.filter = 'blur(50px) brightness(2)';
        
        screenWatermark.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s';
        screenWatermark.style.opacity = '0';
        screenWatermark.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            window.location.href = 'screen3.html';
        }, 1500);
    }
    
    // ⚠️ FUNCTION UNTUK MEMBUAT PARTIKEL TRANSISI
    function createTransitionParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'transition-particles';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '10000';
        document.body.appendChild(particlesContainer);
        
        const emojis = ['✨', '🌟', '💫', '🎉', '🎊', '🎈', '💖', '❤️', '💕', '💗'];
        const colors = ['#FF6B8B', '#FF8E53', '#FFCE53', '#6BFF8E', '#53B3FF', '#8E53FF', '#FF53B3', '#53FFCE'];
        
        const particleCount = SCREEN2_CONFIG.responsive.isSmallMobile ? 30 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'transition-particle';
                particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                particle.style.position = 'absolute';
                particle.style.fontSize = (Math.random() * 25 + 15) + 'px';
                particle.style.color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.left = '50%';
                particle.style.top = '50%';
                particle.style.opacity = '1';
                particle.style.transform = 'translate(-50%, -50%) scale(0)';
                particle.style.filter = 'drop-shadow(0 0 15px currentColor)';
                particle.style.zIndex = '10001';
                
                particlesContainer.appendChild(particle);
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 200 + Math.random() * 400;
                const duration = 1 + Math.random() * 0.5;
                const delay = Math.random() * 0.3;
                
                particle.style.transition = `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${delay}s`;
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                    particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.1) rotate(${angle * 180/Math.PI}deg)`;
                }, 50);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, (duration + delay) * 1000 + 100);
            }, i * 20);
        }
        
        setTimeout(() => {
            if (particlesContainer.parentNode) {
                particlesContainer.remove();
            }
        }, 2500);
    }
    
    // Function to go to screen 3
    window.goToScreen3 = function() {
        if (!SCREEN2_CONFIG.isChatCompleted || SCREEN2_CONFIG.isTransitioning) {
            console.log('Cannot go to screen 3 yet. Chat not completed or transitioning.');
            return;
        }
        
        SCREEN2_CONFIG.isTransitioning = true;
        animateLetsGoSectionFadeOut();
    };
    
    if (letsGoBtn) {
        letsGoBtn.addEventListener('click', function(e) {
            if (!SCREEN2_CONFIG.isChatCompleted) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Let\'s Go button is disabled during chat sequence');
                return false;
            }
        });
    }
    
    // ⚠️ RESIZE HANDLER UNTUK RESPONSIVE ADJUSTMENTS
    function handleResize() {
        // Update responsive settings
        SCREEN2_CONFIG.responsive.isMobile = window.innerWidth <= 768;
        SCREEN2_CONFIG.responsive.isSmallMobile = window.innerWidth <= 480;
        
        // Jika karakter sudah terinisialisasi, update posisi mereka
        if (SCREEN2_CONFIG.isCharactersInitialized) {
            const bethaChar = document.querySelector('.betha-character');
            const wildanChar = document.querySelector('.wildan-character');
            const spacing = SCREEN2_CONFIG.responsive.characterSpacing;
            
            if (bethaChar) {
                const viewportWidth = window.innerWidth;
                let offset = viewportWidth * (spacing / 2);
                
                if (SCREEN2_CONFIG.responsive.isMobile) {
                    offset = viewportWidth * (spacing * 0.35);
                }
                
                if (SCREEN2_CONFIG.responsive.isSmallMobile) {
                    offset = viewportWidth * (spacing * 0.3);
                }
                
                bethaChar.style.left = `calc(50% - ${offset}px)`;
            }
            
            if (wildanChar) {
                const viewportWidth = window.innerWidth;
                let offset = viewportWidth * (spacing / 2);
                
                if (SCREEN2_CONFIG.responsive.isMobile) {
                    offset = viewportWidth * (spacing * 0.35);
                }
                
                if (SCREEN2_CONFIG.responsive.isSmallMobile) {
                    offset = viewportWidth * (spacing * 0.3);
                }
                
                wildanChar.style.right = `calc(50% - ${offset}px)`;
            }
        }
    }
});
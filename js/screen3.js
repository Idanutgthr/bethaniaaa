// CONFIGURATION FOR SCREEN 3 - ENHANCED RESPONSIVE
const SCREEN3_CONFIG = {
    photos: [],
    videos: [],
    mediaItems: [],
    currentIndex: 0,
    totalItems: 0,
    isTransitioning: false,
    floatingEmojis: [],
    isGalleryCompleted: false,
    animationTypes: [
        'slide-in-left', 'slide-in-right', 'slide-in-up',
        'bounce-in', 'zoom-in', 'rotate-in'
    ],
    frameTypes: ['type-1', 'type-2', 'type-3', 'type-4', 'type-5'],
    
    // Responsive settings
    responsiveSettings: {
        frameSize: 400,
        isMobile: false,
        isLandscape: false,
        isTouchDevice: false
    }
};

// Initialize Screen 3
document.addEventListener('DOMContentLoaded', function() {
    console.log('📸 Screen 3 - Memory Gallery Initialized');
    
    // Detect device type
    detectDeviceType();
    
    // Elements
    const galleryContainer = document.querySelector('.gallery-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const totalItemsSpan = document.getElementById('total-items');
    const endSection = document.getElementById('end-section');
    const endButton = document.getElementById('end-button');
    const photoSound = document.getElementById('photoSound');
    const videoSound = document.getElementById('videoSound');
    const floatingEmojisContainer = document.getElementById('floating-emojis');
    
    // Navigation Button Elements
    const nextMemoryBtn = document.getElementById('next-memory-btn');
    const navSection = document.getElementById('nav-section');
    
    // Initialize
    initGallery();
    createFloatingEmojis();
    setupResponsiveEvents();
    
    // Event Listener for Next Button ONLY
    nextMemoryBtn.addEventListener('click', handleNextClick);
    
    // Touch support for mobile
    if (SCREEN3_CONFIG.responsiveSettings.isTouchDevice) {
        document.addEventListener('touchstart', function(e) {
            // Prevent default touch behavior
            if (e.touches.length === 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Double tap prevention
        let lastTap = 0;
        document.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0) {
                e.preventDefault();
            }
            
            lastTap = currentTime;
        });
    }
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
            e.preventDefault();
            handleNextClick();
        }
    });
    
    // End Button Click
    endButton.addEventListener('click', goToScreen4);
    
    // Safety check after initialization
    setTimeout(() => {
        ensureButtonVisible();
        adjustForScreenSize();
    }, 1000);
    
    // ============================================
    // RESPONSIVE FUNCTIONS
    // ============================================
    
    function detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        SCREEN3_CONFIG.responsiveSettings.isTouchDevice = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
        
        SCREEN3_CONFIG.responsiveSettings.isMobile = window.innerWidth <= 768;
        SCREEN3_CONFIG.responsiveSettings.isLandscape = window.innerWidth > window.innerHeight;
        
        // Adjust frame size based on screen
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        if (screenWidth <= 480) {
            SCREEN3_CONFIG.responsiveSettings.frameSize = Math.min(280, screenWidth * 0.85, (screenHeight - 150) * 0.7);
        } else if (screenWidth <= 768) {
            SCREEN3_CONFIG.responsiveSettings.frameSize = Math.min(350, screenWidth * 0.75, (screenHeight - 200) * 0.7);
        } else if (screenWidth <= 1024) {
            SCREEN3_CONFIG.responsiveSettings.frameSize = Math.min(380, screenWidth * 0.65, (screenHeight - 250) * 0.6);
        } else {
            SCREEN3_CONFIG.responsiveSettings.frameSize = Math.min(400, screenWidth * 0.5, (screenHeight - 300) * 0.5);
        }
        
        console.log(`📱 Device detected: Mobile=${SCREEN3_CONFIG.responsiveSettings.isMobile}, Touch=${SCREEN3_CONFIG.responsiveSettings.isTouchDevice}, FrameSize=${SCREEN3_CONFIG.responsiveSettings.frameSize}px`);
    }
    
    function setupResponsiveEvents() {
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                detectDeviceType();
                adjustForScreenSize();
                updateMediaItemPositions();
            }, 250);
        });
        
        // Orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                detectDeviceType();
                adjustForScreenSize();
                updateMediaItemPositions();
                ensureButtonVisible();
            }, 500);
        });
    }
    
    function adjustForScreenSize() {
        // Adjust button text for mobile
        if (SCREEN3_CONFIG.responsiveSettings.isMobile) {
            const btnText = document.querySelector('.btn-text');
            if (btnText && window.innerWidth < 400) {
                btnText.textContent = 'Next Memory';
            }
        }
        
        // Adjust gallery container height for landscape
        if (SCREEN3_CONFIG.responsiveSettings.isLandscape && window.innerHeight < 500) {
            const gallery = document.querySelector('.gallery-container');
            if (gallery) {
                gallery.style.minHeight = `${Math.min(350, window.innerHeight * 0.6)}px`;
            }
            
            // Adjust button position
            if (navSection) {
                navSection.style.bottom = `${Math.max(50, window.innerHeight * 0.12)}px`;
            }
        }
        
        // Adjust caption position for very small screens
        if (window.innerHeight < 600) {
            const captions = document.querySelectorAll('.media-caption');
            captions.forEach(caption => {
                caption.style.bottom = `${Math.max(-35, window.innerHeight * -0.08)}px`;
                caption.style.fontSize = `${Math.max(12, window.innerHeight * 0.02)}px`;
            });
        }
    }
    
    function updateMediaItemPositions() {
        const mediaItems = document.querySelectorAll('.media-item');
        mediaItems.forEach(item => {
            if (item.classList.contains('active')) {
                // Ensure active item is centered
                item.style.top = '50%';
                item.style.left = '50%';
                item.style.transform = 'translate(-50%, -50%)';
            }
        });
    }
    
    // ============================================
    // CORE FUNCTIONS
    // ============================================
    
    // Function to ensure button is always visible
    function ensureButtonVisible() {
        if (nextMemoryBtn && navSection) {
            // Force show button
            nextMemoryBtn.style.display = 'inline-flex';
            nextMemoryBtn.style.visibility = 'visible';
            nextMemoryBtn.style.opacity = '1';
            nextMemoryBtn.disabled = false;
            nextMemoryBtn.style.cursor = 'pointer';
            nextMemoryBtn.style.pointerEvents = 'auto';
            
            navSection.style.display = 'flex';
            navSection.style.visibility = 'visible';
            navSection.style.opacity = '1';
            navSection.style.pointerEvents = 'auto';
            
            // Adjust for mobile touch
            if (SCREEN3_CONFIG.responsiveSettings.isTouchDevice) {
                nextMemoryBtn.style.touchAction = 'manipulation';
                nextMemoryBtn.style.WebkitTapHighlightColor = 'transparent';
            }
            
            console.log('✅ Button visibility ensured');
        }
    }
    
    // Handle Next Button Click
    function handleNextClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('🔄 Next button clicked');
        }
        
        // Ensure button is visible before processing
        ensureButtonVisible();
        
        if (SCREEN3_CONFIG.isGalleryCompleted || SCREEN3_CONFIG.isTransitioning) {
            console.log('⏸️ Cannot proceed: Gallery completed or transitioning');
            return;
        }
        
        if (SCREEN3_CONFIG.isTransitioning) {
            console.log('⏸️ Already transitioning, please wait');
            return;
        }
        
        // Check if this is the last item
        const isLastItem = (SCREEN3_CONFIG.currentIndex >= SCREEN3_CONFIG.totalItems - 1);
        
        if (isLastItem) {
            console.log('🎬 This is the last item, completing gallery');
            completeGallery();
            return;
        }
        
        // Stop video if currently playing
        const currentMedia = document.querySelector('.media-item.active');
        if (currentMedia) {
            const video = currentMedia.querySelector('video');
            if (video && !video.paused) {
                video.pause();
                video.currentTime = 0;
                console.log('⏸️ Video stopped before next memory');
            }
        }
        
        // Play sound effect
        const currentFilename = SCREEN3_CONFIG.mediaItems[SCREEN3_CONFIG.currentIndex];
        const isPhoto = currentFilename && currentFilename.startsWith('foto');
        
        if (isPhoto && photoSound) {
            photoSound.currentTime = 0;
            photoSound.volume = 0.3;
            photoSound.play().catch(e => console.log('Photo sound failed'));
        } else if (!isPhoto && videoSound) {
            videoSound.currentTime = 0;
            videoSound.volume = 0.3;
            videoSound.play().catch(e => console.log('Video sound failed'));
        }
        
        showNextMedia();
    }
    
    // Initialize Gallery
    function initGallery() {
        detectMediaFiles();
        setupGallery();
        updateProgress();
        
        // Show first media item after delay
        setTimeout(() => {
            showMediaItem(0);
        }, 800);
    }
    
    // Detect available media files
    async function detectMediaFiles() {
        const maxPhotos = 10;
        const maxVideos = 7;
        
        // Detect photos
        SCREEN3_CONFIG.photos = [];
        for (let i = 1; i <= maxPhotos; i++) {
            SCREEN3_CONFIG.photos.push(`foto${i}.png`);
        }
        
        // Detect videos  
        SCREEN3_CONFIG.videos = [];
        for (let i = 1; i <= maxVideos; i++) {
            SCREEN3_CONFIG.videos.push(`video${i}.mp4`);
        }
        
        // Combine all media items (photos first, then videos)
        SCREEN3_CONFIG.mediaItems = [
            ...SCREEN3_CONFIG.photos,
            ...SCREEN3_CONFIG.videos
        ];
        
        SCREEN3_CONFIG.totalItems = SCREEN3_CONFIG.mediaItems.length;
        totalItemsSpan.textContent = SCREEN3_CONFIG.totalItems;
        
        console.log(`📸 Detected: ${SCREEN3_CONFIG.photos.length} photos`);
        console.log(`🎥 Detected: ${SCREEN3_CONFIG.videos.length} videos`);
        console.log(`📊 Total media: ${SCREEN3_CONFIG.totalItems}`);
        
        // If no media found
        if (SCREEN3_CONFIG.totalItems === 0) {
            console.warn('⚠️ No media files found!');
            showNoMediaMessage();
            return false;
        }
        
        return true;
    }
    
    // Show message if no media found
    function showNoMediaMessage() {
        const galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;
        
        galleryContainer.innerHTML = `
            <div class="no-media-message" style="
                text-align: center;
                padding: 40px 20px;
                color: var(--color-white);
                max-width: 500px;
                margin: 0 auto;
            ">
                <i class="fas fa-images" style="
                    font-size: clamp(3rem, 8vw, 4rem);
                    margin-bottom: 20px;
                    color: var(--color-white);
                    opacity: 0.7;
                "></i>
                <h3 style="
                    color: var(--color-white);
                    margin-bottom: 15px;
                    font-size: clamp(1.2rem, 4vw, 1.5rem);
                ">No Memories Found</h3>
                <p style="
                    color: var(--color-white);
                    opacity: 0.8;
                    margin-bottom: 25px;
                    font-size: clamp(0.9rem, 3vw, 1.1rem);
                ">Please add photos or videos to the assets folder.</p>
                <button onclick="goToScreen4()" style="
                    margin-top: 20px;
                    padding: clamp(10px, 2vw, 12px) clamp(25px, 4vw, 30px);
                    background: var(--color-pink-medium);
                    border: none;
                    border-radius: 25px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
                ">
                    Continue to Next Screen
                </button>
            </div>
        `;
    }
    
    // Setup gallery container with media items
    function setupGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;
        
        galleryContainer.innerHTML = '';
        
        // Prevent clicks on gallery container
        galleryContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        SCREEN3_CONFIG.mediaItems.forEach((filename, index) => {
            const mediaItem = createMediaItem(filename, index);
            galleryContainer.appendChild(mediaItem);
        });
    }
    
    // Create media item element
    function createMediaItem(filename, index) {
        const isPhoto = filename.startsWith('foto');
        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'media-item';
        mediaDiv.dataset.index = index;
        mediaDiv.dataset.filename = filename;
        mediaDiv.dataset.type = isPhoto ? 'photo' : 'video';
        
        // Random frame type
        const frameType = SCREEN3_CONFIG.frameTypes[
            Math.floor(Math.random() * SCREEN3_CONFIG.frameTypes.length)
        ];
        
        if (isPhoto) {
            mediaDiv.innerHTML = `
                <div class="photo-frame ${frameType}">
                    <div class="photo-content">
                        <img src="assets/photos/${filename}" alt="Memory ${index + 1}" 
                             onerror="this.style.display='none'; this.parentElement.innerHTML='📸 Photo ${index + 1}'; this.parentElement.style.color='white'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center';">
                    </div>
                    <div class="media-caption">
                        <i class="fas fa-camera"></i> Memory ${index + 1}
                    </div>
                </div>
            `;
        } else {
            mediaDiv.innerHTML = `
                <div class="photo-frame ${frameType}">
                    <div class="video-content">
                        <video preload="metadata" playsinline webkit-playsinline>
                            <source src="assets/videos/${filename}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div class="video-controls">
                            <button class="play-btn" title="Play/Pause">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="volume-btn" title="Volume">
                                <i class="fas fa-volume-up"></i>
                            </button>
                            <button class="fullscreen-btn" title="Fullscreen">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                    <div class="media-caption">
                        <i class="fas fa-video"></i> Video Memory ${index + 1}
                    </div>
                </div>
            `;
        }
        
        // Add video controls if video
        if (!isPhoto) {
            setTimeout(() => {
                setupVideoControls(mediaDiv);
            }, 100);
        }
        
        return mediaDiv;
    }
    
    // Setup video controls
    function setupVideoControls(mediaDiv) {
        const video = mediaDiv.querySelector('video');
        const playBtn = mediaDiv.querySelector('.play-btn');
        const volumeBtn = mediaDiv.querySelector('.volume-btn');
        const fullscreenBtn = mediaDiv.querySelector('.fullscreen-btn');
        
        if (video && playBtn) {
            // Play/Pause
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (video.paused) {
                    video.play();
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
            
            // Video events
            video.addEventListener('play', () => {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
            
            video.addEventListener('pause', () => {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            video.addEventListener('ended', () => {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
        }
        
        if (video && volumeBtn) {
            // Volume toggle
            let isMuted = false;
            volumeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                isMuted = !isMuted;
                video.muted = isMuted;
                volumeBtn.innerHTML = isMuted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
            });
        }
        
        if (video && fullscreenBtn) {
            // Fullscreen toggle
            fullscreenBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!document.fullscreenElement) {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    } else if (video.mozRequestFullScreen) {
                        video.mozRequestFullScreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }
                }
            });
        }
    }
    
    // Show next media item
    function showNextMedia() {
        if (SCREEN3_CONFIG.isTransitioning) return;
        
        const currentIndex = SCREEN3_CONFIG.currentIndex;
        const totalItems = SCREEN3_CONFIG.totalItems;
        
        // Disable button during transition
        if (nextMemoryBtn) {
            nextMemoryBtn.disabled = true;
            nextMemoryBtn.style.cursor = 'wait';
            nextMemoryBtn.style.opacity = '0.7';
        }
        
        // If all media items shown
        if (currentIndex >= totalItems - 1) {
            console.log('📌 Last item reached, showing end section');
            setTimeout(() => {
                completeGallery();
            }, 500);
            return;
        }
        
        SCREEN3_CONFIG.isTransitioning = true;
        
        // Hide current media
        const currentMedia = document.querySelector(`.media-item[data-index="${currentIndex}"]`);
        if (currentMedia && currentMedia.classList.contains('active')) {
            // Stop video before exit animation
            const video = currentMedia.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            
            const exitAnimations = ['slide-out-left', 'slide-out-right', 'slide-out-up'];
            const exitAnimation = exitAnimations[
                Math.floor(Math.random() * exitAnimations.length)
            ];
            
            currentMedia.classList.add(exitAnimation);
            
            setTimeout(() => {
                currentMedia.classList.remove('active', exitAnimation);
                currentMedia.style.display = 'none';
                
                // Show next media
                showMediaItem(currentIndex + 1);
            }, 800);
        } else {
            // Directly show next if current not active
            showMediaItem(currentIndex + 1);
        }
    }
    
    // Show specific media item
    function showMediaItem(index) {
        const mediaItem = document.querySelector(`.media-item[data-index="${index}"]`);
        if (mediaItem) {
            mediaItem.style.display = 'flex';
            mediaItem.classList.remove(...SCREEN3_CONFIG.animationTypes);
            
            // Pause all other videos
            document.querySelectorAll('video').forEach(video => {
                if (!video.paused) {
                    video.pause();
                    video.currentTime = 0;
                }
            });
            
            // Random entrance animation
            const animationType = SCREEN3_CONFIG.animationTypes[
                Math.floor(Math.random() * SCREEN3_CONFIG.animationTypes.length)
            ];
            
            setTimeout(() => {
                mediaItem.classList.add(animationType);
                
                setTimeout(() => {
                    mediaItem.classList.add('active');
                    
                    // Update progress
                    SCREEN3_CONFIG.currentIndex = index;
                    updateProgress();
                    
                    // Re-enable next button
                    setTimeout(() => {
                        SCREEN3_CONFIG.isTransitioning = false;
                        if (nextMemoryBtn) {
                            nextMemoryBtn.disabled = false;
                            nextMemoryBtn.style.cursor = 'pointer';
                            nextMemoryBtn.style.opacity = '1';
                        }
                        
                        // Ensure button is visible
                        if (navSection) {
                            navSection.style.display = 'flex';
                            navSection.style.opacity = '1';
                            navSection.style.visibility = 'visible';
                        }
                    }, 300);
                }, 50);
            }, 10);
            
            // Auto-play video if it's a video
            const video = mediaItem.querySelector('video');
            if (video) {
                // Remove previous ended listener if exists
                video.removeEventListener('ended', handleVideoEnded);
                
                // Add new ended listener
                video.addEventListener('ended', handleVideoEnded);
                
                function handleVideoEnded() {
                    console.log('🎬 Video ended, checking if this is the last item');
                    
                    // Check if this is the last item
                    const isLastItem = (index === SCREEN3_CONFIG.totalItems - 1);
                    
                    if (isLastItem) {
                        console.log('📌 This is the LAST video, showing end button in 3 seconds');
                        
                        // Wait 3 seconds then show end section
                        setTimeout(() => {
                            if (!SCREEN3_CONFIG.isGalleryCompleted && !SCREEN3_CONFIG.isTransitioning) {
                                console.log('🔄 Auto-showing end section after last video');
                                completeGallery();
                            }
                        }, 3000);
                    } else {
                        console.log('⏭️ Not the last item, auto-show next in 2 seconds');
                        
                        // For non-last videos: auto next
                        setTimeout(() => {
                            if (!SCREEN3_CONFIG.isTransitioning && !SCREEN3_CONFIG.isGalleryCompleted) {
                                // Ensure button is still visible
                                ensureButtonVisible();
                                handleNextClick();
                            }
                        }, 2000);
                    }
                }
                
                // Auto-play after delay
                setTimeout(() => {
                    const playPromise = video.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log('Video autoplay prevented:', error.name);
                            
                            // Show play button if autoplay blocked
                            const playBtn = mediaItem.querySelector('.play-btn');
                            if (playBtn) {
                                playBtn.style.display = 'flex';
                                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                            }
                        });
                    }
                }, 500);
            } else {
                // If not a video, ensure button is visible
                ensureButtonVisible();
            }
        } else {
            SCREEN3_CONFIG.isTransitioning = false;
            if (nextMemoryBtn) {
                nextMemoryBtn.disabled = false;
                nextMemoryBtn.style.cursor = 'pointer';
                nextMemoryBtn.style.opacity = '1';
            }
            completeGallery();
        }
    }
    
    // Update progress indicator
    function updateProgress() {
        const progress = ((SCREEN3_CONFIG.currentIndex + 1) / SCREEN3_CONFIG.totalItems) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.innerHTML = `Memory <strong>${SCREEN3_CONFIG.currentIndex + 1}</strong> of <span id="total-items">${SCREEN3_CONFIG.totalItems}</span>`;
        }
    }
    
    // Complete gallery and show end section
    function completeGallery() {
        if (SCREEN3_CONFIG.isGalleryCompleted) {
            console.log('⚠️ Gallery already completed');
            return;
        }
        
        console.log('🎉 Gallery completed, showing end section');
        
        SCREEN3_CONFIG.isGalleryCompleted = true;
        SCREEN3_CONFIG.isTransitioning = true;
        
        // Disable next button but don't hide it immediately
        if (nextMemoryBtn) {
            nextMemoryBtn.disabled = true;
            nextMemoryBtn.style.cursor = 'not-allowed';
            nextMemoryBtn.style.opacity = '0.5';
        }
        
        if (navSection) {
            // Animate fade out for next button
            navSection.style.opacity = '0';
            navSection.style.transform = 'translateY(20px)';
            navSection.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Hide after animation
            setTimeout(() => {
                navSection.style.display = 'none';
            }, 800);
        }
        
        // Remove event listeners
        if (nextMemoryBtn) {
            const newNextBtn = nextMemoryBtn.cloneNode(true);
            nextMemoryBtn.parentNode.replaceChild(newNextBtn, nextMemoryBtn);
        }
        
        // Stop all playing videos
        document.querySelectorAll('video').forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        
        // Hide gallery with fade out
        const gallery = document.querySelector('.gallery-container');
        const header = document.querySelector('.header-section');
        
        if (gallery) {
            gallery.style.opacity = '0';
            gallery.style.transform = 'translateY(50px) scale(0.95)';
            gallery.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-50px)';
            header.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        // Show end section after delay
        setTimeout(() => {
            if (gallery) gallery.style.display = 'none';
            if (header) header.style.display = 'none';
            
            if (endSection) {
                endSection.classList.add('show');
                
                // Ensure end button is clickable
                setTimeout(() => {
                    const endBtn = document.getElementById('end-button');
                    if (endBtn) {
                        endBtn.style.pointerEvents = 'auto';
                        endBtn.style.cursor = 'pointer';
                        endBtn.disabled = false;
                        
                        // Add touch support for mobile
                        if (SCREEN3_CONFIG.responsiveSettings.isTouchDevice) {
                            endBtn.style.touchAction = 'manipulation';
                        }
                    }
                }, 500);
                
                // Add confetti effect
                createConfetti();
            }
            
            // Reset transition flag
            setTimeout(() => {
                SCREEN3_CONFIG.isTransitioning = false;
            }, 1000);
        }, 1000);
    }
    
    // Create floating emojis
    function createFloatingEmojis() {
        const floatingEmojisContainer = document.getElementById('floating-emojis');
        if (!floatingEmojisContainer) return;
        
        const emojis = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌟', '💫', '🌸', '📸', '🎥', '🎬', '💌'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createFloatingEmoji();
            }, i * 200);
        }
        
        setInterval(createFloatingEmoji, 1500);
        
        function createFloatingEmoji() {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + 'vw';
            
            // Responsive font size
            const fontSize = Math.random() * 20 + 15;
            emoji.style.fontSize = `${Math.min(fontSize, window.innerWidth * 0.05)}px`;
            
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 3;
            
            emoji.style.animation = `floatUp ${duration}s linear ${delay}s forwards`;
            
            floatingEmojisContainer.appendChild(emoji);
            SCREEN3_CONFIG.floatingEmojis.push(emoji);
            
            setTimeout(() => {
                if (emoji.parentNode) {
                    emoji.remove();
                    const index = SCREEN3_CONFIG.floatingEmojis.indexOf(emoji);
                    if (index > -1) {
                        SCREEN3_CONFIG.floatingEmojis.splice(index, 1);
                    }
                }
            }, (duration + delay) * 1000);
        }
    }
    
    // Create confetti effect
    function createConfetti() {
        const confettiCount = 50;
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -20px;
                left: ${Math.random() * 100}vw;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                z-index: 9998;
                pointer-events: none;
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
        }
    }
    
    // Go to screen 4
    function goToScreen4() {
        if (SCREEN3_CONFIG.isTransitioning) return;
        
        SCREEN3_CONFIG.isTransitioning = true;
        
        // Fade out effect
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.95)';
        document.body.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Navigate after delay
        setTimeout(() => {
            window.location.href = 'screen4.html';
        }, 800);
    }
    
    // Make functions globally available
    window.goToScreen4 = goToScreen4;
});

// ============================================
// FUNGSI UNTUK UPDATE POSISI GALLERY
// ============================================

function updateGalleryPosition() {
    const gallery = document.querySelector('.gallery-container');
    const mediaItems = document.querySelectorAll('.media-item');
    const header = document.querySelector('.header-section');
    
    if (!gallery) return;
    
    // Hitung posisi optimal berdasarkan tinggi layar
    const screenHeight = window.innerHeight;
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Atur tinggi gallery berdasarkan layar
    let galleryHeight;
    if (screenHeight <= 600) {
        galleryHeight = Math.min(350, screenHeight * 0.6);
    } else if (screenHeight <= 800) {
        galleryHeight = Math.min(400, screenHeight * 0.55);
    } else {
        galleryHeight = Math.min(450, screenHeight * 0.5);
    }
    
    gallery.style.minHeight = `${galleryHeight}px`;
    
    // Update semua media item position
    mediaItems.forEach(item => {
        // Sesuaikan top position berdasarkan device
        let topPosition = 45; // default 45%
        
        if (screenHeight <= 480) {
            topPosition = 43; // lebih tinggi di mobile kecil
        } else if (window.innerWidth > window.innerHeight && screenHeight <= 600) {
            topPosition = 42; // lebih tinggi di landscape
        } else if (screenHeight > 1000) {
            topPosition = 46; // sedikit lebih rendah di tablet besar
        }
        
        item.style.top = `${topPosition}%`;
        
        // Update transform untuk item aktif
        if (item.classList.contains('active')) {
            const transform = item.style.transform;
            if (transform.includes('translate(-50%, -50%)')) {
                item.style.transform = transform.replace('translate(-50%, -50%)', `translate(-50%, -${topPosition}%)`);
            } else if (transform.includes('translate(-50%, -45%)')) {
                item.style.transform = transform.replace('translate(-50%, -45%)', `translate(-50%, -${topPosition}%)`);
            }
        }
    });
    
    // Update button position
    updateButtonPosition();
}

function updateButtonPosition() {
    const navSection = document.getElementById('nav-section');
    const screenHeight = window.innerHeight;
    
    if (!navSection) return;
    
    // Hitung posisi button berdasarkan tinggi layar
    let bottomPosition;
    if (screenHeight <= 480) {
        bottomPosition = Math.max(40, screenHeight * 0.08); // 8% dari tinggi layar
    } else if (screenHeight <= 600) {
        bottomPosition = Math.max(45, screenHeight * 0.07); // 7% dari tinggi layar
    } else if (screenHeight <= 800) {
        bottomPosition = Math.max(50, screenHeight * 0.065); // 6.5% dari tinggi layar
    } else {
        bottomPosition = Math.max(60, screenHeight * 0.06); // 6% dari tinggi layar
    }
    
    navSection.style.bottom = `${bottomPosition}px`;
}

// Panggil fungsi update posisi saat resize dan orientation change
function setupPositionUpdates() {
    // Update posisi saat inisialisasi
    updateGalleryPosition();
    
    // Update posisi saat resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateGalleryPosition();
        }, 100);
    });
    
    // Update posisi saat orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            updateGalleryPosition();
        }, 300);
    });
    
    // Update posisi saat media item berubah
    const observer = new MutationObserver(() => {
        updateGalleryPosition();
    });
    
    const gallery = document.querySelector('.gallery-container');
    if (gallery) {
        observer.observe(gallery, { childList: true, subtree: true });
    }
}

// Tambahkan panggilan di DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... kode existing ...
    
    // Setup position updates
    setupPositionUpdates();
    
    // Initial position adjustment
    setTimeout(() => {
        updateGalleryPosition();
    }, 500);
    
    // ... kode existing ...
});
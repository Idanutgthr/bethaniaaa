// CONFIGURATION FOR SCREEN 3
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
    frameTypes: ['type-1', 'type-2', 'type-3', 'type-4', 'type-5']
};

// Initialize Screen 3
document.addEventListener('DOMContentLoaded', function() {
    console.log('📸 Screen 3 - Memory Gallery Initialized');
    
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
    
    // Navigation Button Elements - SEKARANG TOMBOL DI WATERMARK CONTAINER
    const nextMemoryBtn = document.getElementById('next-memory-btn');
    // Navigation section dihapus, tidak diperlukan lagi
    
    // Initialize
    initGallery();
    createFloatingEmojis();
    
    // Event Listener for Next Button ONLY
    nextMemoryBtn.addEventListener('click', handleNextClick);
    
    // Keyboard support (optional)
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
            handleNextClick();
        }
    });
    
    // End Button Click
    endButton.addEventListener('click', goToScreen4);
    
    // Safety check after initialization
    setTimeout(() => {
        ensureButtonVisible();
    }, 2000);
    
    // ============================================
    // FUNCTIONS
    // ============================================
    
    // Function to ensure button is always visible
    function ensureButtonVisible() {
        if (nextMemoryBtn) {
            nextMemoryBtn.style.display = 'inline-flex';
            nextMemoryBtn.style.visibility = 'visible';
            nextMemoryBtn.style.opacity = '1';
            nextMemoryBtn.disabled = false;
            nextMemoryBtn.style.cursor = 'pointer';
            
            console.log('✅ Button visibility ensured (dalam watermark container)');
        }
    }
    
    // Handle Next Button Click
    function handleNextClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔄 Next button clicked (dalam watermark container)');
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
        }, 1000);
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
        galleryContainer.innerHTML = `
            <div class="no-media-message">
                <i class="fas fa-images" style="font-size: 4rem; margin-bottom: 20px; color: var(--color-white); opacity: 0.7;"></i>
                <h3 style="color: var(--color-white); margin-bottom: 10px;">No Memories Found</h3>
                <p style="color: var(--color-white); opacity: 0.8;">Please add photos or videos to the assets folder.</p>
                <button onclick="goToScreen4()" style="margin-top: 20px; padding: 12px 30px; background: var(--color-pink-medium); border: none; border-radius: 25px; color: white; font-weight: bold; cursor: pointer;">
                    Continue to Next Screen
                </button>
            </div>
        `;
    }
    
    // Setup gallery container with media items
    function setupGallery() {
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
                        <video preload="metadata" controls>
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
        
        return mediaDiv;
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
                    video.play().catch(e => {
                        console.log('Video autoplay prevented:', e.name);
                        
                        // Show play button if autoplay blocked
                        const playBtn = mediaItem.querySelector('.play-btn');
                        if (playBtn) {
                            playBtn.style.display = 'flex';
                            playBtn.innerHTML = '<i class="fas fa-play"></i>';
                        }
                    });
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
        
        // Disable next button
        if (nextMemoryBtn) {
            nextMemoryBtn.disabled = true;
            nextMemoryBtn.style.cursor = 'not-allowed';
            nextMemoryBtn.style.opacity = '0.5';
        }
        
        // Remove event listeners
        if (nextMemoryBtn) {
            nextMemoryBtn.removeEventListener('click', handleNextClick);
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
        
        // Hide watermark container with button
        const watermarkContainer = document.querySelector('.screen-watermark');
        if (watermarkContainer) {
            watermarkContainer.style.opacity = '0';
            watermarkContainer.style.transform = 'translateY(20px)';
            watermarkContainer.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        // Show end section after delay
        setTimeout(() => {
            if (gallery) gallery.style.display = 'none';
            if (header) header.style.display = 'none';
            if (watermarkContainer) watermarkContainer.style.display = 'none';
            
            if (endSection) {
                endSection.classList.add('show');
                
                // Ensure end button is clickable
                setTimeout(() => {
                    const endBtn = document.getElementById('end-button');
                    if (endBtn) {
                        endBtn.style.pointerEvents = 'auto';
                        endBtn.style.cursor = 'pointer';
                        endBtn.disabled = false;
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
        const emojis = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌟', '💫', '🌸', '📸', '🎥', '🎬', '💌'];
        
        for (let i = 0; i < 20; i++) {
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
            emoji.style.fontSize = (Math.random() * 25 + 20) + 'px';
            
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
                width: 10px;
                height: 10px;
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
});
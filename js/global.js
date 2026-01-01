// FILE: js/global.js - SIMPLE VERSION WITH HORIZONTAL HINT
const SIMPLE_MUSIC = {
    songs: [
        { id: 1, name: 'Love Song 1', path: 'assets/audio/song1.mp3' },
        { id: 2, name: 'Love Song 2', path: 'assets/audio/song2.mp3' },
        { id: 3, name: 'Love Song 3', path: 'assets/audio/song3.mp3' }
    ],
    
    currentSongIndex: 0,
    audioPlayer: null,
    isPlaying: false, // Start as false to wait for user click
    isMuted: false,
    hasInitialized: false,
    controlButton: null,
    hintElement: null,
    
    // Initialize music player
    init: function() {
        // Cegah inisialisasi ganda
        if (this.hasInitialized) {
            console.log('🎵 Music Player already initialized');
            this.updateButton();
            return;
        }
        
        console.log('🎵 Simple Music Player Initialized');
        this.hasInitialized = true;
        
        // Create audio element
        this.audioPlayer = document.createElement('audio');
        this.audioPlayer.id = 'background-music';
        this.audioPlayer.loop = false;
        this.audioPlayer.preload = 'auto';
        this.audioPlayer.volume = 0.5; // Fixed volume 50%
        
        // Add to body
        document.body.appendChild(this.audioPlayer);
        
        // Create control button with hint
        this.createControlWithHint();
        
        // Load state from storage
        this.loadFromStorage();
        
        // Setup current song
        this.setupCurrentSong();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show initial hint
        this.showHint();
        
        // Don't auto play - wait for user click
    },
    
    // Create control button with horizontal hint
    createControlWithHint: function() {
        // Create container for button and hint
        const container = document.createElement('div');
        container.className = 'music-control-container';
        
        // Create hint text
        this.hintElement = document.createElement('div');
        this.hintElement.className = 'music-hint-text';
        this.hintElement.innerHTML = `
            <span class="hint-text">Click Anywhere To Play Music</span>
            <span class="hint-arrow">→</span>
        `;
        
        // Create control button
        this.controlButton = document.createElement('button');
        this.controlButton.className = 'music-control-btn';
        this.controlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        this.controlButton.title = 'Toggle Music (M)';
        
        // Add elements to container
        container.appendChild(this.hintElement);
        container.appendChild(this.controlButton);
        
        // Add to body
        document.body.appendChild(container);
        
        // Button click event
        this.controlButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute();
        });
        
        // Keyboard shortcut (M key)
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'm') {
                this.toggleMute();
                e.preventDefault();
            }
        });
        
        // Global click to start music (first interaction)
        const startMusicOnClick = () => {
            if (!this.isPlaying && !this.isMuted) {
                this.play();
                this.hideHint();
            }
            document.removeEventListener('click', startMusicOnClick);
        };
        
        document.addEventListener('click', startMusicOnClick);
    },
    
    // Show hint
    showHint: function() {
        if (!this.hintElement) return;
        
        // Only show if music hasn't started yet
        if (this.isPlaying || this.isMuted) {
            this.hideHint();
            return;
        }
        
        this.hintElement.classList.add('show');
        
        // Auto hide after 10 seconds
        setTimeout(() => {
            this.hideHint();
        }, 10000);
    },
    
    // Hide hint
    hideHint: function() {
        if (this.hintElement) {
            this.hintElement.classList.remove('show');
        }
    },
    
    // Setup current song based on saved state
    setupCurrentSong: function() {
        // Try to load from storage
        const savedState = this.getSavedState();
        
        if (savedState && savedState.currentSongIndex !== undefined) {
            // Continue from saved song
            this.currentSongIndex = savedState.currentSongIndex;
            const currentTime = savedState.currentTime || 0;
            
            console.log(`🎵 Continuing song ${this.currentSongIndex + 1} at ${Math.round(currentTime)}s`);
            
            // Load the song
            this.loadSong(this.currentSongIndex, currentTime);
            
            // Restore play state
            this.isPlaying = savedState.isPlaying;
            this.isMuted = savedState.isMuted;
        } else {
            // Start from first song
            this.currentSongIndex = 0;
            this.loadSong(0, 0);
            console.log('🎵 Starting from song 1');
        }
    },
    
    // Load specific song
    loadSong: function(index, startTime = 0) {
        // Ensure index is within bounds
        if (index < 0) index = 0;
        if (index >= this.songs.length) index = 0;
        
        this.currentSongIndex = index;
        const song = this.songs[index];
        
        // Set audio source
        this.audioPlayer.src = song.path;
        this.audioPlayer.currentTime = startTime;
        
        console.log(`🎵 Loaded: ${song.name} (starting at ${Math.round(startTime)}s)`);
    },
    
    // Play next song in sequence (1→2→3→1→...)
    playNextSong: function() {
        // Save current time before switching
        this.saveToStorage();
        
        // Move to next song
        this.currentSongIndex++;
        
        // Loop back to first song after last
        if (this.currentSongIndex >= this.songs.length) {
            this.currentSongIndex = 0;
        }
        
        // Load next song
        this.loadSong(this.currentSongIndex, 0);
        
        // Play if not muted
        if (this.isPlaying && !this.isMuted) {
            this.play();
        }
        
        // Save new state
        this.saveToStorage();
        
        console.log(`🎵 Next song: ${this.currentSongIndex + 1}`);
    },
    
    // Play music
    play: function() {
        if (this.audioPlayer && !this.isMuted) {
            const playPromise = this.audioPlayer.play();
            
            playPromise.catch(error => {
                console.log('Autoplay prevented:', error);
            });
            
            this.isPlaying = true;
            this.updateButton();
            this.hideHint();
            this.saveToStorage();
            
            console.log('🎵 Music started playing');
        }
    },
    
    // Pause music
    pause: function() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.isPlaying = false;
            this.updateButton();
            this.saveToStorage();
        }
    },
    
    // Toggle mute/unmute
    toggleMute: function() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
        
        // Button animation
        this.controlButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.controlButton.style.transform = '';
        }, 150);
    },
    
    // Mute audio
    mute: function() {
        this.isMuted = true;
        if (this.audioPlayer) {
            this.audioPlayer.volume = 0;
        }
        this.controlButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        this.controlButton.classList.add('muted');
        this.saveToStorage();
        console.log('🔇 Music muted');
    },
    
    // Unmute audio
    unmute: function() {
        this.isMuted = false;
        if (this.audioPlayer) {
            this.audioPlayer.volume = 0.5; // Fixed volume
        }
        this.controlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        this.controlButton.classList.remove('muted');
        
        // Resume playing if was playing
        if (this.isPlaying) {
            this.play();
        }
        
        this.saveToStorage();
        console.log('🔊 Music unmuted');
    },
    
    // Update button state
    updateButton: function() {
        if (!this.controlButton) return;
        
        if (this.isMuted) {
            this.controlButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.controlButton.classList.add('muted');
            this.controlButton.classList.remove('playing');
        } else {
            this.controlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.controlButton.classList.remove('muted');
            
            if (this.isPlaying) {
                this.controlButton.classList.add('playing');
            } else {
                this.controlButton.classList.remove('playing');
            }
        }
    },
    
    // Get saved state from localStorage
    getSavedState: function() {
        try {
            const saved = localStorage.getItem('simple_music_state');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Error reading saved state:', e);
            return null;
        }
    },
    
    // Save state to localStorage
    saveToStorage: function() {
        try {
            const state = {
                currentSongIndex: this.currentSongIndex,
                currentTime: this.audioPlayer ? this.audioPlayer.currentTime : 0,
                isPlaying: this.isPlaying,
                isMuted: this.isMuted,
                timestamp: Date.now()
            };
            
            localStorage.setItem('simple_music_state', JSON.stringify(state));
        } catch (e) {
            console.error('Error saving music state:', e);
        }
    },
    
    // Load state from localStorage
    loadFromStorage: function() {
        try {
            const saved = this.getSavedState();
            if (saved) {
                console.log('🎵 Loading saved music state');
                
                // Load state
                this.isPlaying = saved.isPlaying !== undefined ? saved.isPlaying : false;
                this.isMuted = saved.isMuted || false;
                
                // Update button
                this.updateButton();
                
                // Hide hint if already playing
                if (this.isPlaying) {
                    this.hideHint();
                }
            }
        } catch (e) {
            console.error('Error loading music state:', e);
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        if (!this.audioPlayer) return;
        
        // When song ends, play next
        this.audioPlayer.addEventListener('ended', () => {
            console.log('🎵 Song ended, playing next...');
            this.playNextSong();
        });
        
        // Auto-save every 3 seconds
        setInterval(() => {
            if (this.audioPlayer && !this.audioPlayer.paused) {
                this.saveToStorage();
            }
        }, 3000);
        
        // Save when leaving page
        window.addEventListener('beforeunload', () => {
            console.log('💾 Saving music state before page unload...');
            this.saveToStorage();
        });
        
        // Handle page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page hidden, save state
                this.saveToStorage();
            } else {
                // Page visible, try to resume
                if (this.isPlaying && !this.isMuted && this.audioPlayer.paused) {
                    this.audioPlayer.play().catch(e => {
                        console.log('Resume prevented:', e);
                    });
                }
            }
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded:', window.location.pathname);
    
    // Initialize music player
    SIMPLE_MUSIC.init();
});

// Handle page transitions
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        console.log('🔄 Page restored from cache');
        // Update button state
        SIMPLE_MUSIC.updateButton();
    }
});

// Export for debugging
window.SIMPLE_MUSIC = SIMPLE_MUSIC;
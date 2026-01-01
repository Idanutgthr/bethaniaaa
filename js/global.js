// FILE: js/global.js - REVISI (sequential loop)
const MUSIC_PLAYER = {
    songs: [
        { id: 1, name: 'Love Song 1', path: 'assets/audio/song1.mp3' },
        { id: 2, name: 'Love Song 2', path: 'assets/audio/song2.mp3' },
        { id: 3, name: 'Love Song 3', path: 'assets/audio/song3.mp3' }
    ],
    
    currentSong: null,
    audioPlayer: null,
    isPlaying: true,
    isMuted: false,
    volume: 0.5,
    controlButton: null,
    hasInitialized: false,
    currentTime: 0,
    currentSongIndex: 0, // Tambahkan untuk track indeks lagu saat ini
    
    // Initialize music player
    init: function() {
        // Cegah inisialisasi ganda
        if (this.hasInitialized) {
            console.log('🎵 Music Player already initialized');
            return;
        }
        
        console.log('🎵 Music Player Initialized');
        this.hasInitialized = true;
        
        // Create audio element
        this.audioPlayer = document.createElement('audio');
        this.audioPlayer.id = 'background-music';
        this.audioPlayer.loop = false; // Nonaktifkan loop per lagu, kita handle manual
        this.audioPlayer.preload = 'auto';
        
        // Add to body
        document.body.appendChild(this.audioPlayer);
        
        // Create control button
        this.createControlButton();
        
        // Load saved state FIRST sebelum load song
        this.loadFromStorage();
        
        // Setup song based on saved state
        this.setupSong();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start playing if not muted
        if (this.isPlaying && !this.isMuted) {
            this.play();
        }
        
        // Save initial state
        this.saveToStorage();
    },
    
    // Setup song based on saved state
    setupSong: function() {
        // Cek apakah ada song yang sedang diputar di storage
        const savedState = this.getSavedState();
        
        if (savedState && savedState.currentSongId) {
            // Cari song berdasarkan ID yang disimpan
            const savedSong = this.songs.find(s => s.id === savedState.currentSongId);
            
            if (savedSong) {
                // Gunakan song yang sama
                this.currentSong = savedSong;
                this.audioPlayer.src = savedSong.path;
                this.currentTime = savedState.currentTime || 0;
                
                // Cari indeks lagu saat ini untuk sequential play
                this.currentSongIndex = this.songs.findIndex(s => s.id === savedSong.id);
                if (this.currentSongIndex === -1) this.currentSongIndex = 0;
                
                console.log(`🎵 Continuing: ${savedSong.name} at ${Math.round(this.currentTime)}s`);
                
                // Set current time
                this.audioPlayer.currentTime = this.currentTime;
                return;
            }
        }
        
        // Jika tidak ada saved song, mulai dari song1
        this.loadFirstSong();
    },
    
    // Load first song (song1)
    loadFirstSong: function() {
        this.currentSongIndex = 0;
        this.currentSong = this.songs[0];
        this.audioPlayer.src = this.currentSong.path;
        this.currentTime = 0;
        this.audioPlayer.currentTime = 0;
        
        console.log(`🎵 Starting from first song: ${this.currentSong.name}`);
    },
    
    // Load next song in sequence
    loadNextSong: function() {
        // Increment indeks
        this.currentSongIndex++;
        
        // Jika sudah di akhir array, kembali ke awal
        if (this.currentSongIndex >= this.songs.length) {
            this.currentSongIndex = 0;
        }
        
        // Load lagu berikutnya
        this.currentSong = this.songs[this.currentSongIndex];
        this.audioPlayer.src = this.currentSong.path;
        this.currentTime = 0;
        this.audioPlayer.currentTime = 0;
        
        console.log(`🎵 Next song loaded: ${this.currentSong.name} (${this.currentSongIndex + 1}/${this.songs.length})`);
    },
    
    // Create music control button (tanpa slider volume)
    createControlButton: function() {
        // Create button
        this.controlButton = document.createElement('button');
        this.controlButton.className = 'music-control-btn';
        this.controlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        this.controlButton.title = 'Music Control (M) - Click to mute/unmute';
        
        // Add to body
        document.body.appendChild(this.controlButton);
        
        // Setup button events
        this.setupButtonEvents();
    },
    
    // Setup button events (hanya mute/unmute)
    setupButtonEvents: function() {
        // Toggle mute on button click
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
    },
    
    // Get saved state from localStorage
    getSavedState: function() {
        try {
            const saved = localStorage.getItem('music_player_state');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Error reading saved state:', e);
            return null;
        }
    },
    
    // Load state from localStorage
    loadFromStorage: function() {
        try {
            const saved = this.getSavedState();
            if (saved) {
                console.log('🎵 Loading saved music state:', saved);
                
                // Load semua state
                this.isPlaying = saved.isPlaying !== undefined ? saved.isPlaying : true;
                this.isMuted = saved.isMuted || false;
                this.volume = saved.volume || 0.5;
                this.currentTime = saved.currentTime || 0;
                
                // Apply volume
                this.audioPlayer.volume = this.isMuted ? 0 : this.volume;
                
                // Update UI
                this.updateButtonState();
                
                return true;
            }
        } catch (e) {
            console.error('Error loading music state:', e);
        }
        return false;
    },
    
    // Save state to localStorage
    saveToStorage: function() {
        try {
            const state = {
                isPlaying: this.isPlaying,
                isMuted: this.isMuted,
                volume: this.volume,
                currentSongId: this.currentSong ? this.currentSong.id : null,
                currentTime: this.audioPlayer ? this.audioPlayer.currentTime : 0,
                currentSongIndex: this.currentSongIndex,
                timestamp: Date.now(),
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('music_player_state', JSON.stringify(state));
            
        } catch (e) {
            console.error('Error saving music state:', e);
        }
    },
    
    // Save current time secara periodic
    saveCurrentTime: function() {
        if (this.audioPlayer && this.currentSong) {
            try {
                const timeData = {
                    songId: this.currentSong.id,
                    currentTime: this.audioPlayer.currentTime,
                    timestamp: Date.now()
                };
                localStorage.setItem('music_time_data', JSON.stringify(timeData));
            } catch (e) {
                console.error('Error saving current time:', e);
            }
        }
    },
    
    // Play music
    play: function() {
        if (this.audioPlayer && !this.isMuted) {
            // Cek jika ada saved time yang lebih baru
            this.checkAndRecoverTime();
            
            const playPromise = this.audioPlayer.play();
            
            playPromise.catch(error => {
                console.log('Autoplay prevented:', error);
                this.showPlayHint();
            });
            
            this.isPlaying = true;
            if (this.controlButton) {
                this.controlButton.classList.add('playing');
            }
            
            // Start auto-save interval
            this.startAutoSave();
            
            this.saveToStorage();
        }
    },
    
    // Check and recover time from storage
    checkAndRecoverTime: function() {
        try {
            const timeData = localStorage.getItem('music_time_data');
            if (timeData) {
                const data = JSON.parse(timeData);
                
                // Jika waktu disimpan kurang dari 10 detik yang lalu, gunakan
                if (Date.now() - data.timestamp < 10000 && 
                    data.songId === this.currentSong.id) {
                    this.audioPlayer.currentTime = data.currentTime;
                    console.log(`🎵 Recovered time: ${Math.round(data.currentTime)}s`);
                }
            }
        } catch (e) {
            console.error('Error recovering time:', e);
        }
    },
    
    // Pause music
    pause: function() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.isPlaying = false;
            if (this.controlButton) {
                this.controlButton.classList.remove('playing');
            }
            
            // Save time when paused
            this.saveCurrentTime();
            this.saveToStorage();
        }
    },
    
    // Toggle play/pause
    togglePlay: function() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },
    
    // Toggle mute/unmute
    toggleMute: function() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
        
        // Visual feedback
        if (this.controlButton) {
            this.controlButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.controlButton.style.transform = '';
            }, 150);
        }
    },
    
    // Mute audio
    mute: function() {
        this.isMuted = true;
        if (this.audioPlayer) {
            this.audioPlayer.volume = 0;
        }
        if (this.controlButton) {
            this.controlButton.classList.add('muted');
            this.controlButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
        this.saveToStorage();
        console.log('🔇 Music muted');
    },
    
    // Unmute audio
    unmute: function() {
        this.isMuted = false;
        if (this.audioPlayer) {
            this.audioPlayer.volume = this.volume;
        }
        if (this.controlButton) {
            this.controlButton.classList.remove('muted');
            this.controlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        
        // If was playing before mute, resume play
        if (this.isPlaying) {
            this.play();
        }
        
        this.saveToStorage();
        console.log('🔊 Music unmuted');
    },
    
    // Set volume (0-1) - tetap ada untuk internal use
    setVolume: function(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (!this.isMuted && this.audioPlayer) {
            this.audioPlayer.volume = this.volume;
        }
        
        this.saveToStorage();
        console.log(`🔊 Volume: ${Math.round(this.volume * 100)}%`);
    },
    
    // Update button state
    updateButtonState: function() {
        if (!this.controlButton) return;
        
        if (this.isMuted) {
            this.controlButton.classList.add('muted');
            this.controlButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            this.controlButton.classList.remove('muted');
            this.controlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        
        if (this.isPlaying && !this.isMuted) {
            this.controlButton.classList.add('playing');
        } else {
            this.controlButton.classList.remove('playing');
        }
    },
    
    // Skip to next song (HANYA ketika lagu selesai)
    next: function() {
        // Save current time sebelum pindah lagu
        this.saveCurrentTime();
        
        // Load next song in sequence
        this.loadNextSong();
        
        // Play jika tidak muted
        if (this.isPlaying && !this.isMuted) {
            this.play();
        }
        
        // Save state
        this.saveToStorage();
    },
    
    // Setup event listeners dengan time tracking
    setupEventListeners: function() {
        if (!this.audioPlayer) return;
        
        // When song ends, play next song in sequence
        this.audioPlayer.addEventListener('ended', () => {
            console.log('🎵 Song ended, playing next in sequence...');
            this.next();
        });
        
        // Track time updates untuk auto-save
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.currentTime = this.audioPlayer.currentTime;
        });
        
        // Handle errors
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            // Coba lagu berikutnya
            setTimeout(() => this.next(), 1000);
        });
        
        // Save state ketika leaving page
        window.addEventListener('beforeunload', () => {
            console.log('💾 Saving music state before page unload...');
            this.saveCurrentTime();
            this.saveToStorage();
        });
        
        // Handle page visibility (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page hidden
                console.log('📱 Page hidden, saving music state...');
                this.saveCurrentTime();
                this.saveToStorage();
            } else {
                // Page visible, coba resume
                console.log('📱 Page visible, checking music state...');
                this.loadFromStorage();
                
                if (this.isPlaying && !this.isMuted && this.audioPlayer.paused) {
                    this.audioPlayer.play().catch(e => {
                        console.log('Resume prevented:', e);
                    });
                }
            }
        });
        
        // Auto-save setiap 5 detik
        this.startAutoSave();
    },
    
    // Start auto-save interval
    startAutoSave: function() {
        // Clear existing interval
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Save every 5 seconds
        this.autoSaveInterval = setInterval(() => {
            if (this.audioPlayer && !this.audioPlayer.paused) {
                this.saveCurrentTime();
            }
        }, 5000);
    },
    
    // Show play hint (untuk autoplay restrictions)
    showPlayHint: function() {
        const hint = document.createElement('div');
        hint.className = 'music-hint';
        hint.innerHTML = `
            <div class="hint-content">
                <i class="fas fa-music"></i>
                <p>Click anywhere to enable music</p>
                <button class="hint-btn">OK</button>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .music-hint {
                position: fixed;
                top: 80px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 15px;
                z-index: 10000;
                backdrop-filter: blur(10px);
                border: 2px solid var(--color-pink-medium);
                animation: slideInRight 0.5s ease;
                max-width: 200px;
            }
            .hint-content {
                text-align: center;
            }
            .hint-content i {
                font-size: 2rem;
                color: var(--color-pink-light);
                margin-bottom: 10px;
            }
            .hint-content p {
                font-size: 0.9rem;
                margin-bottom: 10px;
                line-height: 1.4;
            }
            .hint-btn {
                background: var(--color-pink-medium);
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 20px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            .hint-btn:hover {
                background: var(--color-pink-dark);
                transform: scale(1.05);
            }
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(hint);
        
        document.addEventListener('click', function removeHint() {
            hint.remove();
            document.removeEventListener('click', removeHint);
            MUSIC_PLAYER.play();
        }, { once: true });
        
        hint.querySelector('.hint-btn').addEventListener('click', () => {
            hint.remove();
            MUSIC_PLAYER.play();
        });
        
        setTimeout(() => {
            if (hint.parentNode) hint.remove();
        }, 10000);
    }
};

// Enhanced initialization dengan page transition tracking
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded:', window.location.pathname);
    
    // Cek jika ini page pertama kali atau page transition
    const isFirstLoad = !sessionStorage.getItem('music_player_initialized');
    
    if (isFirstLoad) {
        console.log('🚀 First load, initializing music player...');
        sessionStorage.setItem('music_player_initialized', 'true');
        MUSIC_PLAYER.init();
    } else {
        console.log('🔄 Page transition, checking music player state...');
        
        // Jika music player belum diinisialisasi, initialize
        if (!MUSIC_PLAYER.hasInitialized) {
            MUSIC_PLAYER.init();
        } else {
            // Sudah initialized, cukup update state dari storage
            MUSIC_PLAYER.loadFromStorage();
            
            // Cek jika perlu resume play
            if (MUSIC_PLAYER.isPlaying && !MUSIC_PLAYER.isMuted) {
                if (MUSIC_PLAYER.audioPlayer && MUSIC_PLAYER.audioPlayer.paused) {
                    MUSIC_PLAYER.audioPlayer.play().catch(e => {
                        console.log('Resume on page transition prevented:', e);
                    });
                }
            }
        }
    }
    
    // Handle page navigation
    window.addEventListener('popstate', function() {
        console.log('🔙 Back/forward navigation detected');
        MUSIC_PLAYER.saveCurrentTime();
    });
});

// Handle browser back/forward cache
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        console.log('🔄 Page restored from bfcache');
        // Reload state dari storage
        if (MUSIC_PLAYER.hasInitialized) {
            MUSIC_PLAYER.loadFromStorage();
        }
    }
});

// Export untuk debugging
window.MUSIC_PLAYER = MUSIC_PLAYER;
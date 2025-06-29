export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.managerId = `AudioManager_${Date.now()}_${Math.random()}`;
        this.isDestroyed = false;
        
        // Audio settings
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.backgroundMusic = null;
        
        // Initialize audio after scene creation
        this.scene.events.once('create', this.initializeAudio, this);
        
        console.log(`AudioManager initialized for ${scene.scene.key}`);
    }

    initializeAudio() {
        if (this.isDestroyed) return;
        
        try {
            // Initialize background music (if available)
            this.startBackgroundMusic();
            
            // Set up event listeners for game audio
            this.setupAudioEvents();
            
            console.log(`[${this.managerId}] Audio system initialized`);
        } catch (error) {
            console.error(`[${this.managerId}] Error initializing audio:`, error);
        }
    }

    startBackgroundMusic() {
        // Check if background music audio exists
        if (this.scene.cache.audio.exists('backgroundMusic')) {
            this.backgroundMusic = this.scene.sound.add('backgroundMusic', {
                volume: this.musicVolume,
                loop: true
            });
            
            // Start playing if not already playing
            if (!this.backgroundMusic.isPlaying) {
                this.backgroundMusic.play();
                console.log(`[${this.managerId}] Background music started`);
            }
        } else {
            console.log(`[${this.managerId}] Background music not found - skipping`);
        }
    }

    setupAudioEvents() {
        if (this.isDestroyed || !this.scene.events) return;

        // Player spell casting sound
        this.scene.events.on('spell-cast', this.playSpellCastSound, this);
        
        // Reward collection sounds
        this.scene.events.on('orb-collected', this.playOrbCollectSound, this);
        this.scene.events.on('chest-collected', this.playChestCollectSound, this);
        
        // Player death sound
        this.scene.events.on('player-lose', this.playPlayerDeathSound, this);
        
        // Enemy death sound
        this.scene.events.on('enemy-death', this.playEnemyDeathSound, this);
        
        console.log(`[${this.managerId}] Audio event listeners set up`);
    }

    createBeepSound(volume = 0.3, frequency = 800, duration = 0.1) {
        // Create a simple beep sound as fallback using Web Audio API
        if (this.isDestroyed || !this.scene.sound || !this.scene.sound.context) return;
        
        try {
            const audioContext = this.scene.sound.context;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.log(`[${this.managerId}] Could not create beep sound:`, error);
        }
    }

    playSpellCastSound() {
        if (this.isDestroyed) return;
        if (this.scene.cache.audio.exists('spellCast')) {
            this.playSound('spellCast', this.sfxVolume);
        } else {
            this.createBeepSound(this.sfxVolume * 0.8, 1200, 0.15); // Higher pitch for spell cast
        }
    }

    playOrbCollectSound() {
        if (this.isDestroyed) return;
        if (this.scene.cache.audio.exists('orbCollect')) {
            this.playSound('orbCollect', this.sfxVolume);
        } else {
            this.createBeepSound(this.sfxVolume * 0.6, 600, 0.2); // Lower pitch for orb
        }
    }

    playChestCollectSound() {
        if (this.isDestroyed) return;
        if (this.scene.cache.audio.exists('chestCollect')) {
            this.playSound('chestCollect', this.sfxVolume);
        } else {
            this.createBeepSound(this.sfxVolume * 0.7, 900, 0.3); // Medium pitch for chest
        }
    }

    playPlayerDeathSound() {
        if (this.isDestroyed) return;
        if (this.scene.cache.audio.exists('playerDeath')) {
            this.playSound('playerDeath', this.sfxVolume);
        } else {
            this.createBeepSound(this.sfxVolume, 300, 0.5); // Low pitch for death
        }
        // Stop background music when player dies
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
    }

    playEnemyDeathSound() {
        if (this.isDestroyed) return;
        if (this.scene.cache.audio.exists('enemyDeath')) {
            this.playSound('enemyDeath', this.sfxVolume * 0.6); // Slightly quieter
        } else {
            this.createBeepSound(this.sfxVolume * 0.4, 400, 0.15); // Quick low beep
        }
    }

    playSound(soundKey, volume = this.sfxVolume) {
        if (this.isDestroyed || !this.scene.sound) return;
        
        try {
            if (this.scene.cache.audio.exists(soundKey)) {
                const sound = this.scene.sound.add(soundKey, { volume });
                sound.play();
                
                // Clean up the sound after it finishes to prevent memory leaks
                sound.once('complete', () => {
                    sound.destroy();
                });
            } else {
                console.log(`[${this.managerId}] Sound '${soundKey}' not found`);
            }
        } catch (error) {
            console.error(`[${this.managerId}] Error playing sound '${soundKey}':`, error);
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.setVolume(this.musicVolume);
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
        }
    }

    resumeBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPaused) {
            this.backgroundMusic.resume();
        }
    }

    destroy() {
        console.log(`[${this.managerId}] AudioManager destroy called`);
        this.isDestroyed = true;
        
        // Stop and destroy background music
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            this.backgroundMusic = null;
        }
        
        // Remove event listeners
        if (this.scene && this.scene.events) {
            this.scene.events.off('spell-cast', this.playSpellCastSound, this);
            this.scene.events.off('orb-collected', this.playOrbCollectSound, this);
            this.scene.events.off('chest-collected', this.playChestCollectSound, this);
            this.scene.events.off('player-lose', this.playPlayerDeathSound, this);
            this.scene.events.off('enemy-death', this.playEnemyDeathSound, this);
            this.scene.events.off('create', this.initializeAudio, this);
        }
        
        console.log(`[${this.managerId}] AudioManager destroyed`);
    }
}

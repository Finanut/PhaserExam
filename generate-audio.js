

const fs = require('fs');
const path = require('path');

// WAV file header structure
function createWAVHeader(sampleRate, bitsPerSample, numChannels, dataSize) {
    const buffer = Buffer.alloc(44);
    
    // RIFF header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);
    
    // fmt chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // chunk size
    buffer.writeUInt16LE(1, 20); // PCM format
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28); // byte rate
    buffer.writeUInt16LE(numChannels * bitsPerSample / 8, 32); // block align
    buffer.writeUInt16LE(bitsPerSample, 34);
    
    // data chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);
    
    return buffer;
}

// Generate a simple tone
function generateTone(frequency, duration, sampleRate = 44100) {
    const numSamples = Math.floor(duration * sampleRate);
    const data = Buffer.alloc(numSamples * 2); // 16-bit samples
    
    for (let i = 0; i < numSamples; i++) {
        const angle = 2 * Math.PI * frequency * i / sampleRate;
        const amplitude = Math.sin(angle) * 0.3 * 32767; // 30% volume
        data.writeInt16LE(Math.round(amplitude), i * 2);
    }
    
    return data;
}

// Create audio files
function createAudioFile(filename, frequency, duration) {
    const audioData = generateTone(frequency, duration);
    const header = createWAVHeader(44100, 16, 1, audioData.length);
    const fullData = Buffer.concat([header, audioData]);
    
    const filepath = path.join('./assets/audio', filename);
    fs.writeFileSync(filepath, fullData);
    console.log(`Created ${filepath}`);
}

// Ensure audio directory exists
if (!fs.existsSync('./assets/audio')) {
    fs.mkdirSync('./assets/audio', { recursive: true });
}

// Generate placeholder audio files
console.log('Generating placeholder audio files...');

createAudioFile('spell-cast.wav', 1200, 0.15); // High pitch beep
createAudioFile('orb-collect.wav', 600, 0.2); // Medium pitch
createAudioFile('chest-collect.wav', 900, 0.3); // Higher pitch, longer
createAudioFile('player-death.wav', 300, 0.5); // Low pitch, longer
createAudioFile('enemy-death.wav', 400, 0.15); // Quick low beep

// Create a simple background music loop (alternating tones)
function createBackgroundMusic() {
    const frequencies = [220, 277, 330, 370]; // A3, C#4, E4, F#4
    const noteDuration = 1.0; // 1 second per note
    const sampleRate = 44100;
    
    let musicData = Buffer.alloc(0);
    
    // Create 4 loops of the sequence
    for (let loop = 0; loop < 4; loop++) {
        for (let freq of frequencies) {
            const noteData = generateTone(freq, noteDuration, sampleRate);
            musicData = Buffer.concat([musicData, noteData]);
        }
    }
    
    const header = createWAVHeader(sampleRate, 16, 1, musicData.length);
    const fullData = Buffer.concat([header, musicData]);
    
    const filepath = path.join('./assets/audio', 'background-music.wav');
    fs.writeFileSync(filepath, fullData);
    console.log(`Created ${filepath}`);
}

createBackgroundMusic();

console.log('Audio file generation complete!');

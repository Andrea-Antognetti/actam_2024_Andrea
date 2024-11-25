const c = new AudioContext();
let currentSource = null; // Variabile per tenere traccia della sorgente audio attiva

function createsANoiseBuffer() {
    const b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const audioData = b.getChannelData(0);

    for (var i = 0; i < audioData.length; i++) {
        audioData[i] = Math.random();   
    }
    return b;
}

function createsASineBuffer(f) {
    return function() {
        const b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
        const alpha = Math.PI * 2 * f / c.sampleRate;
        const audioData = b.getChannelData(0);

        for (var i = 0; i < audioData.length; i++) {
            audioData[i] = Math.sin(alpha * i);   
        }
        return b;
    }
}

function playBuffer(bufferCreator) {
    const b = bufferCreator();
    const bs = c.createBufferSource();
    bs.buffer = b;
    bs.connect(c.destination);
    bs.start();

    // Se esiste un buffer precedente, fermalo prima di avviarne uno nuovo
    if (currentSource) {
        currentSource.stop();
    }

    // Imposta la nuova sorgente come attiva
    currentSource = bs;

    // Aggiungi un event listener per aggiornare currentSource quando il buffer finisce
    bs.onended = function() {
        currentSource = null; // Una volta che il suono finisce, resettiamo la sorgente
    };
}

function stop() {
    if (currentSource) {
        currentSource.stop(); // Fermiamo la sorgente attiva
        currentSource = null;  // Resettiamo la variabile
    }
}

// Crea un contesto audio di Tone.js
const synth = new Tone.Synth().toDestination();

// Imposta il ritmo di base
const loop = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "8n", time);  // Suona la nota C4 (Do centrale) ogni 8n (ottava nota)
}, "4n").start(0);

// Avvia il contesto audio e suona per 4 misure
Tone.Transport.bpm.value = 120;  // Imposta il tempo in battiti per minuto (BPM)
Tone.Transport.start();


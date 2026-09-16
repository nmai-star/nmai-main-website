"use client";

// High-performance, zero-latency audio engine for button clicks across NMAI

let audioBuffer: AudioBuffer | null = null;
let audioContext: AudioContext | null = null;
let preloadedAudio: HTMLAudioElement | null = null;
let lastPlayTimestamp = 0;
let isPreloading = false;

/**
 * Initializes and preloads the click audio via both Web Audio API & HTML5 Audio
 */
export function preloadClickSound() {
  if (typeof window === "undefined" || isPreloading) return;
  isPreloading = true;

  try {
    // 1. Preload via HTML5 Audio element
    if (!preloadedAudio) {
      preloadedAudio = new Audio("/click.mp3");
      preloadedAudio.preload = "auto";
      preloadedAudio.load();
    }

    // 2. Pre-fetch and decode via Web Audio API for 0ms latency
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (AudioContextClass && !audioBuffer) {
      if (!audioContext) {
        audioContext = new AudioContextClass();
      }
      fetch("/click.mp3")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.arrayBuffer();
        })
        .then((data) => {
          if (audioContext && data) {
            return audioContext.decodeAudioData(data);
          }
        })
        .then((decoded) => {
          if (decoded) {
            audioBuffer = decoded;
          }
        })
        .catch(() => {
          // Gracefully continue with HTML5 Audio fallback
        });
    }
  } catch {
    // Ignore preload errors
  }
}

/**
 * Plays the crisp click sound effect with volume control and smart throttling.
 * @param volume Volume level from 0.0 to 1.0 (default: 0.75)
 */
export function playClickSound(volume = 0.75) {
  if (typeof window === "undefined") return;

  // Throttle (25ms) to prevent double-firing on event bubbling
  const now = Date.now();
  if (now - lastPlayTimestamp < 25) return;
  lastPlayTimestamp = now;

  const clampedVolume = Math.max(0.1, Math.min(1.0, volume));

  // Strategy 1: Web Audio API (instantaneous, zero-latency native buffer playback)
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (AudioContextClass) {
      if (!audioContext) {
        audioContext = new AudioContextClass();
      }
      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      if (audioBuffer) {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        source.buffer = audioBuffer;
        gainNode.gain.setValueAtTime(clampedVolume, audioContext.currentTime);
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(0);
        return;
      }
    }
  } catch {
    // Fall through to HTML5 Audio
  }

  // Strategy 2: HTML5 Audio clone / preloaded instance
  try {
    let audio: HTMLAudioElement;
    if (preloadedAudio) {
      audio = preloadedAudio.cloneNode(true) as HTMLAudioElement;
    } else {
      audio = new Audio("/click.mp3");
      preloadedAudio = audio;
    }
    audio.volume = clampedVolume;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or interaction restriction handled silently
      });
    }
  } catch {
    // Strategy 3: Direct new Audio fallback
    try {
      const fallback = new Audio("/click.mp3");
      fallback.volume = clampedVolume;
      fallback.play().catch(() => {});
    } catch {}
  }
}

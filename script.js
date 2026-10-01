/**
 * Starlit Love: I LOVE YOU MALIKA
 * Firework Heart & Stardust Circle Engine with Full Sound System:
 * 1. Chiroq (Glowing light/spark with sizzle & hum)
 * 2. Salyut otish (Rocket launch with realistic whistle & whoosh sound)
 * 3. Yurak chiqishi (Heart explosion with cinematic boom, crackles & celestial chimes)
 * 4. Dumaloq bo'lishi (Morphing into circle with singing-bowl starlight glissando)
 * 5. Matn chiqishi ("I LOVE YOU MALIKA" text reveal with harp fanfare)
 * 6. Interaktiv ovozlar: Yulduzlar, yuraklar, kichik salyutlar va romantik musiqa.
 */

// ============================================================================
// Configuration & Global State
// ============================================================================
const CONFIG = {
  starCount: window.innerWidth < 768 ? 900 : 1800,
  dustCount: window.innerWidth < 768 ? 35 : 70,
  maxHearts: 80,
  colors: {
    warmGold: 'rgba(255, 235, 185, ',
    royalGold: 'rgba(245, 215, 120, ',
    silverWhite: 'rgba(245, 250, 255, ',
    softBlue: 'rgba(210, 235, 255, ',
    rosePink: 'rgba(255, 182, 193, ',
    rubyHeart: 'rgba(255, 95, 140, '
  }
};

const state = {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: Math.min(window.devicePixelRatio || 1, 2),
  mouseX: window.innerWidth / 2,
  mouseY: window.innerHeight / 2,
  targetMouseX: window.innerWidth / 2,
  targetMouseY: window.innerHeight / 2,
  isIntroComplete: false,
  isMusicPlaying: true, // Audio active by default
  audioUnlocked: false
};

// Canvas & Context Setup
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d', { alpha: false });

// DOM Elements
const meteorFlash = document.getElementById('meteor-flash');
const romanticHeadline = document.getElementById('romantic-headline');
const romanticSubline = document.getElementById('romantic-subline');
const romanticDevotion = document.getElementById('romantic-devotion');
const celestialOrnaments = document.querySelectorAll('.celestial-ornament');
const bottomDeck = document.getElementById('bottom-deck');
const btnMusic = document.getElementById('btn-music');
const btnFirework = document.getElementById('btn-firework');
const btnReplay = document.getElementById('btn-replay');
const constellationBanner = document.getElementById('constellation-banner');
const sceneWrapper = document.querySelector('.scene-wrapper');
const bgMusic = document.getElementById('bg-music');

// Collections
let stars = [];
let celestialDust = [];
let heartParticles = [];
let nebulas = [];

// ============================================================================
// Grand Firework State
// ============================================================================
const grandFirework = {
  stage: 'idle', // 'spark' -> 'launch' -> 'heart_burst' -> 'morph_circle' -> 'circle_halo'
  sparkX: 0,
  sparkY: 0,
  sparkRadius: 0,
  sparkAlpha: 0,
  sparkPulse: 0,
  rocket: null,
  sparks: [],
  centerX: 0,
  centerY: 0,
  morphProgress: 0,
  circleRadius: 0,
  haloRotation: 0
};

let miniFireworks = [];

// ============================================================================
// Canvas Sizing & Generation
// ============================================================================
function resizeCanvas() {
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = state.width * state.dpr;
  canvas.height = state.height * state.dpr;
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.scale(state.dpr, state.dpr);

  grandFirework.centerX = state.width * 0.5;
  grandFirework.centerY = state.height * 0.44;
  grandFirework.circleRadius = Math.min(state.width, state.height) * (state.width < 768 ? 0.44 : 0.36);

  initNebulas();
  initStars();
  initCelestialDust();
}

function initNebulas() {
  nebulas = [
    {
      x: state.width * 0.25,
      y: state.height * 0.35,
      radius: Math.max(state.width, state.height) * 0.48,
      color: 'rgba(25, 40, 95, 0.26)',
      vx: 0.015,
      vy: 0.01
    },
    {
      x: state.width * 0.78,
      y: state.height * 0.25,
      radius: Math.max(state.width, state.height) * 0.52,
      color: 'rgba(45, 25, 80, 0.2)',
      vx: -0.012,
      vy: 0.008
    }
  ];
}

function initStars() {
  const count = window.innerWidth < 768 ? 900 : 1800;
  stars = [];

  for (let i = 0; i < count; i++) {
    const colorRoll = Math.random();
    let baseColor = CONFIG.colors.silverWhite;
    if (colorRoll < 0.3) baseColor = CONFIG.colors.warmGold;
    else if (colorRoll < 0.48) baseColor = CONFIG.colors.softBlue;
    else if (colorRoll < 0.58) baseColor = CONFIG.colors.rosePink;

    const z = Math.random() * 0.8 + 0.2;
    const isProminent = Math.random() < 0.035;
    const baseRadius = isProminent 
      ? Math.random() * 1.5 + 1.2 
      : Math.random() * 0.85 + 0.3;

    stars.push({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      z: z,
      radius: baseRadius,
      baseAlpha: isProminent ? Math.random() * 0.4 + 0.6 : Math.random() * 0.5 + 0.25,
      twinkleSpeed: Math.random() * 0.03 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      isProminent: isProminent,
      baseColor: baseColor,
      currentAlphaMultiplier: 0
    });
  }
}

function initCelestialDust() {
  const count = window.innerWidth < 768 ? 35 : 70;
  celestialDust = [];

  for (let i = 0; i < count; i++) {
    celestialDust.push({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      radius: Math.random() * 1.8 + 0.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    });
  }
}

// Realistic Moon
function drawRealisticMoon(ctx, parallaxX, parallaxY) {
  const moonX = state.width * 0.84 + parallaxX * 0.08;
  const moonY = state.height * 0.18 + parallaxY * 0.08;
  const moonRadius = Math.min(state.width, state.height) * 0.065;

  const outerGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 5.5);
  outerGlow.addColorStop(0, 'rgba(215, 235, 255, 0.16)');
  outerGlow.addColorStop(0.35, 'rgba(190, 220, 255, 0.06)');
  outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = outerGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius * 5.5, 0, Math.PI * 2);
  ctx.fill();

  const innerCorona = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 2.2);
  innerCorona.addColorStop(0, 'rgba(255, 250, 240, 0.35)');
  innerCorona.addColorStop(0.5, 'rgba(220, 240, 255, 0.12)');
  innerCorona.addColorStop(1, 'rgba(200, 225, 255, 0)');
  ctx.fillStyle = innerCorona;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  const moonOrb = ctx.createRadialGradient(
    moonX - moonRadius * 0.3,
    moonY - moonRadius * 0.3,
    moonRadius * 0.1,
    moonX,
    moonY,
    moonRadius
  );
  moonOrb.addColorStop(0, '#ffffff');
  moonOrb.addColorStop(0.4, '#f2f7fd');
  moonOrb.addColorStop(0.85, '#dde7f2');
  moonOrb.addColorStop(1, '#b5c6d8');

  ctx.save();
  ctx.shadowColor = 'rgba(235, 245, 255, 0.85)';
  ctx.shadowBlur = 25;
  ctx.fillStyle = moonOrb;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ============================================================================
// WEB AUDIO API COMPLETE SOUND SYSTEM
// ============================================================================
let audioCtx = null;
let masterGain = null;
let soundFXGain = null;
let isAudioInitialized = false;
let musicInterval = null;
let noiseBuffer = null;

function initAudioEngine() {
  if (isAudioInitialized) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);

    soundFXGain = audioCtx.createGain();
    soundFXGain.gain.setValueAtTime(0.9, audioCtx.currentTime);

    // Warm Lowpass Filter for Film-grade Ambience
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, audioCtx.currentTime);

    // Stereo Reverb Delay Network
    const delay = audioCtx.createDelay();
    delay.delayTime.setValueAtTime(0.42, audioCtx.currentTime);
    const delayFeedback = audioCtx.createGain();
    delayFeedback.gain.setValueAtTime(0.4, audioCtx.currentTime);

    masterGain.connect(filter);
    filter.connect(audioCtx.destination);
    filter.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delayFeedback.connect(audioCtx.destination);

    soundFXGain.connect(filter);
    soundFXGain.connect(audioCtx.destination);

    isAudioInitialized = true;
  } catch (err) {
    console.warn('Web Audio error:', err);
  }
}

// Pre-render white noise buffer for realistic explosion rumble & crackles
function getNoiseBuffer() {
  if (!audioCtx) return null;
  if (noiseBuffer) return noiseBuffer;
  const bufferSize = audioCtx.sampleRate * 2.5;
  noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function ensureAudioUnlocked() {
  initAudioEngine();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (bgMusic && state.isMusicPlaying && bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }
  if (btnMusic) btnMusic.classList.add('playing');
  state.audioUnlocked = true;
}

/**
 * 1. Chiroq ovozi: Ethereal rising hum + starlight sizzle
 */
function playSparkIgniteSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const now = audioCtx.currentTime;

  // Gentle hum rising
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.07, now + 0.6);
  gain.gain.linearRampToValueAtTime(0.0001, now + 1.25);

  osc.connect(gain);
  gain.connect(soundFXGain);
  osc.start(now);
  osc.stop(now + 1.25);

  // High-frequency spark sizzle
  const noise = getNoiseBuffer();
  if (noise) {
    const src = audioCtx.createBufferSource();
    src.buffer = noise;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800, now);
    filter.Q.setValueAtTime(3.5, now);

    const sizzleGain = audioCtx.createGain();
    sizzleGain.gain.setValueAtTime(0.0001, now);
    sizzleGain.gain.linearRampToValueAtTime(0.05, now + 0.6);
    sizzleGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

    src.connect(filter);
    filter.connect(sizzleGain);
    sizzleGain.connect(soundFXGain);
    src.start(now);
    src.stop(now + 1.2);
  }
}

/**
 * 2. Salyot otilish ovozi: Low launch thump + aerodynamic rising whistle & whoosh
 */
function playRocketLaunchSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const now = audioCtx.currentTime;

  // Launch thump punch
  const thump = audioCtx.createOscillator();
  const thumpGain = audioCtx.createGain();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(130, now);
  thump.frequency.exponentialRampToValueAtTime(45, now + 0.25);

  thumpGain.gain.setValueAtTime(0.2, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  thump.connect(thumpGain);
  thumpGain.connect(soundFXGain);
  thump.start(now);
  thump.stop(now + 0.25);

  // High whistling rocket hiss (sweeps from 450Hz to 2200Hz)
  const noise = getNoiseBuffer();
  if (noise) {
    const src = audioCtx.createBufferSource();
    src.buffer = noise;
    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(450, now);
    bp.frequency.exponentialRampToValueAtTime(2200, now + 0.95);
    bp.Q.setValueAtTime(8, now);

    const whistleGain = audioCtx.createGain();
    whistleGain.gain.setValueAtTime(0.0001, now);
    whistleGain.gain.linearRampToValueAtTime(0.16, now + 0.2);
    whistleGain.gain.linearRampToValueAtTime(0.0001, now + 0.95);

    src.connect(bp);
    bp.connect(whistleGain);
    whistleGain.connect(soundFXGain);
    src.start(now);
    src.stop(now + 0.95);
  }
}

/**
 * 3. Katta Salyut portlashi & Yurak ovozi:
 * Sub-bass boom, explosive blast, firework crackles, and celestial starlight chime chord!
 */
function playHeartExplosionSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const now = audioCtx.currentTime;

  // 1. Deep Sub-bass Firework BOOM
  const boom = audioCtx.createOscillator();
  const boomGain = audioCtx.createGain();
  boom.type = 'sine';
  boom.frequency.setValueAtTime(95, now);
  boom.frequency.exponentialRampToValueAtTime(32, now + 0.8);

  boomGain.gain.setValueAtTime(0.35, now);
  boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  boom.connect(boomGain);
  boomGain.connect(soundFXGain);
  boom.start(now);
  boom.stop(now + 0.85);

  // 2. Explosive Firework Rumble
  const noise = getNoiseBuffer();
  if (noise) {
    const src = audioCtx.createBufferSource();
    src.buffer = noise;
    const lp = audioCtx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900, now);
    lp.frequency.exponentialRampToValueAtTime(150, now + 1.2);

    const rumbleGain = audioCtx.createGain();
    rumbleGain.gain.setValueAtTime(0.3, now);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

    src.connect(lp);
    lp.connect(rumbleGain);
    rumbleGain.connect(soundFXGain);
    src.start(now);
    src.stop(now + 1.3);

    // 3. Firework Crackles ("Qisir-qisir" glitter pops)
    for (let c = 0; c < 12; c++) {
      const crackleDelay = 0.2 + c * 0.07 + Math.random() * 0.04;
      setTimeout(() => {
        if (!audioCtx) return;
        const cNow = audioCtx.currentTime;
        const cSrc = audioCtx.createBufferSource();
        cSrc.buffer = noise;
        const cFilter = audioCtx.createBiquadFilter();
        cFilter.type = 'highpass';
        cFilter.frequency.setValueAtTime(3200 + Math.random() * 1200, cNow);

        const cGain = audioCtx.createGain();
        cGain.gain.setValueAtTime(0.08, cNow);
        cGain.gain.exponentialRampToValueAtTime(0.0001, cNow + 0.04);

        cSrc.connect(cFilter);
        cFilter.connect(cGain);
        cGain.connect(soundFXGain);
        cSrc.start(cNow);
        cSrc.stop(cNow + 0.045);
      }, crackleDelay * 1000);
    }
  }

  // 4. Harmonic Celestial Starlight Chime (Heart melody)
  const heartNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  heartNotes.forEach((freq, idx) => {
    setTimeout(() => {
      if (!audioCtx) return;
      const cNow = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, cNow);

      gain.gain.setValueAtTime(0.0001, cNow);
      gain.gain.exponentialRampToValueAtTime(0.09, cNow + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, cNow + 2.8);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(cNow);
      osc.stop(cNow + 2.8);
    }, idx * 75);
  });
}

/**
 * 4. Dumaloq bo'lish ovozi: Singing-bowl / crystal glissando as the heart opens into a circle
 */
function playMorphToCircleSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const glissNotes = [587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98];
  glissNotes.forEach((freq, idx) => {
    setTimeout(() => {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 2.0);
    }, idx * 95);
  });
}

/**
 * 5. Matn chiqish ovozi ("I LOVE YOU MALIKA"):
 * Grand romantic starlight harp fanfare with celestial reverberation
 */
function playTextRevealSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const fanfareNotes = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
  fanfareNotes.forEach((freq, idx) => {
    setTimeout(() => {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 3.2);
    }, idx * 110);
  });
}

/**
 * 6. Yuraklar chiqish ovozi (Interactive click/tap):
 * Delicate, bubbly, romantic harp pluck
 */
function playHeartPopSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const now = audioCtx.currentTime;
  const heartTones = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66];
  const freq = heartTones[Math.floor(Math.random() * heartTones.length)];

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

  osc.connect(gain);
  gain.connect(soundFXGain);
  osc.start(now);
  osc.stop(now + 0.85);
}

/**
 * 7. Kichik salyut otilish & portlash ovozlari (Click fireworks)
 */
function playMiniRocketSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(380, now);
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.45);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
  gain.gain.linearRampToValueAtTime(0.0001, now + 0.45);

  osc.connect(gain);
  gain.connect(soundFXGain);
  osc.start(now);
  osc.stop(now + 0.45);
}

function playMiniExplosionSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const now = audioCtx.currentTime;

  // Mini pop
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  osc.connect(gain);
  gain.connect(soundFXGain);
  osc.start(now);
  osc.stop(now + 0.22);

  // Sparkle chime
  const chimeFreq = [783.99, 880, 1046.50][Math.floor(Math.random() * 3)];
  const cOsc = audioCtx.createOscillator();
  const cGain = audioCtx.createGain();
  cOsc.type = 'triangle';
  cOsc.frequency.setValueAtTime(chimeFreq, now);

  cGain.gain.setValueAtTime(0.0001, now);
  cGain.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
  cGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

  cOsc.connect(cGain);
  cGain.connect(soundFXGain);
  cOsc.start(now);
  cOsc.stop(now + 0.9);
}

/**
 * 8. Yulduzlar chaqnashi ovozi (Crystalline starlight chime)
 */
function playStarTwinkleSound() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const now = audioCtx.currentTime;
  const twinkleTones = [1760.00, 2093.00, 2349.32, 2637.02, 3135.96];
  const freq = twinkleTones[Math.floor(Math.random() * twinkleTones.length)];

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.02, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 1.2);
}

// Romantic Background Music Engine Chords
const romanticChords = [
  [130.81, 196.00, 246.94, 329.63, 587.33], // Cmaj9
  [110.00, 164.81, 196.00, 261.63, 493.88], // Am9
  [87.31, 130.81, 220.00, 329.63, 392.00],  // Fmaj7
  [98.00, 146.83, 196.00, 261.63, 329.63]   // Gsus4
];
let chordIndex = 0;

function playChordStep() {
  if (!audioCtx || !state.isMusicPlaying) return;
  const now = audioCtx.currentTime;
  const chord = romanticChords[chordIndex % romanticChords.length];
  chordIndex++;

  chord.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    osc.type = idx === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    const attack = 0.8 + idx * 0.15;
    const sustain = 3.2;
    const release = 1.8;

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + attack);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + sustain + release);

    osc.connect(noteGain);
    noteGain.connect(masterGain);
    osc.start(now);
    osc.stop(now + attack + sustain + release);
  });

  // Background star twinkle
  if (Math.random() < 0.6) {
    setTimeout(playStarTwinkleSound, 1200 + Math.random() * 1500);
  }
}

function toggleRomanticMusic() {
  ensureAudioUnlocked();
  state.isMusicPlaying = !state.isMusicPlaying;

  if (state.isMusicPlaying) {
    btnMusic.classList.add('playing');
    if (bgMusic) {
      bgMusic.play().catch(() => {});
    }
    if (soundFXGain && audioCtx) {
      soundFXGain.gain.setValueAtTime(0.9, audioCtx.currentTime);
    }
  } else {
    btnMusic.classList.remove('playing');
    if (bgMusic) {
      bgMusic.pause();
    }
    if (soundFXGain && audioCtx) {
      soundFXGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
  }
}

// ============================================================================
// Heart Firework Particle Creator
// ============================================================================
function createHeartFireworkParticles(cx, cy) {
  const particles = [];
  const count = window.innerWidth < 768 ? 160 : 240;
  
  const heartScale = Math.min(state.width, state.height) * (state.width < 768 ? 0.022 : 0.028);
  const circleRadius = Math.min(state.width, state.height) * (state.width < 768 ? 0.44 : 0.36);
  grandFirework.circleRadius = circleRadius;

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const sinT = Math.sin(t);
    const hx = 16 * Math.pow(sinT, 3) * heartScale;
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * heartScale;

    const circleAngle = t - Math.PI / 2;
    const cxTarget = Math.cos(circleAngle) * circleRadius;
    const cyTarget = Math.sin(circleAngle) * circleRadius;

    const paletteOptions = [
      { fill: 'rgba(255, 235, 170, ', glow: 'rgba(245, 215, 120, ' },
      { fill: 'rgba(255, 140, 180, ', glow: 'rgba(255, 95, 140, ' },
      { fill: 'rgba(255, 200, 220, ', glow: 'rgba(255, 180, 210, ' },
      { fill: 'rgba(255, 255, 255, ', glow: 'rgba(220, 240, 255, ' }
    ];
    const color = paletteOptions[Math.floor(Math.random() * paletteOptions.length)];

    particles.push({
      x: cx,
      y: cy,
      currentX: 0,
      currentY: 0,
      heartX: hx,
      heartY: hy,
      circleX: cxTarget,
      circleY: cyTarget,
      speed: Math.random() * 0.045 + 0.035,
      radius: Math.random() * 2.2 + 2.0,
      alpha: 1,
      color: color,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.05 + 0.02
    });
  }

  return particles;
}

// ============================================================================
// Sequential Story Orchestration
// ============================================================================
function startGrandFireworkSequence() {
  ensureAudioUnlocked();

  // Reset reveals
  if (romanticHeadline) romanticHeadline.classList.remove('revealed');
  if (romanticSubline) romanticSubline.classList.remove('revealed');
  if (romanticDevotion) romanticDevotion.classList.remove('revealed');
  celestialOrnaments.forEach(ornament => ornament.classList.remove('revealed'));
  if (bottomDeck) bottomDeck.classList.remove('revealed');

  grandFirework.sparks = [];
  grandFirework.rocket = null;
  grandFirework.morphProgress = 0;
  grandFirework.haloRotation = 0;

  // Step 1: Boshida chiroq bo'lib (A glowing spark emerges at bottom center)
  grandFirework.stage = 'spark';
  grandFirework.sparkX = state.width * 0.5;
  grandFirework.sparkY = state.height * 0.88;
  grandFirework.sparkRadius = 0;
  grandFirework.sparkAlpha = 0;
  grandFirework.sparkPulse = 0;

  // Play spark sizzle & hum sound
  playSparkIgniteSound();

  let sparkTime = 0;
  const sparkInterval = setInterval(() => {
    sparkTime += 50;
    grandFirework.sparkRadius = Math.min(14, sparkTime * 0.012);
    grandFirework.sparkAlpha = Math.min(1, sparkTime * 0.001);

    if (sparkTime >= 1200) {
      clearInterval(sparkInterval);
      launchFireworkRocket();
    }
  }, 50);
}

// Step 2: Salyot otib (Rocket launches skyward with whistle & whoosh)
function launchFireworkRocket() {
  grandFirework.stage = 'launch';
  grandFirework.rocket = {
    x: grandFirework.sparkX,
    y: grandFirework.sparkY,
    targetY: state.height * 0.42,
    vy: -17,
    trail: []
  };

  playRocketLaunchSound();
}

// Step 3: Yurak chiqib (Explosion into a brilliant Firework Heart with thunderous boom & crackles)
function explodeFireworkHeart() {
  grandFirework.stage = 'heart_burst';
  grandFirework.centerX = grandFirework.rocket.x;
  grandFirework.centerY = grandFirework.rocket.targetY;
  grandFirework.rocket = null;

  // Atmospheric flash
  if (meteorFlash) {
    meteorFlash.style.opacity = '0.85';
    setTimeout(() => {
      meteorFlash.style.opacity = '0';
    }, 450);
  }

  // Camera shake
  if (sceneWrapper) {
    sceneWrapper.style.transform = 'scale(1.02) translateY(-5px)';
    setTimeout(() => {
      sceneWrapper.style.transform = 'scale(1) translateY(0)';
    }, 500);
  }

  // Play realistic firework heart explosion sound
  playHeartExplosionSound();

  // Create heart particles
  grandFirework.sparks = createHeartFireworkParticles(grandFirework.centerX, grandFirework.centerY);

  if (constellationBanner) {
    constellationBanner.classList.add('active');
    setTimeout(() => {
      constellationBanner.classList.remove('active');
    }, 4000);
  }

  // Hold the Heart shape for ~1.6s
  setTimeout(() => {
    morphHeartToCircle();
  }, 1600);
}

// Step 4: Dumaloq bo'lib (Morph the heart into a glowing circle with singing-bowl glissando)
function morphHeartToCircle() {
  grandFirework.stage = 'morph_circle';
  playMorphToCircleSound();

  let progress = 0;
  const morphInterval = setInterval(() => {
    progress += 0.025;
    grandFirework.morphProgress = Math.min(1, progress);

    if (progress >= 1) {
      clearInterval(morphInterval);
      grandFirework.stage = 'circle_halo';
      revealTextInsideCircle();
    }
  }, 35);
}

// Step 5: Keyin shu texst chiqishi kerak ("I LOVE YOU MALIKA" emerges in the center of the ring)
function revealTextInsideCircle() {
  // Play grand starlight harp fanfare
  playTextRevealSound();

  setTimeout(() => {
    if (romanticHeadline) {
      romanticHeadline.classList.add('revealed');
    }
  }, 200);

  setTimeout(() => {
    if (romanticSubline) {
      romanticSubline.classList.add('revealed');
    }
  }, 1200);

  setTimeout(() => {
    if (romanticDevotion) {
      romanticDevotion.classList.add('revealed');
    }
    celestialOrnaments.forEach(ornament => ornament.classList.add('revealed'));
  }, 2200);

  setTimeout(() => {
    if (bottomDeck) {
      bottomDeck.classList.add('revealed');
    }
    state.isIntroComplete = true;
  }, 3200);
}

// ============================================================================
// Mini Firework on User Click
// ============================================================================
class MiniFirework {
  constructor(targetX, targetY) {
    this.x = targetX + (Math.random() - 0.5) * 40;
    this.y = state.height;
    this.targetY = targetY;
    this.vy = -Math.sqrt(2 * 0.45 * (state.height - targetY)) * 0.95;
    this.isDead = false;
    this.hasExploded = false;
    this.sparks = [];
    this.trail = [];

    playMiniRocketSound();
  }

  update() {
    if (!this.hasExploded) {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      this.y += this.vy;
      this.vy += 0.45;

      if (this.y <= this.targetY || this.vy >= 0) {
        this.explode();
      }
    } else {
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.alpha -= 0.018;
        if (s.alpha <= 0) {
          this.sparks.splice(i, 1);
        }
      }
      if (this.sparks.length === 0) {
        this.isDead = true;
      }
    }

    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].alpha -= 0.06;
      if (this.trail[i].alpha <= 0) {
        this.trail.splice(i, 1);
      }
    }
  }

  explode() {
    this.hasExploded = true;
    playMiniExplosionSound();

    const count = 35;
    const heartScale = 1.2;

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const sinT = Math.sin(t);
      const hx = 16 * Math.pow(sinT, 3) * heartScale;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * heartScale;

      this.sparks.push({
        x: this.x,
        y: this.y,
        vx: (hx / 8) * (Math.random() * 0.4 + 0.8),
        vy: (hy / 8) * (Math.random() * 0.4 + 0.8),
        alpha: 1,
        color: Math.random() < 0.5 ? 'rgba(255, 120, 160, ' : 'rgba(255, 215, 140, '
      });
    }
  }

  draw(ctx) {
    if (!this.hasExploded) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();

      for (const t of this.trail) {
        ctx.fillStyle = `rgba(255, 220, 160, ${t.alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      for (const s of this.sparks) {
        ctx.fillStyle = s.color + `${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// Floating click hearts
class FloatingHeart {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 20;
    this.y = y + (Math.random() - 0.5) * 20;
    this.size = Math.random() * 12 + 10;
    this.vy = -Math.random() * 1.8 - 1.2;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.05 + 0.03;
    this.wobbleRadius = Math.random() * 1.8 + 0.8;
    this.alpha = 1;
    this.decay = Math.random() * 0.012 + 0.008;
    this.rotation = (Math.random() - 0.5) * 0.4;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;

    const palette = [
      { fill: 'rgba(255, 120, 160, ', glow: 'rgba(255, 180, 210, ' },
      { fill: 'rgba(255, 80, 120, ', glow: 'rgba(255, 140, 180, ' },
      { fill: 'rgba(255, 215, 140, ', glow: 'rgba(255, 245, 190, ' }
    ];
    this.palette = palette[Math.floor(Math.random() * palette.length)];
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.vx + Math.sin(this.wobble) * this.wobbleRadius;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.alpha);

    const s = this.size / 16;
    ctx.beginPath();
    ctx.moveTo(0, s * -4);
    ctx.bezierCurveTo(s * 7, s * -12, s * 16, s * -2, 0, s * 14);
    ctx.bezierCurveTo(s * -16, s * -2, s * -7, s * -12, 0, s * -4);

    ctx.shadowColor = this.palette.glow + '0.85)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = this.palette.fill + `${this.alpha})`;
    ctx.fill();
    ctx.restore();
  }
}

// ============================================================================
// Render & Animation Loop
// ============================================================================
function animate() {
  requestAnimationFrame(animate);

  state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
  state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

  const parallaxX = (state.mouseX - state.width / 2) * 0.05;
  const parallaxY = (state.mouseY - state.height / 2) * 0.05;

  // Clear Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, state.height);
  skyGrad.addColorStop(0, '#020409');
  skyGrad.addColorStop(0.4, '#040916');
  skyGrad.addColorStop(0.75, '#071126');
  skyGrad.addColorStop(1, '#030814');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, state.width, state.height);

  // Nebulae
  for (const neb of nebulas) {
    neb.x += neb.vx;
    neb.y += neb.vy;
    if (neb.x < 0 || neb.x > state.width) neb.vx *= -1;
    if (neb.y < 0 || neb.y > state.height) neb.vy *= -1;

    const nebGrad = ctx.createRadialGradient(
      neb.x + parallaxX * 0.2,
      neb.y + parallaxY * 0.2,
      neb.radius * 0.1,
      neb.x + parallaxX * 0.2,
      neb.y + parallaxY * 0.2,
      neb.radius
    );
    nebGrad.addColorStop(0, neb.color);
    nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebGrad;
    ctx.beginPath();
    ctx.arc(neb.x + parallaxX * 0.2, neb.y + parallaxY * 0.2, neb.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Moon
  drawRealisticMoon(ctx, parallaxX, parallaxY);

  // Starfield
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    if (star.currentAlphaMultiplier < 1) star.currentAlphaMultiplier += 0.015;

    star.twinklePhase += star.twinkleSpeed;
    const twinkle = Math.sin(star.twinklePhase) * 0.35 + 0.75;
    const alpha = star.baseAlpha * twinkle * star.currentAlphaMultiplier;

    const drawX = star.x + parallaxX * star.z;
    const drawY = star.y + parallaxY * star.z;

    ctx.fillStyle = `${star.baseColor}${Math.min(1, Math.max(0, alpha))})`;
    ctx.beginPath();
    ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floating Stardust Motes
  for (let i = 0; i < celestialDust.length; i++) {
    const d = celestialDust[i];
    d.x += d.vx;
    d.y += d.vy;
    d.pulse += d.pulseSpeed;

    if (d.y < -10) d.y = state.height + 10;
    if (d.x < -10) d.x = state.width + 10;
    if (d.x > state.width + 10) d.x = -10;

    const pulseAlpha = d.alpha * (Math.sin(d.pulse) * 0.3 + 0.7);
    ctx.fillStyle = `rgba(240, 248, 255, ${pulseAlpha})`;
    ctx.beginPath();
    ctx.arc(d.x + parallaxX * 0.4, d.y + parallaxY * 0.4, d.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 1. Chiroq (Glowing pulsating spark)
  if (grandFirework.stage === 'spark') {
    grandFirework.sparkPulse += 0.08;
    const pulseFactor = Math.sin(grandFirework.sparkPulse) * 0.3 + 1;
    const r = grandFirework.sparkRadius * pulseFactor;

    ctx.save();
    const sparkGlow = ctx.createRadialGradient(
      grandFirework.sparkX, grandFirework.sparkY, 0,
      grandFirework.sparkX, grandFirework.sparkY, r * 4.5
    );
    sparkGlow.addColorStop(0, `rgba(255, 255, 255, ${grandFirework.sparkAlpha})`);
    sparkGlow.addColorStop(0.3, `rgba(255, 220, 140, ${grandFirework.sparkAlpha * 0.85})`);
    sparkGlow.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = sparkGlow;
    ctx.beginPath();
    ctx.arc(grandFirework.sparkX, grandFirework.sparkY, r * 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 255, 255, ${grandFirework.sparkAlpha})`;
    ctx.beginPath();
    ctx.arc(grandFirework.sparkX, grandFirework.sparkY, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. Salyut otib (Rocket ascent)
  if (grandFirework.stage === 'launch' && grandFirework.rocket) {
    const rk = grandFirework.rocket;
    rk.trail.push({ x: rk.x, y: rk.y, alpha: 1 });
    rk.y += rk.vy;

    ctx.save();
    const headGlow = ctx.createRadialGradient(rk.x, rk.y, 0, rk.x, rk.y, 16);
    headGlow.addColorStop(0, '#ffffff');
    headGlow.addColorStop(0.3, 'rgba(255, 215, 120, 0.9)');
    headGlow.addColorStop(1, 'rgba(255, 100, 50, 0)');
    ctx.fillStyle = headGlow;
    ctx.beginPath();
    ctx.arc(rk.x, rk.y, 16, 0, Math.PI * 2);
    ctx.fill();

    for (let i = rk.trail.length - 1; i >= 0; i--) {
      const pt = rk.trail[i];
      pt.alpha -= 0.05;
      if (pt.alpha <= 0) {
        rk.trail.splice(i, 1);
      } else {
        ctx.fillStyle = `rgba(255, 230, 160, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x + (Math.random() - 0.5) * 4, pt.y, Math.random() * 2.5 + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    if (rk.y <= rk.targetY) {
      explodeFireworkHeart();
    }
  }

  // 3 & 4. Heart Burst & Morphing into Circle
  if (grandFirework.sparks.length > 0) {
    ctx.save();

    if (grandFirework.stage === 'circle_halo' || grandFirework.morphProgress > 0) {
      grandFirework.haloRotation += 0.0025;
    }

    const cosRot = Math.cos(grandFirework.haloRotation);
    const sinRot = Math.sin(grandFirework.haloRotation);

    for (let i = 0; i < grandFirework.sparks.length; i++) {
      const p = grandFirework.sparks[i];

      const targetRelX = p.heartX + (p.circleX - p.heartX) * grandFirework.morphProgress;
      const targetRelY = p.heartY + (p.circleY - p.heartY) * grandFirework.morphProgress;

      let rotatedTargetX = targetRelX;
      let rotatedTargetY = targetRelY;
      if (grandFirework.morphProgress > 0.8) {
        rotatedTargetX = targetRelX * cosRot - targetRelY * sinRot;
        rotatedTargetY = targetRelX * sinRot + targetRelY * cosRot;
      }

      p.currentX += (rotatedTargetX - p.currentX) * p.speed;
      p.currentY += (rotatedTargetY - p.currentY) * p.speed;

      p.twinkle += p.twinkleSpeed;
      const brightness = Math.sin(p.twinkle) * 0.3 + 0.85;

      const drawX = grandFirework.centerX + p.currentX;
      const drawY = grandFirework.centerY + p.currentY;

      const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.radius * 3.8);
      glow.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * brightness})`);
      glow.addColorStop(0.35, p.color.glow + `${p.alpha * brightness * 0.85})`);
      glow.addColorStop(1, 'rgba(212, 175, 55, 0)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.radius * 3.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * brightness})`;
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.radius * 0.85, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw Mini Fireworks & Floating Hearts
  for (let i = miniFireworks.length - 1; i >= 0; i--) {
    const mf = miniFireworks[i];
    mf.update();
    mf.draw(ctx);
    if (mf.isDead) miniFireworks.splice(i, 1);
  }

  for (let i = heartParticles.length - 1; i >= 0; i--) {
    const h = heartParticles[i];
    h.update();
    h.draw(ctx);
    if (h.alpha <= 0) heartParticles.splice(i, 1);
  }
}

// ============================================================================
// Interactions & Events
// ============================================================================
window.addEventListener('mousemove', (e) => {
  state.targetMouseX = e.clientX;
  state.targetMouseY = e.clientY;
});

window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    state.targetMouseX = e.touches[0].clientX;
    state.targetMouseY = e.touches[0].clientY;
  }
}, { passive: true });

// Click anywhere: launch mini firework + floating hearts with realistic audio!
window.addEventListener('click', (e) => {
  ensureAudioUnlocked();

  if (e.target.closest('button')) return;

  // Mini firework rocket launch + explosion sound
  miniFireworks.push(new MiniFirework(e.clientX, e.clientY));

  // Play heart pop sound
  playHeartPopSound();

  // Spawn floating hearts
  for (let i = 0; i < 6; i++) {
    heartParticles.push(new FloatingHeart(e.clientX, e.clientY));
  }
});

window.addEventListener('touchstart', (e) => {
  ensureAudioUnlocked();

  if (e.target.closest('button')) return;
  if (e.touches.length > 0) {
    const t = e.touches[0];
    miniFireworks.push(new MiniFirework(t.clientX, t.clientY));
    playHeartPopSound();
    for (let i = 0; i < 5; i++) {
      heartParticles.push(new FloatingHeart(t.clientX, t.clientY));
    }
  }
}, { passive: true });

// Buttons
if (btnMusic) {
  btnMusic.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleRomanticMusic();
  });
}

if (btnFirework) {
  btnFirework.addEventListener('click', (e) => {
    e.stopPropagation();
    ensureAudioUnlocked();
    startGrandFireworkSequence();
  });
}

if (btnReplay) {
  btnReplay.addEventListener('click', (e) => {
    e.stopPropagation();
    ensureAudioUnlocked();
    startGrandFireworkSequence();
  });
}

window.addEventListener('resize', resizeCanvas);

// Launch on Window Load
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  requestAnimationFrame(animate);

  // Auto-init audio structure
  initAudioEngine();

  // Unlock audio and start music on the first gesture anywhere
  const unlockOnce = () => {
    ensureAudioUnlocked();
    window.removeEventListener('click', unlockOnce);
    window.removeEventListener('touchstart', unlockOnce);
  };
  window.addEventListener('click', unlockOnce, { once: true });
  window.addEventListener('touchstart', unlockOnce, { once: true });

  // Short romantic pause, then ignite the spark!
  setTimeout(() => {
    startGrandFireworkSequence();
  }, 1000);
});

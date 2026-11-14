/**
 * FAIZAN IQBAL — HIGH-FIDELITY WEB AUDIO SYNTHESIZER ENGINE
 * Architectural 1:1 Implementation of saai.pro (Noir & Crimson Op-Art Soundscape)
 * Features:
 * - 5-Partial Glass Piano Synthesizer with Inharmonic Shimmer (2.756x, 5.4x)
 * - Convolver Stereo Impulse Reverb with Room Decay
 * - Felt Hammer Percussive Noise Strike
 * - Quantized 104 BPM Pentatonic Musical Grid (E-Minor / E-Major Pentatonic)
 * - Atmospheric Intro Swell & Finale Strummed Chords
 * - Mechanical Switch Clacks, Mouse Press Ticks, and Laser Snaps
 * - Seamless Browser Autoplay Handling with "Tap for Sound" UI Synchronization
 */

(function () {
  'use strict';

  const E2 = 40; // MIDI Note 40: E2 (82.41 Hz)
  const PENTA = [0, 2, 4, 7, 9]; // Pentatonic intervals
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const rand = (min, max) => min + Math.random() * (max - min);

  class SoundEngine {
    constructor() {
      this.on = true; // Enabled by default
      this.ctx = null;
      this.bpm = 104;
      this.slots = new Map();
      this.lastKey = new Map();
      this.keyTimes = [];
      this.pressTimes = [];
      this.ends = [];
      this.unlocked = false;
      this.t0 = 0;
      this.hasPlayedIntro = false;
    }

    init() {
      if (this.ctx) return true;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      } catch (err) {
        console.warn('[SoundEngine] AudioContext init error:', err);
        return false;
      }

      const ctx = this.ctx;

      // Dynamics Compressor for studio polish
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-18, ctx.currentTime);
      comp.knee.setValueAtTime(14, ctx.currentTime);
      comp.ratio.setValueAtTime(5, ctx.currentTime);
      comp.attack.setValueAtTime(0.003, ctx.currentTime);
      comp.release.setValueAtTime(0.3, ctx.currentTime);

      // Master output gain
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.92, ctx.currentTime);
      master.connect(comp);

      // On/Off master gate
      const out = ctx.createGain();
      out.gain.setValueAtTime(this.on ? 1 : 0, ctx.currentTime);
      comp.connect(out);
      out.connect(ctx.destination);

      // Convolver Reverb with algorithmic impulse response
      const verb = ctx.createConvolver();
      verb.buffer = this.impulse(3.2, 2.4);

      const wet = ctx.createGain();
      wet.gain.setValueAtTime(0.48, ctx.currentTime);
      verb.connect(wet);
      wet.connect(master);

      this.out = out;
      this.master = master;
      this.verb = verb;
      this.noiseBuf = this.noise(1.5);
      this.t0 = this.now();

      this.syncUI();
      return true;
    }

    now() {
      return this.ctx ? this.ctx.currentTime : performance.now() / 1000;
    }

    // Algorithmic warm stereo room impulse response
    impulse(secs, decay) {
      if (!this.ctx) return null;
      const sr = this.ctx.sampleRate;
      const n = Math.floor(sr * secs);
      const b = this.ctx.createBuffer(2, n, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = b.getChannelData(ch);
        let lp = 0;
        for (let i = 0; i < n; i++) {
          const k = i / n;
          const a = 0.55 - 0.4 * k;
          lp += a * (Math.random() * 2 - 1 - lp);
          d[i] = lp * Math.pow(1 - k, decay) * (i < sr * 0.012 ? i / (sr * 0.012) : 1);
        }
      }
      return b;
    }

    // Generated noise buffer for mechanical hits and felt hammer
    noise(secs) {
      if (!this.ctx) return null;
      const sr = this.ctx.sampleRate;
      const b = this.ctx.createBuffer(1, Math.floor(sr * secs), sr);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = Math.random() * 2 - 1;
      }
      return b;
    }

    get blocked() {
      return !this.ctx || this.ctx.state !== 'running';
    }

    ready() {
      return !!this.ctx && this.on && this.ctx.state === 'running';
    }

    resume() {
      if (!this.ctx) this.init();
      if (!this.ctx) return Promise.resolve();

      if (this.ctx.state === 'suspended') {
        return this.ctx.resume().then(() => {
          this.unlocked = true;
          this.syncUI();
          if (!this.hasPlayedIntro) {
            this.hasPlayedIntro = true;
            this.intro();
            this.start();
          }
        }).catch(err => console.warn('[SoundEngine] Resume blocked:', err));
      } else if (this.ctx.state === 'running') {
        this.unlocked = true;
        this.syncUI();
        if (!this.hasPlayedIntro) {
          this.hasPlayedIntro = true;
          this.start();
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    }

    setOn(on) {
      this.on = on;
      if (!this.ctx) this.init();
      if (this.ctx) {
        const t = this.ctx.currentTime;
        this.out.gain.cancelScheduledValues(t);
        this.out.gain.setTargetAtTime(on ? 1 : 0, t, 0.04);
        if (on && this.blocked) {
          this.resume();
        }
      }
      this.syncUI();
    }

    toggle() {
      if (this.blocked) {
        this.setOn(true);
        this.resume();
        if (typeof showToast === 'function') showToast('Sound System Activated [M]');
      } else {
        const nextState = !this.on;
        this.setOn(nextState);
        if (typeof showToast === 'function') {
          showToast(nextState ? 'Sound System Activated [M]' : 'Sound System Muted');
        }
      }
      this.syncUI();
    }

    syncUI() {
      const isBlocked = this.blocked;
      const isOn = this.on;
      const isActivelyPlaying = isOn && !isBlocked;

      // 1. Top Navbar Button
      const dockBtn = document.getElementById('audioToggle');
      if (dockBtn) {
        dockBtn.classList.toggle('active', isActivelyPlaying);
        dockBtn.classList.toggle('tap', isOn && isBlocked);
        const icon = dockBtn.querySelector('#audioIcon');
        const txt = dockBtn.querySelector('.sound-text');
        if (icon) {
          icon.className = !isOn ? 'fa-solid fa-volume-xmark' : (isBlocked ? 'fa-solid fa-volume-low' : 'fa-solid fa-volume-high');
        }
        if (txt) {
          txt.textContent = !isOn ? 'SOUND [OFF]' : (isBlocked ? 'TAP FOR SOUND' : 'SOUND [ON]');
        }
      }

      // 2. Swarm HUD Button
      const hudBtn = document.getElementById('swarmSoundBtn');
      if (hudBtn) {
        hudBtn.classList.toggle('active', isActivelyPlaying);
        hudBtn.classList.toggle('tap', isOn && isBlocked);
        const txt = hudBtn.querySelector('span');
        if (txt) {
          txt.textContent = !isOn ? 'Sound [OFF]' : (isBlocked ? 'Tap for sound' : 'Sound [ON]');
        }
      }
    }

    pan(x, vw) {
      return clamp((x / Math.max(1, vw || window.innerWidth)) * 1.6 - 0.8, -0.8, 0.8);
    }

    bus(when, pan = 0, send = 0.5) {
      if (!this.ctx) return null;
      const g = this.ctx.createGain();

      if (this.ctx.createStereoPanner) {
        const p = this.ctx.createStereoPanner();
        p.pan.setValueAtTime(clamp(pan, -0.85, 0.85), when);
        g.connect(p);
        p.connect(this.master); // Dry path
        if (send && this.verb) {
          const s = this.ctx.createGain();
          s.gain.setValueAtTime(send, when);
          p.connect(s);
          s.connect(this.verb); // Wet path
        }
      } else {
        g.connect(this.master);
        if (send && this.verb) {
          const s = this.ctx.createGain();
          s.gain.setValueAtTime(send, when);
          g.connect(s);
          s.connect(this.verb);
        }
      }
      return g;
    }

    // Grid quantizer (104 BPM, 16th notes)
    grid(div = 4) {
      const step = 60 / this.bpm / div;
      const now = this.now() + 0.015;
      const k = Math.ceil((now - this.t0) / step);
      return { when: this.t0 + k * step, slot: `${div}:${k}` };
    }

    // Glass piano: 5 partials + felt hammer tick + long exponential tail
    piano(midi, when, vel = 1, pan = 0, ring = 2.4) {
      if (!this.ready()) return;
      if (!when) when = this.now();
      const now = this.now();
      this.ends = this.ends.filter(e => e > now);
      if (this.ends.length >= 28) return;

      const ctx = this.ctx;
      const f = mtof(midi);
      const v = this.bus(when, pan, 0.85);
      if (!v) return;
      v.gain.setValueAtTime(0.32 * vel, when);

      const hi = f > 900;
      const parts = [
        [1, 1, 1],
        [2, 0.38, 0.55],
        [3, 0.12, 0.32],
        [2.756, 0.16, 0.42], // Glass inharmonic overtone
        [5.4, 0.05, 0.16]    // Shimmer sparkle
      ];

      let last = null;
      for (const [r, a, d] of parts) {
        if (f * r > 16000) continue;
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(f * r * (1 + (Math.random() - 0.5) * 0.002), when);

        const g = ctx.createGain();
        const dec = ring * d * (hi ? 0.65 : 1);
        g.gain.setValueAtTime(0, when);
        g.gain.linearRampToValueAtTime(a, when + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0006, when + dec);

        o.connect(g);
        g.connect(v);
        o.start(when);
        o.stop(when + dec + 0.05);
        last = o;
      }

      this.hammer(when, v, f, 0.5);
      this.ends.push(when + ring * (hi ? 0.65 : 1));
      if (last) {
        last.onended = () => {
          try { v.disconnect(); } catch (_) {}
        };
      }
    }

    hammer(when, dest, f, amt = 0.5) {
      if (!this.ctx || !this.noiseBuf) return;
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(Math.min(9000, f * 4 + 1200), when);
      bp.Q.setValueAtTime(1.2, when);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(0.25 * amt, when + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0005, when + 0.03);

      src.connect(bp);
      bp.connect(g);
      g.connect(dest);
      src.start(when, Math.random());
      src.stop(when + 0.05);
    }

    tick(when, pan, freq, q, vel, len) {
      if (!this.ctx || !this.noiseBuf) return;
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(freq, when);
      bp.Q.setValueAtTime(q, when);

      const g = this.bus(when, pan, 0.06);
      if (!g) return;
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(vel, when + 0.0008);
      g.gain.exponentialRampToValueAtTime(0.0004, when + len);

      src.connect(bp);
      bp.connect(g);
      src.start(when, Math.random() * 1.2);
      src.stop(when + len + 0.02);
      src.onended = () => {
        try { g.disconnect(); } catch (_) {}
      };
    }

    // Mechanical keyboard keypress
    clack(when, pan, space, vel = 1) {
      this.tick(when, pan, rand(3600, 5600), 2.2, rand(0.2, 0.3) * vel, rand(0.006, 0.011));
      this.tick(when + rand(0.001, 0.005), pan, space ? rand(380, 560) : rand(850, 1500), 1.6, (space ? 0.26 : rand(0.13, 0.2)) * vel, space ? 0.065 : rand(0.025, 0.042));
    }

    // Mouse button click
    press(x, vw) {
      if (!this.ready()) return;
      vw = vw || window.innerWidth;
      const t = this.now();
      this.pressTimes = this.pressTimes.filter(k => t - k < 1);
      if (this.pressTimes.length > 40) return;
      this.pressTimes.push(t);
      const pan = this.pan(x, vw);
      this.tick(t + 0.004, pan, rand(2100, 2700), 4, 0.32, 0.012);
      this.tick(t + 0.005, pan, rand(650, 850), 2, 0.16, 0.022);
      this.tick(t + rand(0.055, 0.075), pan, rand(2900, 3400), 4, 0.15, 0.008);
    }

    // Laser alignment guide snap
    snap(x, vw) {
      if (!this.ready()) return;
      vw = vw || window.innerWidth;
      const t = this.now() + 0.004;
      const pan = this.pan(x, vw);
      this.tick(t, pan, 4800, 3, 0.36, 0.012);
      this.tick(t + 0.002, pan, 1200, 2, 0.2, 0.03);
    }

    // Finished element chord placement
    place(kind, x, y, w, h, vw, vh) {
      if (!this.ready()) return;
      vw = vw || window.innerWidth;
      vh = vh || window.innerHeight;

      const area = (w * h) / Math.max(1, vw * vh);
      let oct;
      if (kind === 'guide') oct = 5;
      else oct = area > 0.08 ? 1 : area > 0.015 ? 2 : area > 0.002 ? 3 : 4;

      const deg = Math.floor(clamp(x / Math.max(1, vw), 0, 0.999) * 5);
      const midi = E2 + oct * 12 + PENTA[deg];
      const { when, slot } = this.grid(2);

      const seen = this.slots.get(slot) || [];
      if (seen.length >= 2) return;
      seen.push(midi);
      this.slots.set(slot, seen);
      if (this.slots.size > 64) this.slots.delete(this.slots.keys().next().value);

      const off = (y < -40 || y > vh + 40) ? 0.45 : 1;
      const pan = this.pan(x, vw);
      const vel = ({ rect: 0.55, image: 0.5, dup: 0.5, guide: 0.3, restyle: 0.34 }[kind] || 0.42) * 0.48;
      const ring = oct <= 1 ? 3.6 : oct >= 4 ? 1.6 : 2.4;

      this.piano(midi, when, vel * off, pan, ring);
      if (kind === 'image') {
        this.piano(midi + (PENTA[(deg + 2) % 5] - PENTA[deg] + 12) % 12, when + 0.04, vel * 0.6 * off, pan, ring);
      }
    }

    // Airy intro swell over open fifths
    intro() {
      if (!this.ready() || !this.noiseBuf) return;
      const ctx = this.ctx;
      const t = this.now() + 0.02;

      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      src.loop = true;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.setValueAtTime(0.8, t);
      bp.frequency.setValueAtTime(260, t);
      bp.frequency.exponentialRampToValueAtTime(2400, t + 0.9);
      bp.frequency.exponentialRampToValueAtTime(900, t + 1.8);

      const g = this.bus(t, 0, 0.6);
      if (!g) return;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.7);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 2.2);

      src.connect(bp);
      bp.connect(g);
      src.start(t);
      src.stop(t + 2.3);
      src.onended = () => {
        try { g.disconnect(); } catch (_) {}
      };

      for (const [m, d] of [[E2, 0], [E2 + 7, 0.08], [E2 + 12, 0.16]]) {
        this.pad(m, t + 0.3 + d, 0.07, 2.6);
      }
    }

    pad(midi, when, vel, len) {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const g = this.bus(when, 0, 0.9);
      if (!g) return;
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(vel, when + len * 0.4);
      g.gain.exponentialRampToValueAtTime(0.0005, when + len);

      for (const det of [-4, 4]) {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(mtof(midi), when);
        o.detune.setValueAtTime(det, when);
        o.connect(g);
        o.start(when);
        o.stop(when + len + 0.05);
      }
    }

    // Swarm start arpeggio
    start() {
      if (!this.ready()) return;
      const { when } = this.grid(4);
      const step = 60 / this.bpm / 4;
      [E2 + 24, E2 + 28, E2 + 31, E2 + 36, E2 + 40].forEach((m, i) => {
        this.piano(m, when + i * step, 0.22, -0.5 + i * 0.25, 2.2);
      });
    }

    // Swarm completion finale chord: E major add9
    finale() {
      if (!this.ready()) return;
      const { when } = this.grid(2);
      const chord = [E2, E2 + 7, E2 + 12, E2 + 16, E2 + 19, E2 + 26, E2 + 28, E2 + 31, E2 + 36, E2 + 43];
      chord.forEach((m, i) => {
        this.piano(m, when + i * 0.035, 0.34 - i * 0.015, -0.6 + (i / chord.length) * 1.2, 5.5);
      });
      this.pad(E2 + 12, when, 0.05, 5);
    }
  }

  // Create global singleton
  window.globalSound = new SoundEngine();

  // Pre-initialize on script execution
  window.globalSound.init();

  // Instant unlock listeners on any user interaction
  const unlockEvents = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
  const unlockHandler = () => {
    if (window.globalSound) {
      if (window.globalSound.blocked) {
        window.globalSound.resume();
      }
    }
  };

  unlockEvents.forEach(evt => {
    window.addEventListener(evt, unlockHandler, { passive: true });
  });

  // 'M' Keyboard Shortcut for Sound Mute / Unmute
  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      if (!['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        if (window.globalSound) window.globalSound.toggle();
      }
    }
  });

  // Periodic UI synchronizer in case state changes
  setInterval(() => {
    if (window.globalSound) window.globalSound.syncUI();
  }, 400);

})();

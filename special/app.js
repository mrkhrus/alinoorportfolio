/**
 * ALI NOOR PORTFOLIO
 * Modern Vanilla JavaScript — Noir & Crimson Ambient Canvas, Interactive 5-Stage Engineering Arsenal, Bento Filter & Clipboard
 */

(function () {
  'use strict';

  // ==========================================================================
  // 5-STAGE ENGINEERING & ARCHITECTURE FRAMEWORK DATA
  // ==========================================================================
  const LAYER_DATA = {
    1: {
      badge: 'STAGE 01 // CORE WEB ENGINEERING',
      title: 'Full-Stack Web Architecture & Responsive Systems',
      desc: 'Engineering high-performance web applications using modern HTML5, CSS3, JavaScript (ES6+), React, and Python backend services. Passionate about fluid user interfaces, clean modular design, and robust API integration.',
      tags: ['JavaScript (ES6+)', 'HTML5 & CSS3', 'React', 'Python & Flask', 'REST APIs', 'Git Workflow']
    },
    2: {
      badge: 'STAGE 02 // CYBER & FORENSICS',
      title: 'Digital Forensics, Packet Analysis & Evidence Extraction',
      desc: 'Specialized training in forensic investigation methodologies, mobile extraction, and network auditing using industry-standard tools including Cellebrite UFED, FTK Imager, Wireshark, and Cisco Packet Tracer.',
      tags: ['Cellebrite UFED', 'FTK Imager', 'Wireshark', 'Packet Tracer', 'Evidence Integrity', 'Linux Security']
    },
    3: {
      badge: 'STAGE 03 // APPLIED AI & SYSTEMS',
      title: 'NOAH AI Final Year Project & Chrome Extensions',
      desc: 'Architecting NOAH AI — an intelligent, multi-model AI Chrome Extension integrating leading language model APIs to deliver real-time webpage contextualization, intelligent synthesis, and workflow automation.',
      tags: ['Chrome Extensions API', 'Multi-Model AI APIs', 'Context Injection', 'Prompt Systems', 'DOM Automation']
    },
    4: {
      badge: 'STAGE 04 // SMART INFRASTRUCTURE',
      title: 'IoT & Smart Metering Operations Supervision',
      desc: 'Field and systems experience with MicroTech Industries in the MEPCO region, supervising the deployment, operational verification, and data synchronization of over 5,600+ smart meters.',
      tags: ['5,600+ Smart Meters', 'MicroTech Systems', 'MEPCO Grid', 'Field Supervision', 'Data Verification', 'IoT Protocols']
    },
    5: {
      badge: 'STAGE 05 // CREATIVE DIRECTION',
      title: 'Pixel Tap Creative Studio & Digital Growth Strategy',
      desc: 'Founder and creative director at Pixel Tap. Driving end-to-end digital branding, UI/UX conceptualization, client web design, social media strategy, and digital marketing campaigns.',
      tags: ['Pixel Tap Studio', 'Brand Identity', 'UI/UX Design', 'Digital Marketing', 'SEO Strategy', 'Client Delivery']
    }
  };

  // ==========================================================================
  // AMBIENT NOIR & CRIMSON OP-ART CANVAS (Optimized with Hero IntersectionObserver)
  // ==========================================================================
  function initAuroraCanvas() {
    const canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let animationFrameId = null;
    let isRunning = false;
    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    let frame = 0;

    // Atmospheric Crimson Orbs (Red & Noir focus)
    const orbs = [
      { x: 0.35, y: 0.40, radius: 0.50, vx: 0.0003, vy: 0.0002, color: 'rgba(239, 68, 68, 0.14)' }, // Crimson Red
      { x: 0.70, y: 0.45, radius: 0.42, vx: -0.0002, vy: 0.0003, color: 'rgba(185, 28, 28, 0.10)' }, // Deep Blood Red
      { x: 0.50, y: 0.80, radius: 0.48, vx: 0.0002, vy: -0.0002, color: 'rgba(255, 255, 255, 0.03)' }  // Ghost Monochrome
    ];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX / width;
      mouse.targetY = e.clientY / height;
    }, { passive: true });

    function render() {
      if (!isRunning) return;
      frame++;

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < 0.1 || orb.x > 0.9) orb.vx *= -1;
        if (orb.y < 0.1 || orb.y > 0.9) orb.vy *= -1;

        const px = (orb.x + (mouse.x - 0.5) * 0.08) * width;
        const py = (orb.y + (mouse.y - 0.5) * 0.08) * height;
        const rad = orb.radius * Math.min(width, height);

        const grad = ctx.createRadialGradient(px, py, 0, px, py, rad);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(5, 5, 5, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    function start() {
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    }

    function stop() {
      if (isRunning) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      }
    }

    const heroSection = document.getElementById('hero');
    if ('IntersectionObserver' in window && heroSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
          } else {
            stop();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    } else {
      start();
    }
  }

  // ==========================================================================
  // INTERACTIVE 5-STAGE ENGINEERING FRAMEWORK EXPLORER
  // ==========================================================================
  function initLayerExplorer() {
    const tabs = document.querySelectorAll('.layer-tab');
    const badgeEl = document.getElementById('layer-inspect-id');
    const titleEl = document.getElementById('layer-inspect-title');
    const descEl = document.getElementById('layer-inspect-desc');
    const tagsEl = document.getElementById('layer-inspect-tags');

    if (!tabs.length || !badgeEl || !titleEl || !descEl || !tagsEl) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const layerId = tab.getAttribute('data-layer');
        const data = LAYER_DATA[layerId];

        if (data) {
          badgeEl.textContent = data.badge;
          titleEl.textContent = data.title;
          descEl.textContent = data.desc;

          tagsEl.innerHTML = '';
          data.tags.forEach((tagText) => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tagText;
            tagsEl.appendChild(span);
          });
        }
      });
    });
  }

  // ==========================================================================
  // BENTO GRID FILTER CONTROLS
  // ==========================================================================
  function initBentoFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn:not(.cred-filter-btn)');
    const cards = document.querySelectorAll('.bento-card');

    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // CREDENTIALS FILTER CONTROLS
  // ==========================================================================
  function initCredentialsFilter() {
    const credFilterBtns = document.querySelectorAll('.cred-filter-btn');
    const credCards = document.querySelectorAll('.cred-card');

    if (!credFilterBtns.length || !credCards.length) return;

    credFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        credFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-cred-filter');

        credCards.forEach((card) => {
          const org = card.getAttribute('data-org');
          if (filter === 'all' || org === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // COPY-TO-CLIPBOARD WITH TOAST NOTIFICATION
  // ==========================================================================
  function initClipboardToast() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout = null;

    if (!copyButtons.length || !toast) return;

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
          }

          if (toastMessage) {
            toastMessage.textContent = `Copied to clipboard: ${textToCopy}`;
          }

          toast.classList.add('visible');

          if (toastTimeout) clearTimeout(toastTimeout);
          toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
          }, 3500);

        } catch (err) {
          console.error('Clipboard copy failed:', err);
        }
      });
    });
  }

  // ==========================================================================
  // CV / RESUME MODAL
  // ==========================================================================
  function initCvModal() {
    const modal = document.getElementById('cv-modal');
    const openBtns = document.querySelectorAll('.open-cv-btn');
    const closeBtn = document.getElementById('cv-modal-close-btn');

    if (!modal) return;

    function openModal() {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ==========================================================================
  // INITIALIZATION ON DOM CONTENT LOADED
  // ==========================================================================
  function init() {
    initAuroraCanvas();
    initLayerExplorer();
    initBentoFilter();
    initCredentialsFilter();
    initClipboardToast();
    initCvModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

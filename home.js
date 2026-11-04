/* ============================================
   ALI NOOR — PORTFOLIO JAVASCRIPT
   Animations, Interactions & Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ RESUME STYLE DOWNLOADS ============
    const resumeMenu = document.querySelector('.resume-menu');
    const resumeMenuButton = document.getElementById('resumeMenuButton');
    const resumeOptions = document.getElementById('resumeOptions');
    const resumeStyles = {
        ats: { name: 'ATS Professional', accent: [20, 20, 20], header: [20, 20, 20], layout: 'clean' },
        technical: { name: 'Technical Resume', accent: [0, 150, 210], header: [9, 18, 30], layout: 'technical' },
        creative: { name: 'Creative Resume', accent: [124, 58, 237], header: [38, 20, 63], layout: 'creative' },
        founder: { name: 'Founder Resume', accent: [37, 211, 102], header: [10, 35, 25], layout: 'founder' },
        editorial: { name: 'Editorial Resume', accent: [180, 70, 50], header: [45, 28, 22], layout: 'editorial' }
    };

    const getResumeData = () => ({
        name: 'Ali Noor',
        role: 'Web Developer | Entrepreneur | Digital Marketing Specialist',
        location: 'Multan, Pakistan',
        email: 'contact@alinoordhuddi.me',
        phone: '+92 302 7700990',
        summary: document.querySelector('.hero-description')?.innerText.trim() || 'Computer Science student, founder, and digital builder creating useful web experiences.',
        experience: [...document.querySelectorAll('.timeline-item')].map(item => ({
            title: item.querySelector('.timeline-header h3')?.innerText.trim() || '',
            company: item.querySelector('.timeline-company')?.innerText.trim() || '',
            date: item.querySelector('.timeline-date')?.innerText.trim() || '',
            details: [...item.querySelectorAll('.timeline-points li')].map(point => point.innerText.trim())
        })),
        skills: [...document.querySelectorAll('.skill-category')].map(item => item.querySelector('h3')?.innerText.trim()).filter(Boolean),
        projects: [...document.querySelectorAll('.project-card')].map(item => ({
            name: item.querySelector('.project-title')?.innerText.trim() || '',
            description: item.querySelector('.project-description')?.innerText.trim() || ''
        })),
        certificates: [...document.querySelectorAll('.certificate-card')].slice(0, 17).map(item => ({
            name: item.querySelector('h4')?.innerText.trim() || '',
            link: item.querySelector('.cert-verify')?.href || ''
        })).filter(item => item.name)
    });

    const addWrappedText = (doc, text, x, y, width, lineHeight = 5) => {
        const lines = doc.splitTextToSize(text, width);
        doc.text(lines, x, y);
        return y + lines.length * lineHeight;
    };

    const createResume = (styleKey) => {
        if (!window.jspdf?.jsPDF) return;
        const style = resumeStyles[styleKey];
        const data = getResumeData();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const pageWidth = 210;
        const margin = 18;
        let y = 18;

        doc.setFillColor(...style.header);
        doc.rect(0, 0, pageWidth, 42, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(style.layout === 'editorial' ? 28 : 23);
        doc.text(data.name, margin, y + 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(data.role, margin, y + 19);
        doc.text(`${data.location}  |  ${data.email}  |  ${data.phone}`, margin, y + 27);
        y = 54;

        const heading = (label) => {
            doc.setTextColor(...style.accent);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(label.toUpperCase(), margin, y);
            doc.setDrawColor(...style.accent);
            doc.line(margin, y + 2, pageWidth - margin, y + 2);
            y += 10;
        };
        const body = (text, size = 9) => {
            doc.setTextColor(45, 45, 45);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(size);
            y = addWrappedText(doc, text, margin, y, pageWidth - margin * 2, 4.5) + 3;
        };

        heading('Profile');
        body(data.summary);
        heading('Experience');
        data.experience.forEach(item => {
            doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(item.title, margin, y); y += 5;
            doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.text(`${item.company}  |  ${item.date}`, margin, y); y += 5;
            item.details.slice(0, 3).forEach(detail => { doc.setFont('helvetica', 'normal'); doc.setFontSize(8); y = addWrappedText(doc, `• ${detail}`, margin + 3, y, pageWidth - margin * 2 - 3, 4) + 1; });
            y += 3;
            if (y > 270) { doc.addPage(); y = 20; }
        });
        heading('Skills');
        body(data.skills.join('  •  '));
        heading('Selected Projects');
        data.projects.forEach(project => { doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(project.name, margin, y); y += 4; body(project.description, 8); });
        heading('Certificates and Verification');
        data.certificates.forEach(certificate => { doc.setTextColor(40, 40, 40); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.text(certificate.name, margin, y); if (certificate.link) { doc.setTextColor(...style.accent); doc.textWithLink('Verify', pageWidth - margin - 18, y, { url: certificate.link }); } y += 4.5; if (y > 280) { doc.addPage(); y = 20; } });

        doc.setProperties({ title: `${data.name} - ${style.name}`, author: data.name, subject: style.name });
        doc.save(`Ali-Noor-${styleKey}-resume.pdf`);
    };

    resumeMenuButton?.addEventListener('click', () => {
        const open = resumeMenu.classList.toggle('open');
        resumeMenuButton.setAttribute('aria-expanded', String(open));
    });
    resumeOptions?.querySelectorAll('[data-resume-style]').forEach(option => option.addEventListener('click', () => {
        createResume(option.dataset.resumeStyle);
        resumeMenu.classList.remove('open');
        resumeMenuButton?.setAttribute('aria-expanded', 'false');
    }));

    document.querySelectorAll('.dstp-verify').forEach(link => {
        link.addEventListener('click', () => {
            const certificateId = link.dataset.certificateId;
            if (!certificateId) return;
            const copyTask = navigator.clipboard?.writeText(certificateId);
            if (!copyTask) {
                window.prompt('Copy this DigiSkills certificate ID:', certificateId);
                return;
            }
            copyTask.then(() => {
                link.dataset.status = `ID ${certificateId} copied`;
            }).catch(() => {
                window.prompt('Copy this DigiSkills certificate ID:', certificateId);
            });
        });
    });

    // ============ PRELOADER ============
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback in case load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => preloader.classList.add('hidden'), 800);
    }

    // ============ CUSTOM CURSOR ============
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 4 + 'px';
            cursor.style.top = e.clientY - 4 + 'px';
            follower.style.left = e.clientX - 18 + 'px';
            follower.style.top = e.clientY - 18 + 'px';
        });

        // Enlarge on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-category, .stat-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.width = '50px';
                follower.style.height = '50px';
                follower.style.left = parseFloat(follower.style.left) - 7 + 'px';
                follower.style.top = parseFloat(follower.style.top) - 7 + 'px';
                follower.style.borderColor = 'rgba(124, 58, 237, 0.6)';
            });
            el.addEventListener('mouseleave', () => {
                follower.style.width = '36px';
                follower.style.height = '36px';
                follower.style.borderColor = 'rgba(0, 212, 255, 0.5)';
            });
        });
    }

    // ============ NAVIGATION ============
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    const handleNavScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll);

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const setActiveLink = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    };
    window.addEventListener('scroll', setActiveLink);

    // Move the hero particle field left as the page approaches Skills.
    const heroBackground = document.querySelector('.hero-bg-animation');
    const heroSection = document.getElementById('hero');
    const experienceSection = document.getElementById('experience');
    let scrollFrame;
    const updateHeroDrift = () => {
        if (!heroBackground || !heroSection || !experienceSection) return;
        const start = heroSection.offsetTop;
        const distance = Math.max(experienceSection.offsetTop - start, 1);
        const progress = Math.min(Math.max((window.scrollY - start) / distance, 0), 1);
        heroBackground.style.transform = `translate3d(${-progress * 180}px, 0, 0)`;
        heroBackground.style.opacity = String(1 - progress);
        heroBackground.classList.toggle('is-hidden', experienceSection.getBoundingClientRect().top <= window.innerHeight * 0.95);
        scrollFrame = undefined;
    };
    window.addEventListener('scroll', () => {
        if (scrollFrame === undefined) scrollFrame = window.requestAnimationFrame(updateHeroDrift);
    }, { passive: true });
    updateHeroDrift();
    const experienceObserver = new IntersectionObserver(([entry]) => {
        heroBackground.classList.toggle('is-hidden', entry.isIntersecting);
    }, { threshold: 0.05 });
    experienceObserver.observe(experienceSection);

    // ============ TYPING EFFECT ============
    const typingElement = document.getElementById('typingText');
    const titles = [
        'Web Developer',
        'Entrepreneur',
        'Creative Designer',
        'Digital Marketer',
        'Owner of Pixel Tap'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeText() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typingElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 400; // Pause before typing next
        }

        setTimeout(typeText, typingSpeed);
    }
    typeText();

    // ============ PARTICLE CANVAS ============
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        }
        animateParticles();

    }

    // ============ SCROLL REVEAL ANIMATIONS ============
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle delay classes
                const delays = ['delay-1', 'delay-2', 'delay-3'];
                let delay = 0;
                delays.forEach((cls, i) => {
                    if (entry.target.classList.contains(cls)) {
                        delay = (i + 1) * 150;
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============ SKILL BAR ANIMATION ============
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ============ BACK TO TOP ============
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============ CONTACT FORM ============
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Create mailto link
        const mailtoLink = `mailto:contact@alinoordhuddi.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.location.href = mailtoLink;

        // Show success feedback
        const btn = contactForm.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #28c840, #06b6d4)';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });

    // ============ CERTIFICATE PDF RENDERING ============
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const certCanvases = document.querySelectorAll('.cert-canvas');
        certCanvases.forEach(canvas => {
            const pdfUrl = canvas.getAttribute('data-pdf');
            if (pdfUrl) {
                renderPdfThumbnail(pdfUrl, canvas);
            }
        });

        async function renderPdfThumbnail(url, canvas) {
            try {
                const pdf = await pdfjsLib.getDocument(url).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1 });

                // Scale to fit canvas container
                const containerWidth = canvas.parentElement.offsetWidth || 400;
                const scale = containerWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale: scale * 2 }); // 2x for retina

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;
                canvas.style.width = '100%';
                canvas.style.height = 'auto';

                const ctx = canvas.getContext('2d');
                await page.render({
                    canvasContext: ctx,
                    viewport: scaledViewport
                }).promise;
            } catch (err) {
                console.warn('PDF render failed for:', url, err);
                // Show fallback
                const parent = canvas.parentElement;
                parent.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-muted);gap:8px;">
                    <i class="fas fa-file-pdf" style="font-size:2.5rem;color:var(--accent-1);"></i>
                    <span style="font-size:0.85rem;">PDF Certificate</span>
                </div>`;
            }
        }

        // Certificate Modal
        const certModal = document.getElementById('certModal');
        const certModalCanvas = document.getElementById('certModalCanvas');
        const certModalClose = document.getElementById('certModalClose');
        const certModalOverlay = certModal.querySelector('.cert-modal-overlay');
        const certModalDownload = document.getElementById('certModalDownload');
        const certModalVerify = document.getElementById('certModalVerify');

        document.querySelectorAll('.certificate-card').forEach(card => {
            card.addEventListener('click', async (e) => {
                // Don't open modal if clicking verify link
                if (e.target.closest('.cert-verify')) return;

                const canvas = card.querySelector('.cert-canvas');
                if (!canvas) return;
                const pdfUrl = canvas.getAttribute('data-pdf');
                if (!pdfUrl) return;

                // Show modal
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Set download link
                certModalDownload.href = pdfUrl;

                // Set verify link
                const verifyLink = card.querySelector('.cert-verify');
                if (verifyLink) {
                    certModalVerify.href = verifyLink.href;
                    certModalVerify.style.display = '';
                } else {
                    certModalVerify.style.display = 'none';
                }

                // Render full-size PDF in modal
                try {
                    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                    const page = await pdf.getPage(1);
                    const viewport = page.getViewport({ scale: 2 });
                    certModalCanvas.width = viewport.width;
                    certModalCanvas.height = viewport.height;
                    const ctx = certModalCanvas.getContext('2d');
                    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                } catch (err) {
                    console.warn('Modal PDF render failed:', err);
                }
            });
        });

        const closeModal = () => {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        };
        certModalClose.addEventListener('click', closeModal);
        certModalOverlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ============ CERTIFICATE FILTER ============
    const certFilters = document.querySelectorAll('.cert-filter');
    const certCards = document.querySelectorAll('.certificate-card');

    certFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            certFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            certCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============ SMOOTH SCROLL FOR ALL ANCHOR LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============ TILT EFFECT ON PROJECT CARDS ============
    if (window.matchMedia('(pointer: fine)').matches) {
        const cards = document.querySelectorAll('.project-card-inner, .skill-category');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

});

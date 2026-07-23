// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Mencegah browser lompat ke posisi scroll sebelumnya saat di-refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {

    // Kunci scroll saat preloader
    document.body.style.overflow = 'hidden';

    // Initial setup to prevent flash sebelum efek masuk
    gsap.set(".hero-bg-text", { opacity: 0, scale: 0.95 });
    gsap.set(".hero-greeting, .hero-title, .hero-role, .hero-desc, .hero-globe", { opacity: 0, x: -30 });
    gsap.set(".hero-image-wrapper img", { opacity: 0, y: 50, scale: 0.95 });
    gsap.set(".stat-item, .hero-motto", { opacity: 0, x: 30 });

    // --- AUDIO SYSTEM (WEB AUDIO API) ---
    let audioCtx;
    function playBeep(freq = 600, type = 'square', duration = 0.05, vol = 0.02) {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { }
    }

    // --- SYSTEM ERROR PRELOADER ---
    const preloaderTl = gsap.timeline({
        paused: true,
        onComplete: () => {
            document.body.style.overflow = ''; // Lepas scroll
            // Hilangkan preloader box dari DOM visual
            gsap.to(".system-preloader", {
                opacity: 0,
                duration: 0.4,
                display: "none",
                onComplete: startPageEnterAnimation // Mulai transisi masuk ke web
            });
        }
    });

    // Mengetik log terminal bermuatan error/glitch
    const lineElements = document.querySelectorAll(".console-line");
    preloaderTl.to(lineElements, {
        opacity: 1,
        duration: 0.05,
        stagger: {
            each: 0.6, // Jeda per baris
            onStart: function () {
                // Mainkan suara saat baris muncul
                // Jika line ini adalah error merah (indeks 2), bunyikan error
                const targetEl = this.targets()[0];
                if (targetEl && targetEl.classList.contains("error-text")) {
                    playBeep(120, 'sawtooth', 0.6, 0.1); // Suara buzz
                    setTimeout(() => playBeep(180, 'square', 0.4, 0.1), 100);
                } else {
                    playBeep(800, 'square', 0.05, 0.02); // Suara beep ketik normal
                }
            }
        },
        ease: "none"
    }, "+=0.3");

    // Menghitung persentase bar 0-100%
    let loadCounter = { val: 0 };
    preloaderTl.to(loadCounter, {
        val: 100,
        duration: 6.0, // Total waktu loading error system
        ease: "power1.inOut",
        onUpdate: function () {
            const percent = Math.round(loadCounter.val);
            document.querySelector(".loading-percentage").innerText = percent + "%";
            document.querySelector(".loading-bar").style.width = percent + "%";
        }
    }, 0.5); // Mulai loading bar sedikit setelah baris pertama terminal keluar

    // --- INIT BOOT SEQUENCE ---
    const bootBtn = document.querySelector(".btn-boot");
    const bootScreen = document.querySelector(".boot-screen");

    if (bootBtn) {
        // Efek layer mau rusak pas kursor mendekat
        bootBtn.addEventListener("mouseenter", () => {
            bootScreen.classList.add("hover-screen-glitch");
            try {
                if (audioCtx && audioCtx.state !== 'suspended') playBeep(200, 'square', 0.1, 0.05);
            } catch (e) { }
        });

        bootBtn.addEventListener("mouseleave", () => {
            bootScreen.classList.remove("hover-screen-glitch");
        });

        bootBtn.addEventListener("click", () => {
            // Aktifkan Audio Context akibat User Gesture
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            // Hilangkan layar boot
            gsap.to(".boot-screen", {
                opacity: 0,
                duration: 0.2,
                display: "none",
                onComplete: () => {
                    // Munculkan foto portofolio pengguna yang sedang glitching
                    const glitchBgs = document.querySelector(".profile-glitch-container");
                    glitchBgs.style.display = "block";

                    // Mainkan suara keras dan kacau beberapa kali
                    playBeep(200, 'sawtooth', 0.3, 0.2);
                    setTimeout(() => playBeep(100, 'square', 0.4, 0.3), 500);
                    setTimeout(() => playBeep(350, 'sawtooth', 0.7, 0.2), 1200);
                    setTimeout(() => playBeep(150, 'square', 0.5, 0.3), 2000);
                    setTimeout(() => playBeep(80, 'sawtooth', 0.4, 0.4), 2800);
                    setTimeout(() => playBeep(400, 'square', 0.6, 0.2), 3400);

                    // Berjalan selama 4 detik, lalu hentikan dan jalankan Terminal normal
                    setTimeout(() => {
                        glitchBgs.style.display = "none";
                        gsap.to(".preloader-content", { opacity: 1, duration: 0.3 });
                        preloaderTl.play();
                    }, 4000);
                }
            });
        });
    }

    // --- ANIMASI HUJAN BINER (The Matrix Effect) ---
    function startBinaryRain(durationMs) {
        const canvas = document.getElementById('binary-canvas');
        if (!canvas) return;
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');

        gsap.to(canvas, { opacity: 1, duration: 0.1 });

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Suara distorsi berkala seolah device error lama
        let errorSoundInterval = setInterval(() => {
            if (Math.random() > 0.4) {
                try { playBeep(Math.random() * 300 + 100, Math.random() > 0.5 ? 'sawtooth' : 'square', 0.1, 0.2); } catch (e) { }
            }
        }, 150);

        const chars = '01';
        const fontSize = 16;
        const columns = Math.ceil(width / fontSize);
        let drops = Array(columns).fill(1);

        const draw = () => {
            // Latar hitam kuat menambah kesan mati fatal
            ctx.fillStyle = 'rgba(5, 5, 5, 0.25)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#E52E2D';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const intervalId = setInterval(draw, 33);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            drops = Array(Math.ceil(width / fontSize)).fill(1);
        });

        setTimeout(() => {
            clearInterval(intervalId);
            clearInterval(errorSoundInterval);
            gsap.to(canvas, {
                opacity: 0, duration: 1.5, onComplete: () => {
                    canvas.style.display = "none";
                }
            });
        }, durationMs);
    }

    // Fungsi ini dipanggil setelah preloader (sistem loading hitam) selesai 100%
    function startPageEnterAnimation() {
        // Mainkan hujan biner selama 3 detik saja sesuai permintaan
        startBinaryRain(3000);

        // --- TRANSISI AKHIR GLITCH (Teks ERROR besar membelah layar) ---
        setTimeout(() => {
            const errorText = document.querySelector(".final-error-text");
            if (errorText) {
                errorText.style.display = "block";
                errorText.classList.add("glitch-text-anim");
                try {
                    playBeep(150, 'sawtooth', 0.5, 0.4);
                    setTimeout(() => playBeep(500, 'square', 0.3, 0.2), 300);
                } catch (e) { }
                setTimeout(() => { errorText.style.display = "none"; }, 800);
            }
        }, 3000);

        // --- 1. HERO LOAD ANIMATIONS ---
        const heroTl = gsap.timeline({ delay: 3.8 }); // Tunggu hujan biner & animasi ERROR pudar

        heroTl.to(".hero-bg-text", {
            opacity: 0.15,
            scale: 1,
            duration: 1.2,
            ease: "power2.out"
        })
            .to(".hero-image-wrapper img", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "expo.out"
            }, "-=0.8")
            .to([".hero-greeting", ".hero-title", ".hero-role", ".hero-desc", ".hero-globe"], {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.5")
            .to([".hero-motto", ".stat-item"], {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.2)"
            }, "-=0.6");
    }


    // --- 2. PARALLAX SCROLL (From ui-ux-pro-max Parallax Subte guidelines) ---
    // Smoothly scroll the background text down as we scroll down
    gsap.to(".hero-bg-text", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            scrub: true,
            start: "top top",
            end: "bottom top"
        }
    });

    // Parallax the hero image up slightly
    gsap.to(".hero-image-wrapper img", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            scrub: true,
            start: "top top",
            end: "bottom top"
        }
    });


    // --- 3. SCROLL REVEAL (Projects Grid - Stagger List Standard) ---
    // Make sure elements hide before they arrive
    gsap.set(".project-card", { opacity: 0, scale: 0.92, y: 30 });

    gsap.to(".project-card", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: {
            each: 0.15,
            from: "start",
            grid: "auto"
        },
        ease: "back.out(1.4)",
        scrollTrigger: {
            trigger: ".projects",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });


    // --- 4. DETAILS REVEAL (Education, Skills, Process) ---
    gsap.from(".ed-item, .skills-tags span", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.out",
        scrollTrigger: {
            trigger: ".education-skills",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".process-step", {
        opacity: 0,
        x: -20,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".work-process",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".quote-box > *", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
            trigger: ".quote-box",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });


    // --- 5. CONTACT FOOTER ---
    gsap.from(".contact-left > *, .contact-item", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power1.out",
        scrollTrigger: {
            trigger: ".contact-footer",
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".cta-card img", {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".contact-footer",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    // Add smooth scrolling to lenis or just normal anchor behavior
    document.querySelectorAll('.nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.custom-cursor');

    // GSAP quickTo for highly responsive tracking
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

    window.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    // --- PAGE TRANSITION (Navigate Away) ---
    document.querySelectorAll("a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = this.getAttribute("href");

            // Biarkan link anchor yang bersifat smooth scroll, link kosong, tel, mail berjalan biasa
            if (!target || target.startsWith("#") || target.includes("mailto:") || target.includes("tel:")) return;
            if (this.target === "_blank") return; // Biarkan link tab baru berjalan biasa

            e.preventDefault();
            const destination = this.href;

            // Turunkan layar gelap hujan biner, kemudian baru pindah
            startBinaryRain(3000);
            setTimeout(() => {
                window.location = destination;
            }, 2000);
        });
    });

    // Hover effect elements (semua teks: links, headings, paragraf, spans, list, button, dan kelas tipografi lainnya)
    const hoverElements = document.querySelectorAll('a, p, span, h1, h2, h3, h4, h5, h6, button, li, .hero-greeting, .hero-role, .hero-globe, .stat-num, .stat-text, .project-number, .project-info, .project-arrow, .ed-year, .step-num, .step-desc, .quote-mark, .signature, .hero-bg-text');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover-active'));
    });

    // Hover effect specifically for images
    const imageElements = document.querySelectorAll('img, .step-icon');
    imageElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover-img'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover-img'));
    });
});

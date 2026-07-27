// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Mencegah browser lompat ke posisi scroll sebelumnya saat di-refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- LENIS SMOOTH SCROLLING ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const skipAnim = urlParams.get('skip_anim');
    const preloaderEl = document.querySelector('.system-preloader');
    const transitionOverlay = document.querySelector(".page-transition");

    if (skipAnim === "1") {
        // Hapus query parameter skip_anim agar jika di-refresh animasi tetap jalan
        const updatedUrl = new URL(window.location.href);
        updatedUrl.searchParams.delete('skip_anim');
        window.history.replaceState({}, '', updatedUrl);

        if (preloaderEl) preloaderEl.remove();
        if (transitionOverlay) transitionOverlay.remove();
        document.body.style.overflow = '';

        // Instantly fade in elements rather than waiting for glitch boot
        setTimeout(() => {
            gsap.to(".hero-bg-text", { opacity: 0.15, scale: 1, duration: 1.2, ease: "power2.out" });
            gsap.to(".hero-image-wrapper img", { opacity: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" });
            gsap.to([".hero-greeting", ".hero-title", ".hero-role", ".hero-desc", ".hero-globe"], { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" });
            gsap.to([".hero-motto", ".stat-item"], { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" });
        }, 150);
    } else {
        // Kunci scroll saat preloader (hanya jika elemennya ada)
        if (preloaderEl) {
            document.body.style.overflow = 'hidden';
        }
    }

    // Initial setup to prevent flash sebelum efek masuk
    gsap.set(".hero-bg-text", { opacity: 0, scale: 0.95 });
    gsap.set(".hero-greeting, .hero-title, .hero-role, .hero-desc, .hero-globe", { opacity: 0, x: -30 });
    gsap.set(".hero-image-wrapper img", { opacity: 0, y: 50, scale: 0.95 });
    gsap.set(".stat-item, .hero-motto", { opacity: 0, x: 30 });

    // --- AUDIO SYSTEM (WEB AUDIO API) ---
    // (Audio system removed as per user request for silent exclusive experience)
    function playBeep(freq = 600, type = 'square', duration = 0.05, vol = 0.02) {
        // Disabled
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

    // Mengetik log terminal tanpa animasi glitch tambahan
    const lineElements = document.querySelectorAll(".console-line");
    preloaderTl.to(lineElements, {
        opacity: 1,
        duration: 0.05,
        stagger: 0.6, // Jeda per baris
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
        bootBtn.addEventListener("mouseenter", () => {
        });

        bootBtn.addEventListener("mouseleave", () => {
        });

        bootBtn.addEventListener("click", () => {
            // Hilangkan layar boot dan langsung tampilkan terminal
            gsap.to(".boot-screen", {
                opacity: 0,
                duration: 0.2,
                display: "none",
                onComplete: () => {
                    gsap.to(".preloader-content", { opacity: 1, duration: 0.3 });
                    preloaderTl.play();
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

            ctx.fillStyle = '#0145F2';
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
        // --- 1. HERO LOAD ANIMATIONS ---
        const heroTl = gsap.timeline({ delay: 0.2 }); // Mulai segera setelah preloader selesai

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

    gsap.to(".timeline-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".experience-list",
            start: "top center",
            end: "bottom center",
            scrub: 1
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
    if (document.querySelector(".contact-footer")) {
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
    }

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

    // (All custom cursor logic has been removed as per user request to restore completely standard OS pointer behavior without extra effects)

    // --- PAGE TRANSITION (Navigate Away) ---
    document.querySelectorAll("a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = this.getAttribute("href");

            // Biarkan link anchor yang bersifat smooth scroll, link kosong, tel, mail berjalan biasa
            if (!target || target.startsWith("#") || target.includes("mailto:") || target.includes("tel:")) return;
            if (this.target === "_blank") return; // Biarkan link tab baru berjalan biasa

            // Bypass animasi transisi khusus jika terpasang class no-transition
            if (this.classList.contains("no-transition")) {
                e.preventDefault();
                gsap.to("main, .header", { opacity: 0, duration: 0.2, ease: "power1.out" });
                setTimeout(() => { window.location = this.href; }, 200);
                return;
            }

            e.preventDefault();
            const destination = this.href;

            gsap.to("main, .header", { opacity: 0, duration: 0.3, ease: "power1.out" });
            setTimeout(() => {
                window.location = destination;
            }, 300);
        });
    });

    // Standard Hover interactions using normal CSS logic now handling hover feel.

    // --- PROJECT CARD MODAL LOGIC ---
    const projectData = [
        {
            title: "WEBSITE WEDDING CONTENT CREATOR",
            category: "WEBSITE DEVELOPMENT",
            imgSrc: "assets/website.png",
            desc: "Update fitur website perusahaan wedding content creator meliput halaman pricelist, halaman booking, dan portfolio luxative. Membuat logic baru untuk halaman landing page dan menambahkan sidebar untuk beberapa fitur yang hanya berada pada sidebar"
        },
        {
            title: "SERVER MONITORING GAME",
            category: "SERVER MAINTENANCE",
            imgSrc: "assets/monitoring.jpg",
            desc: "Maintanance server game pada satu platform bernama fivem. Memperbaiki bug dan error pada server serta monitoring server agar tetap berjalan dengan lancar."
        },
        {
            title: "UI UX DESIGN LAN RI",
            category: "UI UX DESIGN PLANNING",
            imgSrc: "assets/ui_ux.png",
            desc: "Perancangan desain User Interface & User Experience yang mengutamakan tingkat aksesibilitas (accessibility) tinggi dan navigasi logis, dimulai dari user research, pembuatan wireframe, hingga hasil akhir interaktif (prototype). Desain dibuat bersih dan user-focused."
        },
        {
            title: "PERSONAL PORTFOLIO",
            category: "FRONTEND WEB DEVELOPMENT",
            imgSrc: "assets/dimas.jpeg",
            desc: "Pengembangan website portofolio pribadi eksklusif berkonsep premium dengan tema terang (Light Mode Canvas Cloud), transisi mulus menggunakan GSAP ScrollTrigger, dan desain responsif yang minimalis. Dibuat secara native menggunakan HTML, CSS, dan Javascript murni tanpa framework untuk menonjolkan kreativitas antarmuka."
        },
        {
            title: "AWS ACADEMY CLOUD FOUNDATIONS",
            category: "AMAZON WEB SERVICES",
            imgSrc: "assets/Sertifikat1.png",
            desc: "Sertifikasi kelulusan AWS Academy Cloud Foundations yang membuktikan pemahaman dasar tentang layanan cloud computing pada infrastruktur Amazon Web Services, meliputi aspek keamanan, arsitektur, dan prinsip cloud."
        },
        {
            title: "DATABASE DESIGN",
            category: "ORACLE ACADEMY",
            imgSrc: "assets/sertifikat2.png",
            desc: "Sertifikasi kelulusan Database Design dari Oracle Academy. Membuktikan kompetensi dalam analisis perancangan basis data relasional, pemodelan data konseptual, dan implementasi desain sistem informasi yang tangguh."
        },
        {
            title: "PAPER AUTHOR / PRESENTER",
            category: "COSITE 2025",
            imgSrc: "assets/sertifikat3.png",
            desc: "Sertifikat penghargaan sebagai pemakalah (Presenter & Author) pada konferensi internasional COSITE (International Conference on Computer System, Information Technology, and Electrical Engineering) tahun 2025."
        },
        {
            title: "PAPER AUTHOR / PRESENTER",
            category: "COSITE 2025 (ADDITIONAL)",
            imgSrc: "assets/sertifikat4.png",
            desc: "Sertifikat penghargaan tambahan/bukti partisipasi sebagai pemakalah pada sesi presentasi konferensi internasional COSITE 2025."
        }
    ];

    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDesc = document.getElementById('modal-desc');

    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            // Mainkan suara sistem pendek (jika ada audioCtx)
            try {
                if (audioCtx && audioCtx.state !== 'suspended') {
                    playBeep(800, 'square', 0.05, 0.02);
                }
            } catch (e) { }

            // Ambil data-index jika ada, jika tidak gunakan index loop bawaan
            const attrIndex = card.getAttribute('data-index');
            const dataIndex = attrIndex !== null ? parseInt(attrIndex) : index;

            // Masukkan data dinamis ke modal
            const data = projectData[dataIndex];
            if (data) {
                modalImg.src = data.imgSrc;
                modalTitle.textContent = data.title;
                modalCategory.textContent = data.category;
                modalDesc.textContent = data.desc;
            }

            // Tampilkan modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // hilangkan scroll body saat modal aktif
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        // Native cursor logic handles modal closing hover
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            // Tutup jika area luar (overlay) di-klik
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- PORTFOLIO TABS TOGGLE ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const projectsGrid = document.getElementById('projects-grid');
    const certificatesGrid = document.getElementById('certificates-grid');

    if (tabBtns.length > 0 && projectsGrid && certificatesGrid) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const target = btn.getAttribute('data-target');
                if (target === 'projects') {
                    projectsGrid.style.display = 'flex';
                    certificatesGrid.style.display = 'none';
                } else if (target === 'certificates') {
                    projectsGrid.style.display = 'none';
                    certificatesGrid.style.display = 'flex';
                }
            });
        });
    }
});

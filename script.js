// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. HERO LOAD ANIMATIONS (Stagger List Complex vibe) ---
    const heroTl = gsap.timeline();

    // Initial setup to prevent flash before GSAP kicks in
    gsap.set(".hero-bg-text", { opacity: 0, scale: 0.95 });
    gsap.set(".hero-greeting, .hero-title, .hero-role, .hero-desc, .hero-globe", { opacity: 0, x: -30 });
    gsap.set(".hero-image-wrapper img", { opacity: 0, y: 50, scale: 0.95 });
    gsap.set(".stat-item, .hero-motto", { opacity: 0, x: 30 });

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
});

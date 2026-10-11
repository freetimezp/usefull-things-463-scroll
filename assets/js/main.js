gsap.registerPlugin(ScrollTrigger);

gsap.config({
    nullTargetWarn: false,
});

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

const maskCircle = document.querySelector(".displacement");
const heroCopy = document.querySelector(".hero-copy");
const heroTitle = document.querySelector(".hero-title");
const eyebrow = document.querySelector(".eyebrow");
const heroBottom = document.querySelector(".hero-bottom");
const sceneImage = document.querySelector(".knight-image");

// OPENING TITLE — hide on scroll, restore at the top.

const openingTitle = document.querySelector(".opening-title");

if (openingTitle) {
    if (prefersReducedMotion) {
        gsap.set(openingTitle, { autoAlpha: 0 });
    } else {
        gsap.set(openingTitle, {
            autoAlpha: 1,
            y: 0,
        });

        ScrollTrigger.create({
            trigger: ".intro",
            start: "top top",
            end: "top+=100 top",
            onUpdate: (self) => {
                gsap.to(openingTitle, {
                    autoAlpha: 1 - self.progress,
                    y: -40 * self.progress,
                    duration: 0.2,
                    overwrite: true,
                });
            },
        });
    }
}

if (
    maskCircle &&
    heroCopy &&
    heroTitle &&
    eyebrow &&
    heroBottom &&
    sceneImage
) {
    gsap.set(maskCircle, {
        attr: { r: 0 },
    });

    gsap.set(heroCopy, {
        autoAlpha: 0,
    });

    gsap.set(eyebrow, {
        y: 20,
        autoAlpha: 0,
    });

    gsap.set(".title-line-top", {
        yPercent: 70,
        autoAlpha: 0,
    });

    gsap.set(".title-line-bottom", {
        yPercent: -50,
        autoAlpha: 0,
    });

    gsap.set(heroBottom, {
        y: 24,
        autoAlpha: 0,
    });

    gsap.set(".coordinates, .side-label", {
        autoAlpha: 0,
    });

    gsap.set(sceneImage, {
        scale: 1.12,
        transformOrigin: "50% 50%",
    });

    if (prefersReducedMotion) {
        gsap.set(maskCircle, {
            attr: { r: 1000 },
        });

        gsap.set(
            [
                heroCopy,
                eyebrow,
                ".title-line-top",
                ".title-line-bottom",
                heroBottom,
                ".coordinates",
                ".side-label",
            ],
            {
                clearProps: "all",
            },
        );

        gsap.set(sceneImage, {
            scale: 1,
        });
    } else {
        const introTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".intro",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });

        // ACT I — The image awakens from darkness.
        introTimeline.to(
            maskCircle,
            {
                attr: { r: 850 },
                ease: "none",
                duration: 4,
            },
            0,
        );

        // The portrait slowly settles into the frame.
        introTimeline.to(
            sceneImage,
            {
                scale: 1,
                ease: "none",
                duration: 4,
            },
            0,
        );

        // ACT II — The surrounding coordinates appear.
        introTimeline.to(
            ".coordinates, .side-label",
            {
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.out",
            },
            1.15,
        );

        // ACT III — Reveal the editorial title.
        introTimeline.to(
            heroCopy,
            {
                autoAlpha: 1,
                duration: 0.45,
                ease: "power1.out",
            },
            1.5,
        );

        introTimeline.to(
            eyebrow,
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                ease: "power3.out",
            },
            1.6,
        );

        introTimeline.to(
            ".title-line-top",
            {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1,
                ease: "power3.out",
            },
            1.8,
        );

        introTimeline.to(
            ".title-line-bottom",
            {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1.1,
                ease: "power3.out",
            },
            2.05,
        );

        introTimeline.to(
            heroBottom,
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.out",
            },
            2.45,
        );

        // ACT IV — Fade the composition as we leave the intro.
        introTimeline.to(
            heroCopy,
            {
                y: -35,
                autoAlpha: 0,
                duration: 0.6,
                ease: "power2.in",
            },
            3.3,
        );

        introTimeline.to(
            ".coordinates, .side-label",
            {
                autoAlpha: 0,
                duration: 0.4,
            },
            3.4,
        );

        // A final cinematic retreat.
        introTimeline.to(
            maskCircle,
            {
                attr: { r: 0 },
                duration: 1,
                ease: "power2.in",
            },
            3.7,
        );
    }
}

// CHAPTER I — Editorial text entrance.
if (!prefersReducedMotion) {
    gsap.from(".story-kicker", {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".story-content",
            start: "top 75%",
            toggleActions: "play none none reverse",
        },
    });

    gsap.from(".story-title", {
        y: 65,
        autoAlpha: 0,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".story-title",
            start: "top 78%",
            toggleActions: "play none none reverse",
        },
    });

    gsap.from(".story-bottom > *", {
        y: 25,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".story-bottom",
            start: "top 85%",
            toggleActions: "play none none reverse",
        },
    });

    gsap.from(".interlude-content", {
        y: 40,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".interlude",
            start: "top 70%",
            toggleActions: "play none none reverse",
        },
    });
}

// Keep the SVG and scroll measurements synchronized.
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

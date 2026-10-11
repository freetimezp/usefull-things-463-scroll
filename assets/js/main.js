// ============================================================
// 1. REGISTER GSAP PLUGINS
// ============================================================

// Register ScrollTrigger so GSAP can use scroll-based animations.
// ScrollTrigger allows animations to start, stop, or reverse
// depending on the visitor's scroll position.
gsap.registerPlugin(ScrollTrigger);

// Configure global GSAP settings.
gsap.config({
    // Prevents warnings when GSAP tries to animate an element
    // that does not exist on the page.
    // Useful when some elements are optional.
    nullTargetWarn: false,
});

// ============================================================
// 2. INITIALIZE LENIS SMOOTH SCROLLING
// ============================================================

// Create a new Lenis instance.
// Lenis makes scrolling feel smoother than the browser's
// default scrolling behavior.
const lenis = new Lenis();

// Tell ScrollTrigger to update its scroll calculations
// whenever Lenis reports a scroll event.
lenis.on("scroll", ScrollTrigger.update);

// Connect Lenis to GSAP's animation ticker.
//
// GSAP's ticker runs repeatedly, usually once per animation frame.
// The time value is provided in seconds, but Lenis expects
// milliseconds, so we multiply it by 1000.
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Disable GSAP's automatic lag smoothing.
//
// This helps keep GSAP and Lenis synchronized when the browser
// experiences a long frame or temporary slowdown.
gsap.ticker.lagSmoothing(0);

// ============================================================
// 3. CHECK THE USER'S MOTION PREFERENCE
// ============================================================

// Some visitors prefer reduced animation because of motion
// sensitivity or accessibility needs.
//
// This media query checks the operating system or browser setting.
// If the visitor has enabled reduced motion, we simplify the
// experience and avoid the main animated sequences.
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

// ============================================================
// 4. SELECT HTML ELEMENTS
// ============================================================

// querySelector() finds the FIRST element matching a CSS selector.
//
// For example:
// document.querySelector(".hero-title")
// finds the element with class="hero-title".
//
// We save these elements in variables so we can use them later
// without repeatedly searching the HTML document.

const maskCircle = document.querySelector(".displacement");
// The SVG circle that reveals the knight image.

const heroCopy = document.querySelector(".hero-copy");
// The complete group of hero text and supporting content.

const heroTitle = document.querySelector(".hero-title");
// The main heading: "THE LAST KNIGHT."

const eyebrow = document.querySelector(".eyebrow");
// The small introductory label above the heading.

const heroBottom = document.querySelector(".hero-bottom");
// The description, scroll cue, and page index.

const sceneImage = document.querySelector(".knight-image");
// The SVG image containing the knight portrait.

// ============================================================
// 5. OPENING TITLE — HIDE ON SCROLL, RESTORE AT THE TOP
// ============================================================

// Select the large opening title displayed during the intro.
const openingTitle = document.querySelector(".opening-title");

// Only run this code if the opening title exists in the HTML.
if (openingTitle) {
    // If the visitor prefers reduced motion, hide the opening title
    // immediately instead of animating it.
    if (prefersReducedMotion) {
        gsap.set(openingTitle, {
            autoAlpha: 0,
        });
    } else {
        // Set the opening title's initial state.
        gsap.set(openingTitle, {
            autoAlpha: 1, // Fully visible.
            y: 0, // No vertical movement.
        });

        // Create a ScrollTrigger that monitors the intro section.
        ScrollTrigger.create({
            trigger: ".intro",

            // Start when the top of the intro reaches the top
            // of the browser viewport.
            start: "top top",

            // End after the intro's top has moved 100 pixels
            // above the top of the viewport.
            end: "top+=100 top",

            // Runs whenever the scroll progress changes.
            onUpdate: (self) => {
                // self.progress is a number between 0 and 1:
                //
                // 0 = the beginning of the trigger.
                // 1 = the end of the trigger.
                //
                // We use this value to fade and move the title.
                //
                // 1 - self.progress:
                // 1 means fully visible; 0 means invisible.
                //
                // -40 * self.progress:
                // Moves the title upward by up to 40 pixels.
                gsap.to(openingTitle, {
                    autoAlpha: 1 - self.progress,
                    y: -40 * self.progress,

                    // Short duration keeps the transition responsive.
                    duration: 0.2,

                    // Replaces conflicting animations on this element
                    // so that rapid scrolling does not create a backlog.
                    overwrite: true,
                });
            },
        });
    }
}

// ============================================================
// 6. PREPARE THE HERO ANIMATION
// ============================================================

// Run the main hero animation only if all essential elements exist.
//
// This check prevents errors if the HTML is changed and one of
// these required elements is missing.
if (
    maskCircle &&
    heroCopy &&
    heroTitle &&
    eyebrow &&
    heroBottom &&
    sceneImage
) {
    // --------------------------------------------------------
    // 6.1 SET THE INITIAL STATE
    // --------------------------------------------------------

    // Start the SVG reveal circle with a radius of zero.
    //
    // attr is used to animate SVG attributes rather than
    // regular CSS properties.
    //
    // r = radius:
    // r: 0    -> the circle is invisible.
    // r: 850  -> the circle expands and reveals the image.
    gsap.set(maskCircle, {
        attr: { r: 0 },
    });

    // Hide all hero content before the animation begins.
    //
    // autoAlpha combines opacity with visibility.
    // A value of 0 makes the element invisible.
    gsap.set(heroCopy, {
        autoAlpha: 0,
    });

    // Move the small introductory label down by 20 pixels
    // and hide it.
    gsap.set(eyebrow, {
        y: 20,
        autoAlpha: 0,
    });

    // Position the first title line below its final position.
    //
    // yPercent uses a percentage of the element's own height.
    // 70 means 70% of its height downward.
    gsap.set(".title-line-top", {
        yPercent: 70,
        autoAlpha: 0,
    });

    // Position the second title line above its final position.
    //
    // A negative yPercent moves the element upward.
    gsap.set(".title-line-bottom", {
        yPercent: -50,
        autoAlpha: 0,
    });

    // Move the bottom hero content down and hide it.
    gsap.set(heroBottom, {
        y: 24,
        autoAlpha: 0,
    });

    // Hide the decorative coordinates and side labels.
    //
    // A comma-separated selector targets both groups.
    gsap.set(".coordinates, .side-label", {
        autoAlpha: 0,
    });

    // Slightly enlarge the image at the beginning.
    //
    // scale: 1.12 means 112% of its normal size.
    // The image gradually returns to scale: 1 during the reveal.
    //
    // transformOrigin defines the point around which scaling occurs.
    gsap.set(sceneImage, {
        scale: 1.12,
        transformOrigin: "50% 50%",
    });

    // --------------------------------------------------------
    // 6.2 ACCESSIBILITY: REDUCED MOTION
    // --------------------------------------------------------

    // When reduced motion is enabled, skip the animated timeline
    // and show the content in its final, readable state.
    if (prefersReducedMotion) {
        // Reveal the entire image immediately.
        gsap.set(maskCircle, {
            attr: { r: 1000 },
        });

        // Remove GSAP's temporary inline styles from these elements.
        //
        // clearProps: "all" removes inline CSS properties managed
        // by GSAP, allowing the stylesheet to control their appearance.
        //
        // This restores the normal CSS appearance, so make sure
        // your stylesheet does not permanently hide these elements.
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

        // Return the image to its normal size.
        gsap.set(sceneImage, {
            scale: 1,
        });
    } else {
        // ====================================================
        // 7. CREATE THE SCROLL-DRIVEN HERO TIMELINE
        // ====================================================

        // A GSAP timeline lets us combine multiple animations
        // and control their timing as one sequence.
        //
        // Because scrub is enabled, the animation is controlled
        // by scrolling rather than playing independently.
        const introTimeline = gsap.timeline({
            scrollTrigger: {
                // The section whose scroll position controls the timeline.
                trigger: ".intro",

                // Begin when the intro reaches the top of the viewport.
                start: "top top",

                // End when the bottom of the intro reaches the bottom
                // of the viewport.
                end: "bottom bottom",

                // Connect timeline progress to scroll progress.
                //
                // scrub: 1 means GSAP takes approximately one second
                // to catch up with the scroll position.
                // A numeric scrub creates a smoother catch-up effect.
                scrub: 1,

                // Recalculate animation values when ScrollTrigger
                // refreshes, including after a viewport resize.
                invalidateOnRefresh: true,
            },
        });

        // ----------------------------------------------------
        // ACT I — THE IMAGE AWAKENS FROM DARKNESS
        // ----------------------------------------------------

        // Expand the circular SVG mask to reveal the knight.
        introTimeline.to(
            maskCircle,
            {
                attr: { r: 850 },

                // Linear interpolation: no extra acceleration
                // at the beginning or end of this animation.
                ease: "none",

                // Duration is measured in timeline units.
                // It determines how much of the timeline this
                // animation occupies.
                duration: 4,
            },

            // Start at timeline position 0.
            // The animation begins at the very start of the timeline.
            0,
        );

        // Slowly scale the knight image back to its normal size.
        // This creates a subtle cinematic camera movement.
        introTimeline.to(
            sceneImage,
            {
                scale: 1,
                ease: "none",
                duration: 4,
            },

            // Start at the same timeline position as the mask reveal.
            // Both animations happen simultaneously.
            0,
        );

        // ----------------------------------------------------
        // ACT II — THE SURROUNDING DETAILS APPEAR
        // ----------------------------------------------------

        // Fade in the coordinates and side labels.
        introTimeline.to(
            ".coordinates, .side-label",
            {
                autoAlpha: 1,
                duration: 0.8,

                // Starts more quickly and slows down near the end.
                ease: "power2.out",
            },

            // Begin at timeline position 1.15.
            // This overlaps with the image reveal.
            1.15,
        );

        // ----------------------------------------------------
        // ACT III — REVEAL THE EDITORIAL TITLE
        // ----------------------------------------------------

        // Make the complete hero text group visible.
        introTimeline.to(
            heroCopy,
            {
                autoAlpha: 1,
                duration: 0.45,
                ease: "power1.out",
            },

            // Begin at timeline position 1.5.
            1.5,
        );

        // Move the introductory label into its final position
        // while fading it in.
        introTimeline.to(
            eyebrow,
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                ease: "power3.out",
            },

            // Begin at timeline position 1.6.
            1.6,
        );

        // Animate the first heading line into view.
        introTimeline.to(
            ".title-line-top",
            {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1,
                ease: "power3.out",
            },

            // Begin at timeline position 1.8.
            1.8,
        );

        // Animate the second heading line into view.
        //
        // It starts slightly later than the first line,
        // creating a staggered editorial effect.
        introTimeline.to(
            ".title-line-bottom",
            {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1.1,
                ease: "power3.out",
            },

            // Begin at timeline position 2.05.
            2.05,
        );

        // Reveal the description, scroll cue, and page index.
        introTimeline.to(
            heroBottom,
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.out",
            },

            // Begin at timeline position 2.45.
            2.45,
        );

        // ----------------------------------------------------
        // ACT IV — THE HERO COMPOSITION FADES AWAY
        // ----------------------------------------------------

        // Move the main hero text upward and fade it out.
        introTimeline.to(
            heroCopy,
            {
                y: -35,
                autoAlpha: 0,
                duration: 0.6,
                ease: "power2.in",
            },

            // Begin at timeline position 3.3.
            // The title starts disappearing near the end of the scene.
            3.3,
        );

        // Fade out the decorative coordinates and side labels.
        introTimeline.to(
            ".coordinates, .side-label",
            {
                autoAlpha: 0,
                duration: 0.4,
            },

            // Begin at timeline position 3.4.
            3.4,
        );

        // Shrink the SVG mask back to zero.
        //
        // This hides the image again and creates the final
        // cinematic retreat as the visitor scrolls through the intro.
        introTimeline.to(
            maskCircle,
            {
                attr: { r: 0 },
                duration: 1,
                ease: "power2.in",
            },

            // Begin at timeline position 3.7.
            3.7,
        );
    }
}

// ============================================================
// 8. CHAPTER I — STORY TEXT ANIMATIONS
// ============================================================

// These animations run when the visitor reaches the story section.
//
// Unlike the hero timeline, these are individual animations.
// ScrollTrigger starts each one when its target enters the viewport.
//
// Skip them if the visitor prefers reduced motion.
if (!prefersReducedMotion) {
    // --------------------------------------------------------
    // 8.1 ANIMATE THE STORY KICKER
    // --------------------------------------------------------

    // gsap.from() describes the starting state.
    // GSAP animates the element from these values to its
    // normal CSS appearance.
    gsap.from(".story-kicker", {
        y: 20, // Start 20 pixels lower.
        autoAlpha: 0, // Start invisible.
        duration: 0.8, // Animation duration in seconds.
        ease: "power3.out",

        scrollTrigger: {
            // Watch the container holding the story content.
            trigger: ".story-content",

            // Start when the top of the container reaches
            // 75% of the viewport height.
            start: "top 75%",

            // Controls what happens when the trigger enters,
            // leaves, and re-enters the viewport.
            //
            // "play none none reverse":
            // 1. Entering: play the animation.
            // 2. Leaving: do nothing.
            // 3. Entering again: do nothing.
            // 4. Scrolling back: reverse the animation.
            toggleActions: "play none none reverse",
        },
    });

    // --------------------------------------------------------
    // 8.2 ANIMATE THE STORY HEADING
    // --------------------------------------------------------

    gsap.from(".story-title", {
        y: 65, // Start 65 pixels lower.
        autoAlpha: 0, // Start invisible.
        duration: 1.15,
        ease: "power3.out",

        scrollTrigger: {
            // Watch the story heading itself.
            trigger: ".story-title",

            // Start when its top reaches 78% of the viewport.
            start: "top 78%",

            // Play when entering and reverse when scrolling back.
            toggleActions: "play none none reverse",
        },
    });

    // --------------------------------------------------------
    // 8.3 ANIMATE THE STORY DETAILS
    // --------------------------------------------------------

    // The selector ".story-bottom > *" selects every direct child
    // inside .story-bottom.
    //
    // In this HTML, these are the chapter number and story paragraph.
    gsap.from(".story-bottom > *", {
        y: 25, // Start slightly lower.
        autoAlpha: 0, // Start invisible.
        duration: 0.9,

        // Animate the selected elements one after another.
        // Each animation starts 0.18 seconds after the previous one.
        stagger: 0.18,

        ease: "power2.out",

        scrollTrigger: {
            // Use the bottom content container as the trigger.
            trigger: ".story-bottom",

            // Begin when the top reaches 85% of the viewport.
            start: "top 85%",

            // Reverse the animation when scrolling back above the trigger.
            toggleActions: "play none none reverse",
        },
    });

    // --------------------------------------------------------
    // 8.4 ANIMATE THE INTERLUDE QUOTATION
    // --------------------------------------------------------

    // Fade the quotation group into view and move it upward.
    gsap.from(".interlude-content", {
        y: 40, // Start 40 pixels lower.
        autoAlpha: 0, // Start invisible.
        duration: 1.2,
        ease: "power3.out",

        scrollTrigger: {
            // Watch the full interlude section.
            trigger: ".interlude",

            // Start when the section reaches 70% of viewport height.
            start: "top 70%",

            // Play on entry and reverse on the way back up.
            toggleActions: "play none none reverse",
        },
    });
}

// ============================================================
// 9. REFRESH SCROLLTRIGGER AFTER THE PAGE LOADS
// ============================================================

// Wait for the browser's load event.
//
// Unlike DOMContentLoaded, the load event waits for page resources
// such as images to finish loading.
window.addEventListener("load", () => {
    // Recalculate trigger positions and scroll measurements.
    //
    // This is useful when images, fonts, or other resources
    // affect the final dimensions of the page.
    ScrollTrigger.refresh();
});

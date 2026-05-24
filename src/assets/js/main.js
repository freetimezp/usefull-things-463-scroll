gsap.registerPlugin(ScrollTrigger);

gsap.to(".displacement", {
    r: 450,
    scrollTrigger: {
        trigger: ".wrapper",
        start: "top 30%",
        end: "bottom 10%",
        scrub: true,
    },
});

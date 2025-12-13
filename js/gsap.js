gsap.registerPlugin(ScrollTrigger);

/* ===========================================================
   GLOBAL FIX — AGAR TIDAK ADA ANIMASI SKIP SAAT SCROLL CEPAT
=========================================================== */
ScrollTrigger.config({
    fastScrollEnd: true,
    ignoreMobileResize: true
});

/* Template ScrollTrigger Options */
const ST_OPTIONS = {
    start: "top 85%",
    end: "top -10%",
    toggleActions: "play reverse play reverse",
    anticipatePin: 1
};

/* ===========================================================
   HOME CONTENT — fade-up + scale (duration 3s)
=========================================================== */

document.querySelectorAll(".home-cont-child").forEach(el => {

    const anim = gsap.fromTo(el,
        {
            opacity: 0,
            y: 100,
            scale: 0.8
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power1.out",
            paused: true
        }
    );

    ScrollTrigger.create({
        trigger: el,
        ...ST_OPTIONS,
        onEnter: () => anim.play(),
        onLeaveBack: () => anim.reverse()
    });
});


/* ===========================================================
   ABOUT CONTENT — text: fade-right, image: fade-left
=========================================================== */

const aboutItems = document.querySelectorAll(".about-cont");


/* ---------- 1) TEKS: fade from LEFT → RIGHT ---------- */

const aboutText = aboutItems[0];

const animText = gsap.fromTo(aboutText,
    {
        opacity: 0,
        x: -150
    },
    {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power1.out",
        paused: true
    }
);

ScrollTrigger.create({
    trigger: aboutText,
    ...ST_OPTIONS,
    onEnter: () => animText.play(),
    onLeaveBack: () => animText.reverse()
});


/* ---------- 2) GAMBAR: fade from RIGHT → LEFT ---------- */

const aboutImg = aboutItems[1];

const animImg = gsap.fromTo(aboutImg,
    {
        opacity: 0,
        x: 150
    },
    {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power1.out",
        paused: true
    }
);

ScrollTrigger.create({
    trigger: aboutImg,
    ...ST_OPTIONS,
    onEnter: () => animImg.play(),
    onLeaveBack: () => animImg.reverse()
});

/* ===========================================================
   SKILLS CARD — fade-up per card dengan stagger
=========================================================== */

document.querySelectorAll(".skills-cont").forEach(container => {

    const cards = container.querySelectorAll(".skills-card");

    const anim = gsap.fromTo(cards,
        {
            opacity: 0,
            y: 50
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power1.out",
            stagger: 0.20,     // efek muncul satu per satu
            paused: true
        }
    );

    ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        end: "top -10%",
        anticipatePin: 1,
        // karena anim = group, reverse akan memutar mundur semuanya
        onEnter: () => anim.play(),
        onLeaveBack: () => anim.reverse()
    });

});

/* TEMPLATE OPTIONS */
const ZIGZAG_ST = {
    start: "top 85%",
    end: "top -10%",
    toggleActions: "play reverse play reverse",
    anticipatePin: 1
};

/* ===========================================================
   ZIGZAG ITEM — LEFT (fade in from right)
=========================================================== */
document.querySelectorAll(".zigzag-item.left").forEach(item => {

    const animLeft = gsap.fromTo(item,
        {
            opacity: 0,
            x: -120
        },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power1.out",
            paused: true
        }
    );

    ScrollTrigger.create({
        trigger: item,
        ...ZIGZAG_ST,
        onEnter: () => animLeft.play(),
        onLeaveBack: () => animLeft.reverse()
    });

});


/* ===========================================================
   ZIGZAG ITEM — RIGHT (fade in from left)
=========================================================== */
document.querySelectorAll(".zigzag-item.right").forEach(item => {

    const animRight = gsap.fromTo(item,
        {
            opacity: 0,
            x: 120
        },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power1.out",
            paused: true
        }
    );

    ScrollTrigger.create({
        trigger: item,
        ...ZIGZAG_ST,
        onEnter: () => animRight.play(),
        onLeaveBack: () => animRight.reverse()
    });

});

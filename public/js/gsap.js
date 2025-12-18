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


gsap.registerPlugin(ScrollTrigger);

/* ===========================================================
   PORTFOLIO CARD — fade up per card (stagger)
=========================================================== */

document.querySelectorAll(".portfolio-cont").forEach(container => {

    const cards = container.querySelectorAll(".portfolio-card");

    const anim = gsap.fromTo(cards,
        {
            opacity: 0,
            y: 100
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power1.out",
            stagger: 0.3,      // muncul satu per satu
            paused: true
        }
    );

    ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        end: "top -20%",
        anticipatePin: 1,
        onEnter: () => anim.play(),
        onLeaveBack: () => anim.reverse()
    });

});

gsap.registerPlugin(ScrollTrigger);

/* ===========================================================
   CONTACT SECTION — consistent scroll (play / reverse)
=========================================================== */

const contactSection = document.querySelector("#contact");
const contactHead = document.querySelector(".contact-head");
const contactCard = document.querySelector(".contact-card");
const contactBg = document.querySelector(".contact-bg");
const formItems = contactCard.querySelectorAll(".input-wrap, .send-btn");

/* ---------- BACKGROUND GLOW ---------- */
const bgAnim = gsap.fromTo(contactBg,
    {
        opacity: 0,
        scale: 0.9
    },
    {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
        paused: true
    }
);

ScrollTrigger.create({
    trigger: contactSection,
    ...ST_OPTIONS,
    onEnter: () => bgAnim.play(),
    onLeaveBack: () => bgAnim.reverse()
});


/* ---------- LEFT TEXT ---------- */
const headAnim = gsap.fromTo(contactHead,
    {
        opacity: 0,
        x: -120,
        filter: "blur(10px)"
    },
    {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power1.out",
        paused: true
    }
);

ScrollTrigger.create({
    trigger: contactHead,
    ...ST_OPTIONS,
    onEnter: () => headAnim.play(),
    onLeaveBack: () => headAnim.reverse()
});


/* ---------- FORM CARD ---------- */
const cardAnim = gsap.fromTo(contactCard,
    {
        opacity: 0,
        y: 120,
        scale: 0.95,
        filter: "blur(12px)"
    },
    {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power1.out",
        paused: true
    }
);

ScrollTrigger.create({
    trigger: contactCard,
    ...ST_OPTIONS,
    onEnter: () => cardAnim.play(),
    onLeaveBack: () => cardAnim.reverse()
});


/* ---------- FORM ITEMS (STAGGER) ---------- */
const itemsAnim = gsap.fromTo(formItems,
    {
        opacity: 0,
        y: 40
    },
    {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power1.out",
        stagger: 0.12,
        paused: true
    }
);

ScrollTrigger.create({
    trigger: contactCard,
    ...ST_OPTIONS,
    onEnter: () => itemsAnim.play(),
    onLeaveBack: () => itemsAnim.reverse()
});


/* ---------- BUTTON MICRO PULSE ---------- */
const btnPulse = gsap.fromTo(".send-btn",
    {
        scale: 1
    },
    {
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: "sine.inOut",
        paused: true
    }
);

ScrollTrigger.create({
    trigger: contactSection,
    start: "top 60%",
    end: "top -10%",
    onEnter: () => btnPulse.play(),
    onLeaveBack: () => btnPulse.pause(0)
});

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ─── Utility: FadeIn wrapper ────────────────────────────────────────────────
function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = "", as = "div" }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}

// ─── Utility: Magnet effect ──────────────────────────────────────────────────
function Magnet({ children, padding = 150, strength = 3, activeTransition = "transform 0.3s ease-out", inactiveTransition = "transform 0.6s ease-in-out" }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transition: inactiveTransition, willChange: "transform" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = Math.max(rect.width, rect.height) / 2 + padding;
      if (dist < threshold) {
        setStyle({ transform: `translate3d(${dx / strength}px, ${dy / strength}px, 0)`, transition: activeTransition, willChange: "transform" });
      } else {
        setStyle({ transform: "translate3d(0,0,0)", transition: inactiveTransition, willChange: "transform" });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

// ─── Utility: AnimatedText (char-by-char scroll reveal) ─────────────────────
function AnimatedText({ text, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = text.split("");

  return (
    <p ref={ref} className={className} style={{ position: "relative" }}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        const end = (i + 1) / chars.length;
        return (
          <CharSpan key={i} char={char} progress={scrollYProgress} start={start} end={end} />
        );
      })}
    </p>
  );
}

function CharSpan({ char, progress, start, end }) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ opacity: 0 }}>{char === " " ? "\u00A0" : char}</span>
      <motion.span style={{ opacity, position: "absolute", top: 0, left: 0 }}>
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
}

// ─── ContactButton ───────────────────────────────────────────────────────────
function ContactButton() {
  return (
    <button
      style={{
        background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow: "0px 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1",
        outline: "2px solid white",
        outlineOffset: "-3px",
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        color: "white",
        fontFamily: "'Kanit', sans-serif",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
      }}
      className="px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
    >
      Contact Me
    </button>
  );
}

// ─── LiveProjectButton ───────────────────────────────────────────────────────
function LiveProjectButton() {
  return (
    <button
      style={{
        borderRadius: "9999px",
        border: "2px solid #D7E2EA",
        color: "#D7E2EA",
        background: "transparent",
        cursor: "pointer",
        fontFamily: "'Kanit', sans-serif",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        transition: "background 0.2s",
      }}
      className="px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10"
    >
      Live Project
    </button>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{ background: "#0C0C0C", overflowX: "clip" }}
      className="h-screen flex flex-col relative"
    >
      {/* Navbar */}
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {["About", "Price", "Projects", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{ color: "#D7E2EA", fontFamily: "'Kanit', sans-serif", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", transition: "opacity 0.2s" }}
              className="text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70"
            >
              {link}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* Hero Heading */}
      <div style={{ overflow: "hidden" }} className="mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
            style={{ fontFamily: "'Kanit', sans-serif" }}
          >
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 flex-1">
        <FadeIn delay={0.35} y={20}>
          <p
            style={{
              color: "#D7E2EA",
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: "1.375",
              fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)",
            }}
            className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Portrait */}
      <FadeIn
        delay={0.6}
        y={30}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
      >
        <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
            alt="Jack portrait"
            style={{ width: "100%", display: "block" }}
          />
        </Magnet>
      </FadeIn>
    </section>
  );
}

// ─── MarqueeSection ───────────────────────────────────────────────────────────
const MARQUEE_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

function MarqueeSection() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(200);

  const row1 = [...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11)];
  const row2 = [...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11)];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const o = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(o);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#0C0C0C", overflow: "hidden" }} className="pt-24 sm:pt-32 md:pt-40 pb-10">
      <div className="flex flex-col gap-3">
        {/* Row 1: moves right */}
        <div
          style={{ display: "flex", gap: "12px", transform: `translateX(${offset - 200}px)`, willChange: "transform" }}
        >
          {row1.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              style={{ width: "420px", height: "270px", borderRadius: "16px", objectFit: "cover", flexShrink: 0 }}
            />
          ))}
        </div>
        {/* Row 2: moves left */}
        <div
          style={{ display: "flex", gap: "12px", transform: `translateX(${-(offset - 200)}px)`, willChange: "transform" }}
        >
          {row2.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              style={{ width: "420px", height: "270px", borderRadius: "16px", objectFit: "cover", flexShrink: 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AboutSection ─────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section
      id="about"
      style={{ background: "#0C0C0C", position: "relative" }}
      className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20"
    >
      {/* Decorative images */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="" className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="" className="w-[100px] sm:w-[140px] md:w-[180px]" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="" className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="" className="w-[130px] sm:w-[170px] md:w-[220px]" />
      </FadeIn>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
            className="text-center leading-relaxed max-w-[560px] font-medium"
            style={{
              color: "#D7E2EA",
              fontFamily: "'Kanit', sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.35rem)",
            }}
          />
          <ContactButton />
        </div>
      </div>
    </section>
  );
}

// ─── ServicesSection ──────────────────────────────────────────────────────────
const SERVICES = [
  { num: "01", name: "3D Modeling", desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations." },
  { num: "02", name: "Rendering", desc: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life." },
  { num: "03", name: "Motion Design", desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences." },
  { num: "04", name: "Branding", desc: "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence." },
  { num: "05", name: "Web Design", desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience." },
];

function ServicesSection() {
  return (
    <section
      id="price"
      style={{ background: "#FFFFFF", borderTopLeftRadius: "40px", borderTopRightRadius: "40px" }}
      className="sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontFamily: "'Kanit', sans-serif", color: "#0C0C0C", fontSize: "clamp(3rem, 12vw, 160px)", lineHeight: 1 }}
      >
        Services
      </h2>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.num} delay={i * 0.1} y={30}>
            <div
              style={{
                borderTop: i === 0 ? "1px solid rgba(12,12,12,0.15)" : undefined,
                borderBottom: "1px solid rgba(12,12,12,0.15)",
              }}
              className="flex items-start gap-6 md:gap-10 py-8 sm:py-10 md:py-12"
            >
              <span
                className="font-black leading-none flex-shrink-0"
                style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(3rem, 10vw, 140px)", color: "#0C0C0C", lineHeight: 0.9 }}
              >
                {s.num}
              </span>
              <div className="flex flex-col gap-2 pt-2">
                <span
                  className="font-medium uppercase"
                  style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1rem, 2.2vw, 2.1rem)", color: "#0C0C0C" }}
                >
                  {s.name}
                </span>
                <span
                  className="font-light leading-relaxed max-w-2xl"
                  style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)", color: "#0C0C0C", opacity: 0.6 }}
                >
                  {s.desc}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ─── ProjectsSection ──────────────────────────────────────────────────────────
const PROJECTS = [
  {
    num: "01",
    name: "Nextlevel Studio",
    category: "Client",
    col1img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    col1img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    col2img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    num: "02",
    name: "Aura Brand Identity",
    category: "Personal",
    col1img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    col1img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    col2img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    num: "03",
    name: "Solaris Digital",
    category: "Client",
    col1img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    col1img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    col2img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

function ProjectCard({ project, index, totalCards, scrollRef }) {
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const range = [index / totalCards, 1];
  const scale = useTransform(scrollYProgress, range, [1, targetScale]);

  return (
    <div style={{ height: "85vh", position: "relative" }}>
      <motion.div
        style={{
          scale,
          top: `${24 + index * 28}px`,
          position: "sticky",
          background: "#0C0C0C",
          border: "2px solid #D7E2EA",
          borderRadius: "40px",
        }}
        className="sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8"
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-4 md:gap-6">
            <span
              className="font-black leading-none"
              style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(3rem, 10vw, 140px)", color: "#D7E2EA", lineHeight: 0.9, opacity: 0.3 }}
            >
              {project.num}
            </span>
            <div className="flex flex-col">
              <span style={{ color: "#D7E2EA", fontFamily: "'Kanit', sans-serif", fontSize: "clamp(0.7rem, 1.2vw, 1rem)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {project.category}
              </span>
              <span style={{ color: "#D7E2EA", fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1rem, 2.5vw, 2rem)", fontWeight: 700, textTransform: "uppercase" }}>
                {project.name}
              </span>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Image grid */}
        <div style={{ display: "flex", gap: "12px" }}>
          {/* Left col: 40% */}
          <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", gap: "12px" }}>
            <img
              src={project.col1img1}
              alt=""
              style={{
                width: "100%",
                height: "clamp(130px, 16vw, 230px)",
                objectFit: "cover",
                borderRadius: "40px",
              }}
              className="sm:rounded-[50px] md:rounded-[60px]"
            />
            <img
              src={project.col1img2}
              alt=""
              style={{
                width: "100%",
                height: "clamp(160px, 22vw, 340px)",
                objectFit: "cover",
                borderRadius: "40px",
              }}
              className="sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
          {/* Right col: 60% */}
          <div style={{ flex: "0 0 calc(60% - 12px)" }}>
            <img
              src={project.col2img}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "40px",
              }}
              className="sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectsSection() {
  const sectionRef = useRef(null);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ background: "#0C0C0C", borderTopLeftRadius: "40px", borderTopRightRadius: "40px", position: "relative", zIndex: 10, marginTop: "-40px" }}
      className="sm:rounded-t-[50px] md:rounded-t-[60px] sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-20"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Project
        </h2>
      </FadeIn>

      <div>
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.num}
            project={project}
            index={i}
            totalCards={PROJECTS.length}
            scrollRef={sectionRef}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { background: #0C0C0C; font-family: 'Kanit', sans-serif; }
        .hero-heading {
          background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <div style={{ background: "#0C0C0C", overflowX: "clip" }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
      </div>
    </>
  );
}

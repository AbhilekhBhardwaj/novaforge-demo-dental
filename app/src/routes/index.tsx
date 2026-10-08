import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { IconPauseMedia, IconPhone, IconPlayMedia } from "../components/site/icons";
import { useOfficeStatus, useSiteMotion } from "../components/site/useSiteMotion";
import { About, Footer, Reviews, Services, Visit } from "../components/site/sections";
import { DESC, PHONE, SITE, TEL, TITLE } from "../components/site/business";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Brightwell Family Dental",
  url: SITE + "/",
  image: SITE + "/assets/og.jpg",
  logo: SITE + "/apple-touch-icon.png",
  telephone: "+1-555-019-0173",
  description: DESC,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Suite 200, Example Commons",
    addressLocality: "Cary",
    addressRegion: "NC",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  makesOffer: ["General dentistry", "Dental cleanings", "Teeth whitening", "Emergency dental care"].map(
    (name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } }),
  ),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: SITE + "/" },
      { property: "og:site_name", content: "Brightwell Family Dental" },
      { property: "og:image", content: SITE + "/assets/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "A dentist chatting with a smiling patient in a sunlit treatment room at Brightwell Family Dental" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SITE + "/assets/og.jpg" },
      { name: "theme-color", content: "#0E3A40" },
    ],
    links: [
      { rel: "canonical", href: SITE + "/" },
      { rel: "preload", href: "/assets/hero-poster.webp", as: "image", media: "(min-width: 701px)" },
      { rel: "preload", href: "/assets/hero-poster-sm.webp", as: "image", media: "(max-width: 700px)" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Index,
});

function Index() {
  useSiteMotion();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <a className="fab" href={TEL} aria-label={`Call Brightwell Family Dental at ${PHONE}`}>
        <IconPhone /> Call us
      </a>
    </>
  );
}

function Logo({ light }: { light?: boolean }) {
  return (
    <a className="brand" href="#top" aria-label="Brightwell Family Dental, back to top">
      <img src="/assets/logo-mark.svg" alt="" width={40} height={40} />
      <span className="brand-name" style={light ? { color: "#fff" } : undefined}>
        Brightwell
        <span className="brand-sub">Family Dental</span>
      </span>
    </a>
  );
}

function Header() {
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Logo />
        <nav className="nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#reviews">Reviews</a>
          <a href="#visit">Visit</a>
        </nav>
        <a className="call-pill" href={TEL} aria-label={`Call ${PHONE}`}>
          <IconPhone />
          <span>{PHONE}</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  const status = useOfficeStatus();

  useEffect(() => {
    // The video is created outside React so hydration can never replace it,
    // and every attribute iOS Safari checks for inline autoplay is set before
    // the element enters the DOM. The poster stays as the container's CSS
    // background, visible only until the first frame paints.
    const host = mediaRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 700px)").matches;
    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.loop = true;
    video.preload = "auto";
    video.disablePictureInPicture = true;
    video.setAttribute("aria-hidden", "true");
    video.poster = small ? "/assets/hero-poster-sm.webp" : "/assets/hero-poster.webp";
    video.autoplay = !reduce.matches;
    const source = document.createElement("source");
    source.src = small ? "/assets/hero-loop-sm.mp4" : "/assets/hero-loop.mp4";
    source.type = "video/mp4";
    video.appendChild(source);

    const sync = () => setPlaying(!video.paused);
    const attempt = () => {
      if (!reduce.matches && !userPaused.current) void video.play().catch(() => undefined);
    };
    ["play", "playing", "pause"].forEach((t) => video.addEventListener(t, sync));
    video.addEventListener("canplay", attempt, { once: true });
    // Strict low-power modes may only allow playback after a first touch.
    window.addEventListener("touchstart", attempt, { once: true, passive: true });

    host.appendChild(video);
    videoRef.current = video;
    attempt();
    return () => {
      window.removeEventListener("touchstart", attempt);
      video.pause();
      video.remove();
      videoRef.current = null;
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play().catch(() => undefined);
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div
        className="hero-media"
        data-depth="0.4"
        data-anchor="top"
        ref={mediaRef}
      />
      <div className="hero-shade" />
      <div className="wrap hero-copy" data-depth="0.16" data-anchor="top">
        <h1 id="hero-title">Family dentistry in Cary, with extra care for nervous patients.</h1>
        <p className="hero-lede">
          Checkups, cleanings, whitening and emergency visits for the whole family. If it&rsquo;s been a
          while, or your last visit went badly, tell us when you call.
        </p>
        <div className="hero-ctas">
          <a className="cta-call" href={TEL}>
            Call {PHONE}
          </a>
          <p className="hero-hours" aria-live="polite">
            {status ? (status.open ? "Open now, until 5pm" : "Closed now. Open Mon to Fri, 8am to 5pm") : "Mon to Fri, 8am to 5pm"}
          </p>
        </div>
      </div>
      <button
        className="vid-toggle"
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
      >
        {playing ? <IconPauseMedia /> : <IconPlayMedia />}
      </button>
    </section>
  );
}

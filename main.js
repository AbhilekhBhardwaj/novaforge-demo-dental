(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Hero video ----------
   * The video is created in script so every attribute iOS Safari checks for
   * inline autoplay is set before the element enters the DOM. The poster stays
   * as the container's CSS background, visible only until the first frame paints.
   */
  const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';

  const host = document.querySelector(".hero-media");
  const toggleBtn = document.querySelector(".vid-toggle");
  if (host && toggleBtn) {
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

    let userPaused = false;
    let playing = null;
    const sync = () => {
      const now = !video.paused;
      if (now === playing) return;
      playing = now;
      toggleBtn.setAttribute("aria-label", playing ? "Pause background video" : "Play background video");
      toggleBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    };
    const attempt = () => {
      if (!reduce.matches && !userPaused) video.play().catch(() => undefined);
    };
    ["play", "playing", "pause"].forEach((t) => video.addEventListener(t, sync));
    video.addEventListener("canplay", attempt, { once: true });
    // Strict low-power modes may only allow playback after a first touch.
    window.addEventListener("touchstart", attempt, { once: true, passive: true });

    toggleBtn.addEventListener("click", () => {
      if (video.paused) {
        userPaused = false;
        video.play().catch(() => undefined);
      } else {
        userPaused = true;
        video.pause();
      }
    });

    host.appendChild(video);
    attempt();
  }

  /* ---------- Office status in Cary (America/New_York), from the listed hours only ---------- */
  function getOfficeStatus(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(now);
    const get = (t) => (parts.find((p) => p.type === t) || {}).value || "";
    const day = get("weekday");
    const minutes = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
    const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day);
    const open = weekday && minutes >= 8 * 60 && minutes < 17 * 60;
    return { day, weekday, open };
  }

  const heroHours = document.querySelector(".hero-hours");
  const hourRows = Array.from(document.querySelectorAll(".hours li"));
  const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hoursList = document.querySelector(".hours");
  let openState = null;

  function renderStatus() {
    const status = getOfficeStatus();
    if (heroHours) {
      heroHours.textContent = status.open ? "Open now, until 5pm" : "Closed now. Open Mon to Fri, 8am to 5pm";
    }
    hourRows.forEach((li, i) => {
      if (SHORT_DAYS[i] === status.day) li.className = "today";
      else li.removeAttribute("class");
    });
    if (hoursList) {
      if (!openState) {
        openState = document.createElement("p");
        openState.className = "open-state";
        hoursList.after(openState);
      }
      openState.textContent = status.open ? "Open now." : "Closed right now.";
    }
  }
  renderStatus();
  window.setInterval(renderStatus, 60000);

  /* ---------- Scroll motion ----------
   * Transform-only parallax. Every [data-depth] element is shifted relative to
   * its parent's distance from the viewport centre. Positive depth lags behind
   * the scroll (far layers). Disabled entirely for prefers-reduced-motion.
   */
  const header = document.querySelector(".hdr");
  const fab = document.querySelector(".fab");
  const layers = Array.from(document.querySelectorAll("[data-depth]"));
  let raf = 0;

  const frame = () => {
    raf = 0;
    const vh = window.innerHeight;
    const y = window.scrollY;
    if (header) header.classList.toggle("is-solid", y > vh * 0.6);
    if (fab) fab.classList.toggle("show", y > vh * 0.8);
    if (reduce.matches) return;
    const scale = window.innerWidth < 700 ? 0.6 : 1;
    for (const el of layers) {
      const parent = el.parentElement;
      if (!parent) continue;
      const r = parent.getBoundingClientRect();
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
      const depth = parseFloat(el.dataset.depth || "0") * scale;
      const fromCentre = r.top + r.height / 2 - vh / 2;
      const anchor = el.dataset.anchor === "top" ? r.top : fromCentre;
      el.style.transform = `translate3d(0, ${(-anchor * depth).toFixed(2)}px, 0)`;
    }
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  frame();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  reduce.addEventListener("change", () => {
    if (reduce.matches) layers.forEach((el) => (el.style.transform = ""));
    request();
  });
})();

import { useEffect, useState } from "react";

/**
 * Transform-only scroll parallax. Every [data-depth] element is shifted
 * relative to its parent's distance from the viewport centre. Positive depth
 * lags behind the scroll (far layers), negative depth leads it (near layers).
 * Disabled entirely for prefers-reduced-motion.
 */
export function useSiteMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const header = document.querySelector<HTMLElement>(".hdr");
    const fab = document.querySelector<HTMLElement>(".fab");
    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]"));
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      header?.classList.toggle("is-solid", y > vh * 0.6);
      fab?.classList.toggle("show", y > vh * 0.8);
      if (reduce.matches) return;
      const scale = window.innerWidth < 700 ? 0.6 : 1;
      for (const el of layers) {
        const host = el.parentElement;
        if (!host) continue;
        const r = host.getBoundingClientRect();
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
    const onReduceChange = () => {
      if (reduce.matches) layers.forEach((el) => (el.style.transform = ""));
      request();
    };

    frame();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    reduce.addEventListener("change", onReduceChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      reduce.removeEventListener("change", onReduceChange);
    };
  }, []);
}

/** Office status in Cary (America/New_York), from the listed hours only. */
export function getOfficeStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = get("weekday");
  const minutes = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
  const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day);
  const open = weekday && minutes >= 8 * 60 && minutes < 17 * 60;
  return { day, weekday, open };
}

export function useOfficeStatus() {
  const [status, setStatus] = useState<ReturnType<typeof getOfficeStatus> | null>(null);
  useEffect(() => {
    setStatus(getOfficeStatus());
    const id = window.setInterval(() => setStatus(getOfficeStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

import { useOfficeStatus } from "./useSiteMotion";
import { PHONE, TEL } from "./business";

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

export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <div className="plate">
          <img
            data-depth="0.09"
            src="/assets/about-room.webp"
            alt="One of our treatment rooms: a teal dental chair with a knit blanket and headphones, next to a sunny window"
            width={1000}
            height={1250}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about-text">
          <h2 id="about-title">Checkups without the dread.</h2>
          <p className="about-lede">
            We&rsquo;re a family practice in Cary. We see kids, parents and grandparents for routine
            care, and we handle dental emergencies too.
          </p>
          <p>
            A lot of the people who come to us are nervous about dental work. So we take things
            slowly and explain each step before we start.
          </p>
          <ul className="notes">
            <li>
              <b>Been a while?</b> That&rsquo;s fine. Just mention it when you call.
            </li>
            <li>
              <b>Something hurts or broke?</b> Call us the day it happens.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    title: "General dentistry",
    body: "Checkups, exams and everyday care for every age, from a child's first visit onward.",
  },
  {
    title: "Cleanings",
    body: "Regular cleanings to keep teeth and gums healthy between checkups.",
  },
  {
    title: "Whitening",
    body: "Professional whitening. Ask us which option suits your teeth.",
  },
];

export function Services() {
  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="wrap svc-layout">
        <h2 id="services-title">What we do</h2>
        <ul className="svc-list">
          {SERVICES.map(({ title, body }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
          <li className="svc-urgent">
            <h3>Emergency care</h3>
            <p>
              Toothache, a cracked tooth, a lost filling. Call as soon as it happens:{" "}
              <a href={TEL}>{PHONE}</a>
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

const REVIEWS = [
  { quote: "First dentist visit in years I didn't dread. Staff explained everything clearly.", name: "Wesley H." },
  { quote: "Got me in same-day for a cracked tooth. Genuinely grateful.", name: "Alicia M." },
  { quote: "Clean office, friendly staff, no unnecessary upsells.", name: "Tom K." },
];

export function Reviews() {
  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="wrap reviews-grid">
        <div className="reviews-photo" aria-hidden="true">
          <img data-depth="0.08" src="/assets/sill.webp" alt="" width={1400} height={933} loading="lazy" decoding="async" />
        </div>
        <div>
          <h2 id="reviews-title">From our patients</h2>
          <div className="quotes">
            {REVIEWS.map((r) => (
              <figure className="quote" key={r.name}>
                <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption>{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const DAYS = [
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
];

export function Visit() {
  const status = useOfficeStatus();
  return (
    <section className="visit" id="visit" aria-labelledby="visit-title">
      <div className="wrap">
        <h2 id="visit-title">Visit us</h2>
        <div className="visit-grid">
          <div className="visit-hours">
            <h3>Hours</h3>
            <ul className="hours">
              {DAYS.map(([short, long]) => (
                <li key={short} className={status?.day === short ? "today" : undefined}>
                  <span>{long}</span>
                  <span>8am to 5pm</span>
                </li>
              ))}
            </ul>
            {status && <p className="open-state">{status.open ? "Open now." : "Closed right now."}</p>}
            <h3 className="visit-call">Call</h3>
            <a className="big-phone" href={TEL}>
              {PHONE}
            </a>
          </div>
          <div className="visit-loc">
            <h3>Address</h3>
            <address>
              Suite 200, Example Commons
              <br />
              Cary, NC
            </address>
            <div className="map">
              <iframe
                title="Map of the Cary, North Carolina area"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-78.8600%2C35.7500%2C-78.7000%2C35.8300&layer=mapnik"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="loc-note">The map shows Cary in general, not our exact building.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div>
            <Logo light />
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={TEL}>{PHONE}</a></li>
              <li>Suite 200, Example Commons</li>
              <li>Cary, NC</li>
            </ul>
          </div>
          <div>
            <h4>Hours</h4>
            <ul>
              <li>Monday to Friday</li>
              <li>8am to 5pm</li>
            </ul>
          </div>
        </div>
        <div className="ftr-base">
          <span>&copy; 2026 Brightwell Family Dental</span>
          <span>Concept project by Novaforge Studio — not an operating business.</span>
        </div>
      </div>
    </footer>
  );
}

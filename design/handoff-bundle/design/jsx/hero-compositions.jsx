/* Blackbrowed Labs — Homepage (Option C: centered) ·
   DE + EN · light desktop / dark desktop / mobile light */

/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

/* ---------- Icons (Lucide-style, 1.5 stroke, rounded caps) ---------- */

function IconArrowRight({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
         stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function IconSun({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
         stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconMoon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
         stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function IconMenu({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
         stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function IconGithub({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.17 7.69 10.66.56.1.76-.24.76-.54 0-.27-.01-.98-.02-1.93-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3.01 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.57.23 2.72.11 3.01.72.79 1.16 1.8 1.16 3.03 0 4.33-2.63 5.26-5.14 5.54.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54 4.46-1.49 7.68-5.7 7.68-10.66C23.25 5.48 18.27.5 12 .5Z"/>
    </svg>
  );
}

/* ---------- Brand mark (arc) ---------- */

const ARC_PATH = "M 14 96 C 60 82, 100 56, 138 36 C 152 28, 166 25, 180 28 C 208 40, 244 64, 286 86 C 244 78, 214 60, 190 48 C 178 45, 168 45, 158 48 C 138 54, 114 68, 84 80 C 62 93, 40 99, 20 102 L 14 96 Z";

function ArcMark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 300 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path fill="currentColor" d={ARC_PATH} />
    </svg>
  );
}

/* ---------- Copy (DE + EN) ---------- */

const COPY = {
  de: {
    homeAria: "Blackbrowed Labs — Startseite",
    menuOpen: "Menü öffnen",
    themeToggle: "Erscheinungsbild wechseln",
    langGroup: "Sprachauswahl",
    navAria: "Hauptnavigation",
    nav: [
      { label: "Produkte", href: "/produkte" },
      { label: "Über",     href: "/ueber" },
      { label: "Kontakt",  href: "/kontakt" },
    ],
    activeLang: "DE",
    heroEyebrow: null,
    heroH1: ["Präzise Werkzeuge", "für den Unterricht."],
    heroLead: "Blackbrowed Labs ist ein kleines Softwarestudio in Reinbek bei Hamburg. Ich entwickle Werkzeuge für die Klassenführung — Software, die Lehrkräften im Schulalltag Arbeit abnimmt.",
    heroLink: "Was hier gerade entsteht",
    heroLinkHref: "/produkte",
    secEyebrow: "Ansatz",
    secH2: "Nah an der Praxis",
    secBody: "Die Software hier entsteht aus Gesprächen mit Lehrkräften — was im Unterricht wirklich Zeit kostet, was funktioniert, was nicht. Kein Feature-Katalog, keine großen Versprechen, nur Werkzeuge, die das tun, was sie sollen.",
    footerNavAria: "Fußnavigation",
    footerLinks: [
      { label: "Produkte",    href: "/produkte" },
      { label: "Über",        href: "/ueber" },
      { label: "Kontakt",     href: "/kontakt" },
      { label: "Impressum",   href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
    footerCopy: "© 2026 Blackbrowed Labs. Lars Weiser, Reinbek.",
  },
  en: {
    homeAria: "Blackbrowed Labs — Home",
    menuOpen: "Open menu",
    themeToggle: "Toggle appearance",
    langGroup: "Language",
    navAria: "Primary navigation",
    nav: [
      { label: "Products", href: "/en/products" },
      { label: "About",    href: "/en/about" },
      { label: "Contact",  href: "/en/contact" },
    ],
    activeLang: "EN",
    heroEyebrow: null,
    heroH1: ["Precise tools", "for teaching."],
    heroLead: "Blackbrowed Labs is a small software studio in Reinbek, near Hamburg. I build tools for classroom management — software that takes work off teachers' plates.",
    heroLink: "What's being built",
    heroLinkHref: "/en/products",
    secEyebrow: "Approach",
    secH2: "Close to the work",
    secBody: "The software here grows out of conversations with teachers — what really costs time in the classroom, what works, what doesn't. No feature catalogue, no big promises, just tools that do what they're meant to do.",
    footerNavAria: "Footer navigation",
    footerLinks: [
      { label: "Products", href: "/en/products" },
      { label: "About",    href: "/en/about" },
      { label: "Contact",  href: "/en/contact" },
      { label: "Legal",    href: "/en/legal" },
      { label: "Privacy",  href: "/en/privacy" },
    ],
    footerCopy: "© 2026 Blackbrowed Labs. Lars Weiser, Reinbek.",
  },
};

/* ---------- Shared chrome ---------- */

function Logo({ aria }) {
  return (
    <a href="#" className="bbl-logo" aria-label={aria}>
      <svg className="bbl-logo-mark" viewBox="0 0 300 120" aria-hidden="true">
        <path fill="currentColor" d={ARC_PATH} />
      </svg>
      <span className="bbl-wordmark">Blackbrowed Labs</span>
    </a>
  );
}

function TopNav({ mode = "desktop", theme = "light", t }) {
  if (mode === "mobile") {
    return (
      <header className="bbl-nav bbl-nav--mobile">
        <div className="bbl-nav-inner">
          <Logo aria={t.homeAria} />
          <button type="button" className="bbl-hamburger" aria-label={t.menuOpen}>
            <IconMenu />
          </button>
        </div>
      </header>
    );
  }
  const isDE = t.activeLang === "DE";
  return (
    <header className="bbl-nav">
      <div className="bbl-nav-inner">
        <Logo aria={t.homeAria} />
        <nav className="bbl-nav-links" aria-label={t.navAria}>
          {t.nav.map((n) => (
            <a key={n.label} href={n.href}>{n.label}</a>
          ))}
        </nav>
        <div className="bbl-nav-meta">
          <div className="bbl-lang" role="group" aria-label={t.langGroup}>
            <button type="button"
              className={"bbl-lang-btn" + (isDE ? " is-active" : "")}
              aria-pressed={isDE ? "true" : "false"}>DE</button>
            <span className="bbl-lang-sep" aria-hidden="true">/</span>
            <button type="button"
              className={"bbl-lang-btn" + (!isDE ? " is-active" : "")}
              aria-pressed={!isDE ? "true" : "false"}>EN</button>
          </div>
          <button type="button" className="bbl-theme" aria-label={t.themeToggle}>
            {theme === "dark" ? <IconMoon /> : <IconSun />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ variant = "desktop", t }) {
  const arcClass = variant === "mobile" ? "hero-arc" : "hero-arc hero-arc--desktop";
  return (
    <section className="hero" aria-labelledby="hero-h1">
      <div className="hero-inner">
        <div className={arcClass}>
          <ArcMark />
        </div>
        <h1 id="hero-h1" className="display">
          {t.heroH1[0]}<br />{t.heroH1[1]}
        </h1>
        <p className="lead">{t.heroLead}</p>
        <a href={t.heroLinkHref} className="bbl-arrow-link">
          {t.heroLink}
          <IconArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

function SecondarySection({ t }) {
  return (
    <section className="bbl-secondary" aria-labelledby="sec-h2">
      <div className="bbl-secondary-inner">
        <p className="bbl-eyebrow">{t.secEyebrow}</p>
        <h2 id="sec-h2">{t.secH2}</h2>
        <p className="lead">{t.secBody}</p>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="bbl-footer">
      <div className="bbl-footer-inner">
        <div className="bbl-footer-brand">
          <Logo aria={t.homeAria} />
        </div>
        <nav className="bbl-footer-nav" aria-label={t.footerNavAria}>
          <ul>
            {t.footerLinks.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="bbl-footer-meta">
          <a href="https://github.com/blackbrowed-labs" className="bbl-github">
            <IconGithub />
            <span>GitHub</span>
          </a>
          <p className="caption bbl-muted">{t.footerCopy}</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

function Homepage({ mode = "desktop", theme = "light", lang = "de", label }) {
  const t = COPY[lang];
  const scopeClass = theme === "dark" ? "dark-scope" : "";
  const pageClass = "bbl-page" + (mode === "mobile" ? " bbl-page--mobile" : "");
  return (
    <div className={scopeClass} style={{ width: "100%", height: "100%" }} lang={lang}>
      <div className={pageClass} data-screen-label={label}>
        <TopNav mode={mode} theme={theme} t={t} />
        <main>
          <Hero variant={mode} t={t} />
          <SecondarySection t={t} />
        </main>
        <Footer t={t} />
      </div>
    </div>
  );
}

function App({ lang = "de" }) {
  const isDE = lang === "de";
  return (
    <DesignCanvas
      title={isDE
        ? "Blackbrowed Labs — Homepage (Option C · DE)"
        : "Blackbrowed Labs — Homepage (Option C · EN)"}
      initialZoom={0.42}
    >
      <DCSection
        id={isDE ? "c-de" : "c-en"}
        title={isDE ? "Option C · zentriert · final" : "Option C · centered · final"}
        subtitle={isDE
          ? "Licht · Dunkel · Mobil (360) — nur Deutsch"
          : "Light · Dark · Mobile (360) — English"}
      >
        <DCArtboard
          id="light-desktop"
          label={isDE ? "Licht · Desktop" : "Light · Desktop"}
          subtitle={isDE
            ? "1440 × 900 · Hero füllt Viewport − Nav"
            : "1440 × 900 · Hero fills viewport − nav"}
          width={1440}
          height={900}
        >
          <Homepage mode="desktop" theme="light" lang={lang}
            label={isDE ? "Licht — Desktop" : "Light — Desktop"} />
        </DCArtboard>
        <DCArtboard
          id="dark-desktop"
          label={isDE ? "Dunkel · Desktop" : "Dark · Desktop"}
          subtitle={isDE
            ? "Gleiche Komposition, umgemappte Tokens"
            : "Same composition, remapped tokens"}
          width={1440}
          height={900}
        >
          <Homepage mode="desktop" theme="dark" lang={lang}
            label={isDE ? "Dunkel — Desktop" : "Dark — Desktop"} />
        </DCArtboard>
        <DCArtboard
          id="light-mobile"
          label={isDE ? "Mobil · 360 · Licht" : "Mobile · 360 · Light"}
          subtitle={isDE
            ? "Hamburger-Navigation, Footer einspaltig"
            : "Hamburger nav, single-column footer"}
          width={360}
          height={900}
        >
          <Homepage mode="mobile" theme="light" lang={lang}
            label={isDE ? "Licht — Mobil" : "Light — Mobile"} />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

window.BBLApp = App;

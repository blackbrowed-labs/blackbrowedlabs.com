/* Blackbrowed Labs — Products index (empty state) · DE + EN
   Light desktop · Dark desktop · Mobile 360 light */

/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

const ARC_PATH_P = "M 14 96 C 60 82, 100 56, 138 36 C 152 28, 166 25, 180 28 C 208 40, 244 64, 286 86 C 244 78, 214 60, 190 48 C 178 45, 168 45, 158 48 C 138 54, 114 68, 84 80 C 62 93, 40 99, 20 102 L 14 96 Z";

/* ---------- Icons ---------- */
function PIconSun({ s = 18 }) { return (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
); }
function PIconMoon({ s = 18 }) { return (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
); }
function PIconMenu({ s = 22 }) { return (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
); }
function PIconGithub({ s = 16 }) { return (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.17 7.69 10.66.56.1.76-.24.76-.54 0-.27-.01-.98-.02-1.93-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3.01 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.57.23 2.72.11 3.01.72.79 1.16 1.8 1.16 3.03 0 4.33-2.63 5.26-5.14 5.54.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54 4.46-1.49 7.68-5.7 7.68-10.66C23.25 5.48 18.27.5 12 .5Z"/>
  </svg>
); }

/* ---------- Copy ---------- */
const PCOPY = {
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
    active: "DE",
    railHome: "Blackbrowed Labs",
    railCurrent: "Produkte",
    metaLabel: "Status",
    metaValue: "In Arbeit",
    h1: "Produkte",
    p1: "Hier entstehen die Produkte von Blackbrowed Labs. Der Schwerpunkt liegt auf der Klassenführung: eine iPad-App, die Noten, Schülerleistungen und Beobachtungen ohne Papierkram verwaltet, sowie ein Claude-Cowork-Plugin für die Unterrichtsplanung.",
    p2: "Sobald das erste Werkzeug veröffentlicht ist, findet sich an dieser Stelle eine kurze Beschreibung, die aktuelle Version und die jüngsten Release Notes — dazu ein Link zur jeweiligen Produktwebsite.",
    closing: "Bis dahin: Geduld. Gute Werkzeuge brauchen Zeit.",
    sidenote1: "Diese Seite ist kein Platzhalter.",
    sidenote2: "Produkte erscheinen erst hier, wenn sie so weit sind. Jeder Eintrag bekommt eine eigene Website.",
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
    active: "EN",
    railHome: "Blackbrowed Labs",
    railCurrent: "Products",
    metaLabel: "Status",
    metaValue: "In progress",
    h1: "Products",
    p1: "This is where the products from Blackbrowed Labs will live. The focus is on classroom management: an iPad app for grades, student work, and observations without the paperwork, and a Claude Cowork plugin for lesson planning.",
    p2: "Once the first tool ships, this page will show a short description, the current version, and the most recent release notes — alongside a link to the product's own site.",
    closing: "Until then: patience. Good tools take time.",
    sidenote1: "This page is not a placeholder.",
    sidenote2: "Products appear here once they're ready. Each gets its own site.",
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

/* ---------- Shared pieces (scoped to products) ---------- */

function PLogo({ aria }) {
  return (
    <a href="#" className="bbl-logo" aria-label={aria}>
      <svg className="bbl-logo-mark" viewBox="0 0 300 120" aria-hidden="true">
        <path fill="currentColor" d={ARC_PATH_P} />
      </svg>
      <span className="bbl-wordmark">Blackbrowed Labs</span>
    </a>
  );
}

function PTopNav({ mode, theme, t }) {
  if (mode === "mobile") {
    return (
      <header className="bbl-nav bbl-nav--mobile">
        <div className="bbl-nav-inner">
          <PLogo aria={t.homeAria} />
          <button type="button" className="bbl-hamburger" aria-label={t.menuOpen}>
            <PIconMenu />
          </button>
        </div>
      </header>
    );
  }
  const isDE = t.active === "DE";
  return (
    <header className="bbl-nav">
      <div className="bbl-nav-inner">
        <PLogo aria={t.homeAria} />
        <nav className="bbl-nav-links" aria-label={t.navAria}>
          {t.nav.map((n) => (
            <a key={n.label} href={n.href}
               className={n.label === t.railCurrent ? "is-current" : ""}>
              {n.label}
            </a>
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
            {theme === "dark" ? <PIconMoon /> : <PIconSun />}
          </button>
        </div>
      </div>
    </header>
  );
}

function PFooter({ t }) {
  return (
    <footer className="bbl-footer">
      <div className="bbl-footer-inner">
        <div className="bbl-footer-brand">
          <PLogo aria={t.homeAria} />
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
            <PIconGithub />
            <span>GitHub</span>
          </a>
          <p className="caption bbl-muted">{t.footerCopy}</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Products page ---------- */

function ProductsPage({ mode = "desktop", theme = "light", lang = "de", label }) {
  const t = PCOPY[lang];
  const scopeClass = theme === "dark" ? "dark-scope" : "";
  const pageClass = "bbl-page prod-page" + (mode === "mobile" ? " prod-page--mobile" : "");
  return (
    <div className={scopeClass} style={{ width: "100%", height: "100%" }} lang={lang}>
      <div className={pageClass} data-screen-label={label}>
        <PTopNav mode={mode} theme={theme} t={t} />
        <main>
          {/* Breadcrumb / rail */}
          <div className="prod-rail">
            <div className="prod-rail-inner">
              <a href="#">{t.railHome}</a>
              <span className="prod-rail-sep" aria-hidden="true">/</span>
              <span className="prod-rail-current">{t.railCurrent}</span>
            </div>
          </div>

          {/* Main content */}
          <section className="prod-main">
            {/* Atmospheric arc */}
            <div className="prod-atmos" aria-hidden="true">
              <svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid meet">
                <path fill="currentColor" d={ARC_PATH_P} />
              </svg>
            </div>

            <div className="prod-container">
              <aside className="prod-meta" aria-hidden={mode === "mobile" ? undefined : undefined}>
                <p className="prod-meta-label">{t.metaLabel}</p>
                <p className="prod-meta-value">{t.metaValue}</p>
              </aside>

              <article className="prod-content">
                <h1>{t.h1}</h1>
                <p className="prod-lead">{t.p1}</p>
                <p className="prod-lead">{t.p2}</p>
                <div className="prod-closing">
                  <p>{t.closing}</p>
                </div>
              </article>
            </div>
          </section>
        </main>
        <PFooter t={t} />
      </div>
    </div>
  );
}

function PApp() {
  return (
    <DesignCanvas
      title="Blackbrowed Labs — Produkte / Products (leerer Zustand)"
      initialZoom={0.38}
    >
      <DCSection
        id="products-de"
        title="Produkte — Deutsch"
        subtitle="Licht · Dunkel · Mobil"
      >
        <DCArtboard id="p-de-light" label="Licht · Desktop · DE"
          subtitle="1440 × 900 · asymmetrisch, Lesehaltung"
          width={1440} height={900}>
          <ProductsPage mode="desktop" theme="light" lang="de" label="Produkte — Licht Desktop" />
        </DCArtboard>
        <DCArtboard id="p-de-dark" label="Dunkel · Desktop · DE"
          subtitle="Gleiche Komposition, dunkle Tokens"
          width={1440} height={900}>
          <ProductsPage mode="desktop" theme="dark" lang="de" label="Produkte — Dunkel Desktop" />
        </DCArtboard>
        <DCArtboard id="p-de-mobile" label="Mobil · 360 · DE"
          subtitle="Einspaltig, Seitennotiz unten"
          width={360} height={900}>
          <ProductsPage mode="mobile" theme="light" lang="de" label="Produkte — Mobil" />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="products-en"
        title="Products — English"
        subtitle="Light · Dark · Mobile"
      >
        <DCArtboard id="p-en-light" label="Light · Desktop · EN"
          subtitle="1440 × 900 · asymmetric, reading posture"
          width={1440} height={900}>
          <ProductsPage mode="desktop" theme="light" lang="en" label="Products — Light Desktop" />
        </DCArtboard>
        <DCArtboard id="p-en-dark" label="Dark · Desktop · EN"
          subtitle="Same composition, dark tokens"
          width={1440} height={900}>
          <ProductsPage mode="desktop" theme="dark" lang="en" label="Products — Dark Desktop" />
        </DCArtboard>
        <DCArtboard id="p-en-mobile" label="Mobile · 360 · EN"
          subtitle="Single column, side note below"
          width={360} height={900}>
          <ProductsPage mode="mobile" theme="light" lang="en" label="Products — Mobile" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

window.PApp = PApp;

/* Blackbrowed Labs — Contact page · DE + EN */
/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

const ARC_PATH_C = "M 14 96 C 60 82, 100 56, 138 36 C 152 28, 166 25, 180 28 C 208 40, 244 64, 286 86 C 244 78, 214 60, 190 48 C 178 45, 168 45, 158 48 C 138 54, 114 68, 84 80 C 62 93, 40 99, 20 102 L 14 96 Z";

const cSvg = { fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
function CIconSun() { return (<svg viewBox="0 0 24 24" width="18" height="18" {...cSvg}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>); }
function CIconMoon() { return (<svg viewBox="0 0 24 24" width="18" height="18" {...cSvg}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>); }
function CIconMenu() { return (<svg viewBox="0 0 24 24" width="22" height="22" {...cSvg}><path d="M4 7h16M4 12h16M4 17h16" /></svg>); }
function CIconGithub() { return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.17 7.69 10.66.56.1.76-.24.76-.54 0-.27-.01-.98-.02-1.93-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3.01 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.57.23 2.72.11 3.01.72.79 1.16 1.8 1.16 3.03 0 4.33-2.63 5.26-5.14 5.54.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54 4.46-1.49 7.68-5.7 7.68-10.66C23.25 5.48 18.27.5 12 .5Z"/></svg>); }
function CIconGithubSmall() { return (<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.17 7.69 10.66.56.1.76-.24.76-.54 0-.27-.01-.98-.02-1.93-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3.01 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.57.23 2.72.11 3.01.72.79 1.16 1.8 1.16 3.03 0 4.33-2.63 5.26-5.14 5.54.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54 4.46-1.49 7.68-5.7 7.68-10.66C23.25 5.48 18.27.5 12 .5Z"/></svg>); }

const CCOPY = {
  de: {
    homeAria: "Blackbrowed Labs — Startseite",
    menuOpen: "Menü öffnen", themeToggle: "Erscheinungsbild wechseln",
    langGroup: "Sprachauswahl", navAria: "Hauptnavigation",
    nav: [
      { label: "Produkte", href: "/produkte" },
      { label: "Über",     href: "/ueber" },
      { label: "Kontakt",  href: "/kontakt" },
    ],
    active: "DE", currentNav: "Kontakt",
    railHome: "Blackbrowed Labs",
    railCurrent: "Kontakt",
    h1: "Kontakt",
    emailFrame: "Direkt per E-Mail",
    email: "lars@blackbrowedlabs.com",
    githubFrame: "Code und Produktentwicklung auf GitHub",
    githubHandle: "blackbrowed-labs",
    footerNavAria: "Fußnavigation",
    footerLinks: [
      { label: "Produkte", href: "/produkte" },
      { label: "Über", href: "/ueber" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
    footerCopy: "© 2026 Blackbrowed Labs. Lars Weiser, Reinbek.",
  },
  en: {
    homeAria: "Blackbrowed Labs — Home",
    menuOpen: "Open menu", themeToggle: "Toggle appearance",
    langGroup: "Language", navAria: "Primary navigation",
    nav: [
      { label: "Products", href: "/en/products" },
      { label: "About",    href: "/en/about" },
      { label: "Contact",  href: "/en/contact" },
    ],
    active: "EN", currentNav: "Contact",
    railHome: "Blackbrowed Labs",
    railCurrent: "Contact",
    h1: "Contact",
    emailFrame: "Email directly",
    email: "lars@blackbrowedlabs.com",
    githubFrame: "Code and product development on GitHub",
    githubHandle: "blackbrowed-labs",
    footerNavAria: "Footer navigation",
    footerLinks: [
      { label: "Products", href: "/en/products" },
      { label: "About", href: "/en/about" },
      { label: "Contact", href: "/en/contact" },
      { label: "Legal", href: "/en/legal" },
      { label: "Privacy", href: "/en/privacy" },
    ],
    footerCopy: "© 2026 Blackbrowed Labs. Lars Weiser, Reinbek.",
  },
};

function CLogo({ aria }) {
  return (
    <a href="#" className="bbl-logo" aria-label={aria}>
      <svg className="bbl-logo-mark" viewBox="0 0 300 120" aria-hidden="true">
        <path fill="currentColor" d={ARC_PATH_C} />
      </svg>
      <span className="bbl-wordmark">Blackbrowed Labs</span>
    </a>
  );
}

function CTopNav({ mode, theme, t }) {
  if (mode === "mobile") {
    return (
      <header className="bbl-nav bbl-nav--mobile">
        <div className="bbl-nav-inner">
          <CLogo aria={t.homeAria} />
          <button type="button" className="bbl-hamburger" aria-label={t.menuOpen}>
            <CIconMenu />
          </button>
        </div>
      </header>
    );
  }
  const isDE = t.active === "DE";
  return (
    <header className="bbl-nav">
      <div className="bbl-nav-inner">
        <CLogo aria={t.homeAria} />
        <nav className="bbl-nav-links" aria-label={t.navAria}>
          {t.nav.map((n) => (
            <a key={n.label} href={n.href}
               className={n.label === t.currentNav ? "is-current" : ""}>
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
            {theme === "dark" ? <CIconMoon /> : <CIconSun />}
          </button>
        </div>
      </div>
    </header>
  );
}

function CFooter({ t }) {
  return (
    <footer className="bbl-footer">
      <div className="bbl-footer-inner">
        <div className="bbl-footer-brand">
          <CLogo aria={t.homeAria} />
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
            <CIconGithubSmall />
            <span>GitHub</span>
          </a>
          <p className="caption bbl-muted">{t.footerCopy}</p>
        </div>
      </div>
    </footer>
  );
}

function ContactPage({ mode = "desktop", theme = "light", lang = "de", label }) {
  const t = CCOPY[lang];
  const scopeClass = theme === "dark" ? "dark-scope" : "";
  const pageClass = "bbl-page contact-page" +
    (mode === "mobile" ? " contact-page--mobile bbl-page--mobile" : "");
  return (
    <div className={scopeClass} style={{ width: "100%", height: "100%" }} lang={lang}>
      <div className={pageClass} data-screen-label={label}>
        <CTopNav mode={mode} theme={theme} t={t} />
        <main>
          <div className="contact-rail">
            <div className="contact-rail-inner">
              <a href="#">{t.railHome}</a>
              <span className="contact-rail-sep" aria-hidden="true">/</span>
              <span className="contact-rail-current">{t.railCurrent}</span>
            </div>
          </div>

          <section className="contact-main">
            <div className="contact-container">
              <div className="contact-content">
                <h1>{t.h1}</h1>

                <div className="contact-block">
                  <p className="contact-frame">{t.emailFrame}</p>
                  <a className="contact-link" href={`mailto:${t.email}`}>{t.email}</a>
                </div>

                <div className="contact-block">
                  <p className="contact-frame">{t.githubFrame}</p>
                  <a className="contact-link" href="https://github.com/blackbrowed-labs">
                    <CIconGithub />
                    <span>{t.githubHandle}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
        <CFooter t={t} />
      </div>
    </div>
  );
}

function CApp() {
  return (
    <DesignCanvas
      title="Blackbrowed Labs — Kontakt / Contact"
      initialZoom={0.4}
    >
      <DCSection id="contact-de" title="Kontakt — Deutsch" subtitle="Licht · Dunkel · Mobil">
        <DCArtboard id="c-de-light" label="Licht · Desktop · DE"
          subtitle="1440 × 900 · kurz und direkt, Visitenkarte statt Trichter"
          width={1440} height={900}>
          <ContactPage mode="desktop" theme="light" lang="de" label="Kontakt — Licht Desktop" />
        </DCArtboard>
        <DCArtboard id="c-de-dark" label="Dunkel · Desktop · DE"
          subtitle="Gleiche Komposition, dunkle Tokens"
          width={1440} height={900}>
          <ContactPage mode="desktop" theme="dark" lang="de" label="Kontakt — Dunkel Desktop" />
        </DCArtboard>
        <DCArtboard id="c-de-mobile" label="Mobil · 360 · DE"
          subtitle="Einspaltig, links verankert"
          width={360} height={900}>
          <ContactPage mode="mobile" theme="light" lang="de" label="Kontakt — Mobil" />
        </DCArtboard>
      </DCSection>

      <DCSection id="contact-en" title="Contact — English" subtitle="Light · Dark · Mobile">
        <DCArtboard id="c-en-light" label="Light · Desktop · EN"
          subtitle="1440 × 900 · short and direct, business card not funnel"
          width={1440} height={900}>
          <ContactPage mode="desktop" theme="light" lang="en" label="Contact — Light Desktop" />
        </DCArtboard>
        <DCArtboard id="c-en-dark" label="Dark · Desktop · EN"
          subtitle="Same composition, dark tokens"
          width={1440} height={900}>
          <ContactPage mode="desktop" theme="dark" lang="en" label="Contact — Dark Desktop" />
        </DCArtboard>
        <DCArtboard id="c-en-mobile" label="Mobile · 360 · EN"
          subtitle="Single column, left-anchored"
          width={360} height={900}>
          <ContactPage mode="mobile" theme="light" lang="en" label="Contact — Mobile" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

window.CApp = CApp;

/* Blackbrowed Labs — Impressum / Legal Notice · DE + EN */
/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

const ARC_PATH_I = "M 14 96 C 60 82, 100 56, 138 36 C 152 28, 166 25, 180 28 C 208 40, 244 64, 286 86 C 244 78, 214 60, 190 48 C 178 45, 168 45, 158 48 C 138 54, 114 68, 84 80 C 62 93, 40 99, 20 102 L 14 96 Z";

const iSvg = { fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
function IIconSun() { return (<svg viewBox="0 0 24 24" width="18" height="18" {...iSvg}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>); }
function IIconMoon() { return (<svg viewBox="0 0 24 24" width="18" height="18" {...iSvg}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>); }
function IIconMenu() { return (<svg viewBox="0 0 24 24" width="22" height="22" {...iSvg}><path d="M4 7h16M4 12h16M4 17h16"/></svg>); }
function IIconGithub() { return (<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.17 7.69 10.66.56.1.76-.24.76-.54 0-.27-.01-.98-.02-1.93-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3.01 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.57.23 2.72.11 3.01.72.79 1.16 1.8 1.16 3.03 0 4.33-2.63 5.26-5.14 5.54.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54 4.46-1.49 7.68-5.7 7.68-10.66C23.25 5.48 18.27.5 12 .5Z"/></svg>); }

const ICOPY = {
  de: {
    homeAria: "Blackbrowed Labs — Startseite",
    menuOpen: "Menü öffnen", themeToggle: "Erscheinungsbild wechseln",
    langGroup: "Sprachauswahl", navAria: "Hauptnavigation",
    nav: [
      { label: "Produkte", href: "/produkte" },
      { label: "Über",     href: "/ueber" },
      { label: "Kontakt",  href: "/kontakt" },
    ],
    active: "DE", currentNav: null,
    railHome: "Blackbrowed Labs", railCurrent: "Impressum",
    h1: "Impressum",
    courtesy: null,
    lede: "Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz):",
    address: ["Lars Weiser", "Blackbrowed Labs", "Schröders Stieg 8a", "21465 Reinbek", "Deutschland"],
    sections: [
      { h: "Kontakt", body: <>E-Mail: <a href="mailto:lars@blackbrowedlabs.com">lars@blackbrowedlabs.com</a></> },
      { h: "Umsatzsteuer", body: "Kleinunternehmer gemäß § 19 UStG. Es wird keine Umsatzsteuer ausgewiesen." },
      { h: "USt-IdNr. gemäß § 27a UStG", body: "DE461658750" },
      { h: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV", body: "Lars Weiser (Anschrift wie oben)" },
      { h: "Haftungsausschluss", body: "Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen." },
      { h: "Urheberrecht", body: "Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors." },
    ],
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
    active: "EN", currentNav: null,
    railHome: "Blackbrowed Labs", railCurrent: "Legal Notice",
    h1: "Legal Notice",
    courtesy: "This is a courtesy translation. The German version is legally authoritative.",
    lede: "Information pursuant to § 5 DDG (German Digital Services Act):",
    address: ["Lars Weiser", "Blackbrowed Labs", "Schröders Stieg 8a", "21465 Reinbek", "Germany"],
    sections: [
      { h: "Contact", body: <>Email: <a href="mailto:lars@blackbrowedlabs.com">lars@blackbrowedlabs.com</a></> },
      { h: "VAT", body: "Small-business exemption under § 19 UStG. No VAT is charged." },
      { h: "VAT Identification Number per § 27a UStG", body: "DE461658750" },
      { h: "Responsible for content per § 18 (2) MStV", body: "Lars Weiser (address as above)" },
      { h: "Liability for Content", body: "The contents of this website have been created with the greatest care. However, no guarantee can be given for the accuracy, completeness, or currency of the content. As a service provider, I am responsible for my own content on these pages pursuant to § 7 (1) DDG. According to §§ 8 to 10 DDG, as a service provider I am not obliged to monitor transmitted or stored third-party information or to investigate circumstances indicating illegal activity." },
      { h: "Copyright", body: "The content and works on this website created by the site operator are subject to German copyright law. Duplication, processing, distribution, and any form of exploitation outside the limits of copyright law require the written consent of the respective author." },
    ],
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

function ILogo({ aria }) {
  return (
    <a href="#" className="bbl-logo" aria-label={aria}>
      <svg className="bbl-logo-mark" viewBox="0 0 300 120" aria-hidden="true">
        <path fill="currentColor" d={ARC_PATH_I} />
      </svg>
      <span className="bbl-wordmark">Blackbrowed Labs</span>
    </a>
  );
}

function ITopNav({ mode, theme, t }) {
  if (mode === "mobile") {
    return (
      <header className="bbl-nav bbl-nav--mobile">
        <div className="bbl-nav-inner">
          <ILogo aria={t.homeAria} />
          <button type="button" className="bbl-hamburger" aria-label={t.menuOpen}><IIconMenu /></button>
        </div>
      </header>
    );
  }
  const isDE = t.active === "DE";
  return (
    <header className="bbl-nav">
      <div className="bbl-nav-inner">
        <ILogo aria={t.homeAria} />
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
            <button type="button" className={"bbl-lang-btn" + (isDE ? " is-active" : "")} aria-pressed={isDE ? "true" : "false"}>DE</button>
            <span className="bbl-lang-sep" aria-hidden="true">/</span>
            <button type="button" className={"bbl-lang-btn" + (!isDE ? " is-active" : "")} aria-pressed={!isDE ? "true" : "false"}>EN</button>
          </div>
          <button type="button" className="bbl-theme" aria-label={t.themeToggle}>
            {theme === "dark" ? <IIconMoon /> : <IIconSun />}
          </button>
        </div>
      </div>
    </header>
  );
}

function IFooter({ t }) {
  return (
    <footer className="bbl-footer">
      <div className="bbl-footer-inner">
        <div className="bbl-footer-brand"><ILogo aria={t.homeAria} /></div>
        <nav className="bbl-footer-nav" aria-label={t.footerNavAria}>
          <ul>
            {t.footerLinks.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="bbl-footer-meta">
          <a href="https://github.com/blackbrowed-labs" className="bbl-github">
            <IIconGithub /><span>GitHub</span>
          </a>
          <p className="caption bbl-muted">{t.footerCopy}</p>
        </div>
      </div>
    </footer>
  );
}

function ImpressumPage({ mode = "desktop", theme = "light", lang = "de", label }) {
  const t = ICOPY[lang];
  const scopeClass = theme === "dark" ? "dark-scope" : "";
  const pageClass = "bbl-page impressum-page" +
    (mode === "mobile" ? " impressum-page--mobile bbl-page--mobile" : "");
  return (
    <div className={scopeClass} style={{ width: "100%", height: "100%" }} lang={lang}>
      <div className={pageClass} data-screen-label={label}>
        <ITopNav mode={mode} theme={theme} t={t} />
        <main>
          <div className="impressum-rail">
            <div className="impressum-rail-inner">
              <a href="#">{t.railHome}</a>
              <span className="impressum-rail-sep" aria-hidden="true">/</span>
              <span className="impressum-rail-current">{t.railCurrent}</span>
            </div>
          </div>

          <section className="impressum-main">
            <div className="impressum-container">
              <div className="impressum-content">
                <h1>{t.h1}</h1>

                {t.courtesy && (
                  <p className="impressum-courtesy">{t.courtesy}</p>
                )}

                <p className="impressum-lede">{t.lede}</p>

                <address className="impressum-address">
                  {t.address.map((line, i) => (
                    <span key={i}>{line}{i < t.address.length - 1 && <br />}</span>
                  ))}
                </address>

                {t.sections.map((sec, i) => (
                  <div className="impressum-section" key={i}>
                    <h3>{sec.h}</h3>
                    <p className="impressum-p">{sec.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <IFooter t={t} />
      </div>
    </div>
  );
}

function IApp() {
  return (
    <DesignCanvas
      title="Blackbrowed Labs — Impressum / Legal Notice"
      initialZoom={0.34}
    >
      <DCSection id="impressum-de" title="Impressum — Deutsch" subtitle="Licht · Dunkel · Mobil">
        <DCArtboard id="i-de-light" label="Licht · Desktop · DE"
          subtitle="1440 × 2200 · Leseseite, Rechtsinhalte mit editorialer Sorgfalt"
          width={1440} height={2200}>
          <ImpressumPage mode="desktop" theme="light" lang="de" label="Impressum — Licht Desktop" />
        </DCArtboard>
        <DCArtboard id="i-de-dark" label="Dunkel · Desktop · DE"
          subtitle="Gleiche Komposition, dunkle Tokens"
          width={1440} height={2200}>
          <ImpressumPage mode="desktop" theme="dark" lang="de" label="Impressum — Dunkel Desktop" />
        </DCArtboard>
        <DCArtboard id="i-de-mobile" label="Mobil · 360 · DE"
          subtitle="Einspaltig, links verankert"
          width={360} height={2600}>
          <ImpressumPage mode="mobile" theme="light" lang="de" label="Impressum — Mobil" />
        </DCArtboard>
      </DCSection>

      <DCSection id="impressum-en" title="Legal Notice — English" subtitle="Light · Dark · Mobile">
        <DCArtboard id="i-en-light" label="Light · Desktop · EN"
          subtitle="1440 × 2200 · reading page with courtesy-translation note"
          width={1440} height={2200}>
          <ImpressumPage mode="desktop" theme="light" lang="en" label="Legal Notice — Light Desktop" />
        </DCArtboard>
        <DCArtboard id="i-en-dark" label="Dark · Desktop · EN"
          subtitle="Same composition, dark tokens"
          width={1440} height={2200}>
          <ImpressumPage mode="desktop" theme="dark" lang="en" label="Legal Notice — Dark Desktop" />
        </DCArtboard>
        <DCArtboard id="i-en-mobile" label="Mobile · 360 · EN"
          subtitle="Single column, left-anchored"
          width={360} height={2700}>
          <ImpressumPage mode="mobile" theme="light" lang="en" label="Legal Notice — Mobile" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

window.IApp = IApp;

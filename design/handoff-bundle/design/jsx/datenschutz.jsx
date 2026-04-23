/* Blackbrowed Labs — Datenschutz / Privacy Policy · DE + EN */
/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

const ARC_PATH_DS = "M 14 96 C 60 82, 100 56, 138 36 C 152 28, 166 25, 180 28 C 208 40, 244 64, 286 86 C 244 78, 214 60, 190 48 C 178 45, 168 45, 158 48 C 138 54, 114 68, 84 80 C 62 93, 40 99, 20 102 L 14 96 Z";

const dsSvg = { fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
function DsIconSun() { return (<svg viewBox="0 0 24 24" width="18" height="18" {...dsSvg}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>); }
function DsIconMoon() { return (<svg viewBox="0 0 24 24" width="18" height="18" {...dsSvg}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>); }
function DsIconMenu() { return (<svg viewBox="0 0 24 24" width="22" height="22" {...dsSvg}><path d="M4 7h16M4 12h16M4 17h16"/></svg>); }
function DsIconGithub() { return (<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.17 7.69 10.66.56.1.76-.24.76-.54 0-.27-.01-.98-.02-1.93-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3.01 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.57.23 2.72.11 3.01.72.79 1.16 1.8 1.16 3.03 0 4.33-2.63 5.26-5.14 5.54.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54 4.46-1.49 7.68-5.7 7.68-10.66C23.25 5.48 18.27.5 12 .5Z"/></svg>); }

const DS_SECTIONS_DE = [
  { id: "s1", h: "Verantwortlicher", body: (
    <>
      <p className="ds-p">Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze ist:</p>
      <address className="ds-address">
        Lars Weiser<br/>Blackbrowed Labs<br/>Schröders Stieg 8a<br/>21465 Reinbek<br/>Deutschland
      </address>
      <p className="ds-p">E-Mail: <a href="mailto:lars@blackbrowedlabs.com">lars@blackbrowedlabs.com</a></p>
    </>
  )},
  { id: "s2", h: "Allgemeine Hinweise", body: (
    <p className="ds-p">Diese Website verarbeitet personenbezogene Daten ausschließlich in dem Umfang, der zum technischen Betrieb der Seite notwendig ist. Es werden keine Kontaktformulare angeboten, keine Benutzerkonten geführt, keine Newsletter versendet und keine Tracking-Cookies gesetzt. Die Nutzung der Website ist in der Regel ohne Angabe personenbezogener Daten möglich.</p>
  )},
  { id: "s3", h: "Hosting und Server-Logs", body: (
    <>
      <p className="ds-p">Diese Website wird auf der Infrastruktur von Cloudflare, Inc. gehostet (101 Townsend St, San Francisco, CA 94107, USA). Cloudflare verarbeitet beim Aufruf der Website technisch notwendige Daten, insbesondere:</p>
      <ul className="ds-list">
        <li>IP-Adresse</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>aufgerufene Seite</li>
        <li>Browsertyp und -version</li>
        <li>Betriebssystem</li>
        <li>Referrer-URL</li>
      </ul>
      <p className="ds-p">Diese Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren und stabilen Betrieb der Website) und ist für die Auslieferung der Website technisch erforderlich. Cloudflare speichert diese Daten in Form von Server-Logs. Die Speicherdauer wird auf ein technisch notwendiges Minimum begrenzt.</p>
      <p className="ds-p">Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert, sodass für Datenübermittlungen in die USA ein angemessenes Datenschutzniveau nach Art. 45 DSGVO sichergestellt ist. Zusätzlich besteht zwischen dem Verantwortlichen und Cloudflare ein Auftragsverarbeitungsvertrag (Data Processing Addendum) nach Art. 28 DSGVO.</p>
      <p className="ds-p">Weitere Informationen zum Datenschutz bei Cloudflare: <a href="https://www.cloudflare.com/privacypolicy/">cloudflare.com/privacypolicy</a></p>
    </>
  )},
  { id: "s4", h: "Analyse: Cloudflare Web Analytics", body: (
    <>
      <p className="ds-p">Zur Reichweitenmessung wird Cloudflare Web Analytics eingesetzt. Dieser Dienst arbeitet cookiefrei und ohne Fingerprinting. Es werden ausschließlich aggregierte Nutzungsstatistiken erhoben (Seitenaufrufe, Referrer, ungefähre geografische Herkunft auf Länderebene). Eine Identifizierung einzelner Besucher ist weder vorgesehen noch möglich.</p>
      <p className="ds-p">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer datenschutzfreundlichen Reichweitenmessung).</p>
    </>
  )},
  { id: "s5", h: "E-Mail-Kommunikation", body: (
    <>
      <p className="ds-p">Wenn Sie mich per E-Mail kontaktieren (z. B. über die auf der Kontaktseite angegebene Adresse), wird Ihre Nachricht zur Bearbeitung gespeichert. Das zugehörige E-Mail-Postfach wird bei der IONOS SE (Elgendorfer Straße 57, 56410 Montabaur, Deutschland) betrieben.</p>
      <p className="ds-p">Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung Ihrer Anfrage). Die E-Mails werden so lange gespeichert, wie es für die Bearbeitung erforderlich ist, und anschließend gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
      <p className="ds-p">Weitere Informationen zum Datenschutz bei IONOS: <a href="https://www.ionos.de/terms-gtc/terms-privacy">ionos.de/terms-gtc/terms-privacy</a></p>
    </>
  )},
  { id: "s6", h: "Keine Weitergabe an Dritte", body: (
    <p className="ds-p">Eine Weitergabe Ihrer personenbezogenen Daten an Dritte findet — über die oben genannten Auftragsverarbeiter (Cloudflare, IONOS) hinaus — nicht statt.</p>
  )},
  { id: "s7", h: "Keine Cookies außerhalb technischer Notwendigkeit", body: (
    <p className="ds-p">Diese Website setzt keine Cookies zu Analyse-, Marketing- oder Tracking-Zwecken. Sollten technisch notwendige Cookies (z. B. durch den Schutzmechanismus von Cloudflare) zum Einsatz kommen, erfolgt dies auf Grundlage von § 25 Abs. 2 Nr. 2 TDDDG.</p>
  )},
  { id: "s8", h: "Keine Social-Media-Plugins oder externen Einbettungen", body: (
    <p className="ds-p">Diese Website bindet keine Inhalte von Drittanbietern ein (keine YouTube-Videos, keine Twitter-/X-Einbettungen, keine Google Fonts, keine externen Skripte). Alle Ressourcen werden vom eigenen Server ausgeliefert.</p>
  )},
  { id: "s9", h: "Ihre Rechte", body: (
    <>
      <p className="ds-p">Sie haben nach der DSGVO folgende Rechte:</p>
      <ul className="ds-list">
        <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
        <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
        <li>Recht auf Löschung (Art. 17 DSGVO)</li>
        <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
      </ul>
      <p className="ds-p">Zur Ausübung dieser Rechte genügt eine formlose E-Mail an <a href="mailto:lars@blackbrowedlabs.com">lars@blackbrowedlabs.com</a>.</p>
    </>
  )},
  { id: "s10", h: "Beschwerderecht bei der Aufsichtsbehörde", body: (
    <>
      <p className="ds-p">Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Für den Verantwortlichen zuständig ist:</p>
      <address className="ds-address">
        Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein (ULD)<br/>
        Holstenstraße 98<br/>24103 Kiel<br/>
        Telefon: +49 431 988-1200<br/>
        E-Mail: <a href="mailto:mail@datenschutzzentrum.de">mail@datenschutzzentrum.de</a><br/>
        Web: <a href="https://www.datenschutzzentrum.de">datenschutzzentrum.de</a>
      </address>
    </>
  )},
  { id: "s11", h: "Änderungen dieser Datenschutzerklärung", body: (
    <p className="ds-p">Diese Datenschutzerklärung wird angepasst, wenn sich die tatsächliche Datenverarbeitung auf der Website ändert (z. B. durch Einführung eines Kontaktformulars oder zusätzlicher Dienste). Die jeweils aktuelle Version ist unter blackbrowedlabs.com/datenschutz abrufbar.</p>
  )},
];

const DS_SECTIONS_EN = [
  { id: "s1", h: "Controller", body: (
    <>
      <p className="ds-p">The controller under the General Data Protection Regulation (GDPR) and other national data protection laws is:</p>
      <address className="ds-address">
        Lars Weiser<br/>Blackbrowed Labs<br/>Schröders Stieg 8a<br/>21465 Reinbek<br/>Germany
      </address>
      <p className="ds-p">Email: <a href="mailto:lars@blackbrowedlabs.com">lars@blackbrowedlabs.com</a></p>
    </>
  )},
  { id: "s2", h: "General", body: (
    <p className="ds-p">This website processes personal data only to the extent necessary to operate the site. There are no contact forms, no user accounts, no newsletters, and no tracking cookies. The site can generally be used without providing personal data.</p>
  )},
  { id: "s3", h: "Hosting and Server Logs", body: (
    <>
      <p className="ds-p">This website is hosted on Cloudflare, Inc.'s infrastructure (101 Townsend St, San Francisco, CA 94107, USA). When you access the site, Cloudflare processes technically necessary data, including:</p>
      <ul className="ds-list">
        <li>IP address</li>
        <li>Date and time of access</li>
        <li>Page requested</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Referrer URL</li>
      </ul>
      <p className="ds-p">This processing is based on Art. 6 (1) (f) GDPR (legitimate interest in secure and stable operation of the site) and is technically required for delivering the website. Cloudflare stores this data in server logs. Retention is limited to what is technically necessary.</p>
      <p className="ds-p">Cloudflare is certified under the EU-US Data Privacy Framework, ensuring an adequate level of data protection for transfers to the United States per Art. 45 GDPR. A Data Processing Addendum under Art. 28 GDPR is in place between the controller and Cloudflare.</p>
      <p className="ds-p">Cloudflare's privacy policy: <a href="https://www.cloudflare.com/privacypolicy/">cloudflare.com/privacypolicy</a></p>
    </>
  )},
  { id: "s4", h: "Analytics: Cloudflare Web Analytics", body: (
    <>
      <p className="ds-p">Cloudflare Web Analytics is used to measure site usage. This service operates without cookies and without fingerprinting. Only aggregate usage statistics are collected (page views, referrer, approximate country-level geolocation). Identification of individual visitors is neither intended nor possible.</p>
      <p className="ds-p">Legal basis: Art. 6 (1) (f) GDPR (legitimate interest in privacy-friendly analytics).</p>
    </>
  )},
  { id: "s5", h: "Email Communication", body: (
    <>
      <p className="ds-p">If you contact me by email (e.g. using the address on the contact page), your message is stored for processing. The mailbox is operated by IONOS SE (Elgendorfer Straße 57, 56410 Montabaur, Germany).</p>
      <p className="ds-p">Legal basis: Art. 6 (1) (b) GDPR (pre-contractual measures) or Art. 6 (1) (f) GDPR (legitimate interest in responding to your inquiry). Emails are retained as long as necessary to process the inquiry and then deleted, unless statutory retention periods apply.</p>
      <p className="ds-p">IONOS privacy information: <a href="https://www.ionos.com/terms-gtc/terms-privacy">ionos.com/terms-gtc/terms-privacy</a></p>
    </>
  )},
  { id: "s6", h: "No Disclosure to Third Parties", body: (
    <p className="ds-p">Your personal data is not disclosed to third parties beyond the processors listed above (Cloudflare, IONOS).</p>
  )},
  { id: "s7", h: "No Non-Essential Cookies", body: (
    <p className="ds-p">This website does not set cookies for analytics, marketing, or tracking. Technically necessary cookies (e.g. from Cloudflare's security layer) are set on the basis of § 25 (2) no. 2 TDDDG.</p>
  )},
  { id: "s8", h: "No Social Media Plugins or External Embeds", body: (
    <p className="ds-p">This website does not embed third-party content (no YouTube videos, no Twitter/X embeds, no Google Fonts, no external scripts). All resources are served from the site's own origin.</p>
  )},
  { id: "s9", h: "Your Rights", body: (
    <>
      <p className="ds-p">Under GDPR, you have the following rights:</p>
      <ul className="ds-list">
        <li>Right of access (Art. 15 GDPR)</li>
        <li>Right to rectification (Art. 16 GDPR)</li>
        <li>Right to erasure (Art. 17 GDPR)</li>
        <li>Right to restriction of processing (Art. 18 GDPR)</li>
        <li>Right to data portability (Art. 20 GDPR)</li>
        <li>Right to object (Art. 21 GDPR)</li>
      </ul>
      <p className="ds-p">To exercise these rights, an informal email to <a href="mailto:lars@blackbrowedlabs.com">lars@blackbrowedlabs.com</a> is sufficient.</p>
    </>
  )},
  { id: "s10", h: "Right to Lodge a Complaint", body: (
    <>
      <p className="ds-p">You have the right to lodge a complaint with a data protection supervisory authority. The authority responsible for the controller is:</p>
      <address className="ds-address">
        Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein (ULD)<br/>
        Holstenstraße 98<br/>24103 Kiel<br/>Germany<br/>
        Phone: +49 431 988-1200<br/>
        Email: <a href="mailto:mail@datenschutzzentrum.de">mail@datenschutzzentrum.de</a><br/>
        Web: <a href="https://www.datenschutzzentrum.de">datenschutzzentrum.de</a>
      </address>
    </>
  )},
  { id: "s11", h: "Changes to this Privacy Policy", body: (
    <p className="ds-p">This privacy policy will be updated if the actual data processing on the site changes (e.g. if a contact form or additional services are introduced). The current version is available at blackbrowedlabs.com/en/privacy.</p>
  )},
];

const DSCOPY = {
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
    railHome: "Blackbrowed Labs", railCurrent: "Datenschutz",
    h1: "Datenschutzerklärung",
    stand: "Stand: [DATUM EINFÜGEN]",
    courtesy: null,
    tocLabel: "Inhaltsverzeichnis",
    sections: DS_SECTIONS_DE,
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
    railHome: "Blackbrowed Labs", railCurrent: "Privacy",
    h1: "Privacy Policy",
    stand: "Last updated: [INSERT DATE]",
    courtesy: "This is a courtesy translation. The German version is legally authoritative.",
    tocLabel: "Contents",
    sections: DS_SECTIONS_EN,
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

function DsLogo({ aria }) {
  return (
    <a href="#" className="bbl-logo" aria-label={aria}>
      <svg className="bbl-logo-mark" viewBox="0 0 300 120" aria-hidden="true">
        <path fill="currentColor" d={ARC_PATH_DS} />
      </svg>
      <span className="bbl-wordmark">Blackbrowed Labs</span>
    </a>
  );
}

function DsTopNav({ mode, theme, t }) {
  if (mode === "mobile") {
    return (
      <header className="bbl-nav bbl-nav--mobile">
        <div className="bbl-nav-inner">
          <DsLogo aria={t.homeAria} />
          <button type="button" className="bbl-hamburger" aria-label={t.menuOpen}><DsIconMenu /></button>
        </div>
      </header>
    );
  }
  const isDE = t.active === "DE";
  return (
    <header className="bbl-nav">
      <div className="bbl-nav-inner">
        <DsLogo aria={t.homeAria} />
        <nav className="bbl-nav-links" aria-label={t.navAria}>
          {t.nav.map((n) => (
            <a key={n.label} href={n.href}
               className={n.label === t.currentNav ? "is-current" : ""}>{n.label}</a>
          ))}
        </nav>
        <div className="bbl-nav-meta">
          <div className="bbl-lang" role="group" aria-label={t.langGroup}>
            <button type="button" className={"bbl-lang-btn" + (isDE ? " is-active" : "")} aria-pressed={isDE ? "true" : "false"}>DE</button>
            <span className="bbl-lang-sep" aria-hidden="true">/</span>
            <button type="button" className={"bbl-lang-btn" + (!isDE ? " is-active" : "")} aria-pressed={!isDE ? "true" : "false"}>EN</button>
          </div>
          <button type="button" className="bbl-theme" aria-label={t.themeToggle}>
            {theme === "dark" ? <DsIconMoon /> : <DsIconSun />}
          </button>
        </div>
      </div>
    </header>
  );
}

function DsFooter({ t }) {
  return (
    <footer className="bbl-footer">
      <div className="bbl-footer-inner">
        <div className="bbl-footer-brand"><DsLogo aria={t.homeAria} /></div>
        <nav className="bbl-footer-nav" aria-label={t.footerNavAria}>
          <ul>
            {t.footerLinks.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="bbl-footer-meta">
          <a href="https://github.com/blackbrowed-labs" className="bbl-github">
            <DsIconGithub /><span>GitHub</span>
          </a>
          <p className="caption bbl-muted">{t.footerCopy}</p>
        </div>
      </div>
    </footer>
  );
}

function DatenschutzPage({ mode = "desktop", theme = "light", lang = "de", label }) {
  const t = DSCOPY[lang];
  const scopeClass = theme === "dark" ? "dark-scope" : "";
  const pageClass = "bbl-page ds-page" +
    (mode === "mobile" ? " ds-page--mobile bbl-page--mobile" : "");
  return (
    <div className={scopeClass} style={{ width: "100%", height: "100%" }} lang={lang}>
      <div className={pageClass} data-screen-label={label}>
        <DsTopNav mode={mode} theme={theme} t={t} />
        <main>
          <div className="ds-rail">
            <div className="ds-rail-inner">
              <a href="#">{t.railHome}</a>
              <span className="ds-rail-sep" aria-hidden="true">/</span>
              <span className="ds-rail-current">{t.railCurrent}</span>
            </div>
          </div>

          <section className="ds-main">
            <div className="ds-container">
              <div className="ds-content">
                <h1>{t.h1}</h1>
                <p className="ds-stand">{t.stand}</p>
                {t.courtesy && <p className="ds-courtesy">{t.courtesy}</p>}

                <nav className="ds-toc" aria-label={t.tocLabel}>
                  <p className="ds-toc-label">{t.tocLabel}</p>
                  <ol className="ds-toc-list">
                    {t.sections.map((s, i) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`}>
                          <span className="ds-toc-num">{i + 1}.</span>{s.h}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                {t.sections.map((s, i) => (
                  <section className="ds-section" key={s.id} id={s.id}>
                    <h3>
                      <span className="ds-num" aria-hidden="true">{i + 1}.</span>
                      <span className="ds-h-text">{s.h}</span>
                    </h3>
                    {s.body}
                  </section>
                ))}
              </div>
            </div>
          </section>
        </main>
        <DsFooter t={t} />
      </div>
    </div>
  );
}

function DsApp() {
  return (
    <DesignCanvas
      title="Blackbrowed Labs — Datenschutz / Privacy"
      initialZoom={0.28}
    >
      <DCSection id="ds-de" title="Datenschutz — Deutsch" subtitle="Licht · Dunkel · Mobil">
        <DCArtboard id="ds-de-light" label="Licht · Desktop · DE"
          subtitle="1440 × 3400 · lange Leseseite mit Inhaltsverzeichnis"
          width={1440} height={3400}>
          <DatenschutzPage mode="desktop" theme="light" lang="de" label="Datenschutz — Licht Desktop" />
        </DCArtboard>
        <DCArtboard id="ds-de-dark" label="Dunkel · Desktop · DE"
          subtitle="Gleiche Komposition, dunkle Tokens"
          width={1440} height={3400}>
          <DatenschutzPage mode="desktop" theme="dark" lang="de" label="Datenschutz — Dunkel Desktop" />
        </DCArtboard>
        <DCArtboard id="ds-de-mobile" label="Mobil · 360 · DE"
          subtitle="Einspaltig, Inhaltsverzeichnis einspaltig"
          width={360} height={4200}>
          <DatenschutzPage mode="mobile" theme="light" lang="de" label="Datenschutz — Mobil" />
        </DCArtboard>
      </DCSection>

      <DCSection id="ds-en" title="Privacy — English" subtitle="Light · Dark · Mobile">
        <DCArtboard id="ds-en-light" label="Light · Desktop · EN"
          subtitle="1440 × 3400 · with courtesy-translation note + contents"
          width={1440} height={3400}>
          <DatenschutzPage mode="desktop" theme="light" lang="en" label="Privacy — Light Desktop" />
        </DCArtboard>
        <DCArtboard id="ds-en-dark" label="Dark · Desktop · EN"
          subtitle="Same composition, dark tokens"
          width={1440} height={3400}>
          <DatenschutzPage mode="desktop" theme="dark" lang="en" label="Privacy — Dark Desktop" />
        </DCArtboard>
        <DCArtboard id="ds-en-mobile" label="Mobile · 360 · EN"
          subtitle="Single column, single-column TOC"
          width={360} height={4200}>
          <DatenschutzPage mode="mobile" theme="light" lang="en" label="Privacy — Mobile" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

window.DsApp = DsApp;

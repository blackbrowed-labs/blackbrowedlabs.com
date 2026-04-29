/**
 * German (primary) UI strings for the Blackbrowed Labs site shell.
 *
 * Nav does not contain a "Home" entry — the logo is the home link
 * (see plan §7). Legal pages (Impressum, Datenschutz) live in the
 * footer only, not in the primary nav.
 */

export const de = {
  skipLink: 'Zum Hauptinhalt springen',

  siteName: 'Blackbrowed Labs',

  logo: {
    ariaLabel: 'Blackbrowed Labs — zur Startseite',
  },

  breadcrumb: {
    ariaLabel: 'Brotkrümelnavigation',
  },

  nav: {
    ariaLabel: 'Hauptnavigation',
    about: 'Über',
    products: 'Produkte',
    contact: 'Kontakt',
  },

  languageSwitcher: {
    label: 'Sprache',
    de: 'Deutsch',
    en: 'English',
    ariaCurrent: 'Aktuelle Sprache',
  },

  themeToggle: {
    triggerAriaLabel: 'Design wechseln',
    groupLabel: 'Design',
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
  },

  productsIndex: {
    breadcrumb: 'Produkte',
    h1: 'Produkte',
    populatedArrowLabel: 'Mehr erfahren →',
    arcAriaLabel: 'Der Blackbrowed-Labs-Bogen',
  },

  footer: {
    copyright: '© 2026 Blackbrowed Labs. Lars Weiser, Reinbek.',
    about: 'Über',
    github: 'GitHub',
    githubAriaLabel: 'Blackbrowed Labs auf GitHub',
    navAriaLabel: 'Footer-Navigation',
    products: 'Produkte',
    contact: 'Kontakt',
    legal: 'Impressum',
    privacy: 'Datenschutz',
  },

  contactForm: {
    ariaLabel: 'Kontaktformular',

    fields: {
      nameLabel: 'Name',
      emailLabel: 'E-Mail-Adresse',
      messageLabel: 'Nachricht',
      honeypotLabel: 'Website',
      emailFormatHint: 'Bitte eine vollständige E-Mail-Adresse eingeben (z. B. name@domain.de).',
    },

    requiredIndicator: '*',
    requiredIndicatorAriaLabel: 'Pflichtfeld',

    turnstile: {
      attribution: 'Geschützt durch Cloudflare Turnstile',
    },

    privacyNotice: {
      heading: 'Hinweis zum Datenschutz',
      linkLabel: 'Datenschutzerklärung',
    },

    submit: {
      label: 'Senden',
      busy: 'Wird gesendet…',
    },

    success: 'Vielen Dank. Ihre Nachricht ist angekommen.',

    errors: {
      regionAriaLabel: 'Formularstatus',
      validation: 'Bitte alle Pflichtfelder korrekt ausfüllen.',
      turnstile: 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte erneut versuchen.',
      rate_limit: 'Zu viele Versuche. Bitte später erneut versuchen.',
      server: 'Die Nachricht konnte nicht zugestellt werden. Bitte später erneut versuchen oder direkt per E-Mail an lars@blackbrowedlabs.com.',
      generic: 'Es ist ein Fehler aufgetreten. Bitte später erneut versuchen.',
    },
  },
} as const;

type WidenStrings<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? WidenStrings<T[K]>
      : T[K];
};

export type UiStrings = WidenStrings<typeof de>;

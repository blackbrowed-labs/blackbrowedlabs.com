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
} as const;

type WidenStrings<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? WidenStrings<T[K]>
      : T[K];
};

export type UiStrings = WidenStrings<typeof de>;

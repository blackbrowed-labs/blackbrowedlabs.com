/**
 * German (primary) UI strings for the Blackbrowed Labs site shell.
 *
 * Scope is Pass 1: Home + About only. Nav does not contain a "Home"
 * entry — the logo is the home link (see plan §7). Further nav entries
 * (Products, Contact, Impressum, Datenschutz) arrive in Pass 2
 * alongside the pages themselves.
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
  },
} as const;

export type UiStrings = typeof de;

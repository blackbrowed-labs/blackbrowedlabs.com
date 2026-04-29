/**
 * English (secondary) UI strings for the Blackbrowed Labs site shell.
 * Mirror of de.ts — same structure, translated copy.
 */

import type { UiStrings } from './de';

export const en: UiStrings = {
  skipLink: 'Skip to main content',

  siteName: 'Blackbrowed Labs',

  logo: {
    ariaLabel: 'Blackbrowed Labs — back to home',
  },

  breadcrumb: {
    ariaLabel: 'Breadcrumb',
  },

  nav: {
    ariaLabel: 'Main navigation',
    about: 'About',
    products: 'Products',
    contact: 'Contact',
  },

  languageSwitcher: {
    label: 'Language',
    de: 'Deutsch',
    en: 'English',
    ariaCurrent: 'Current language',
  },

  themeToggle: {
    triggerAriaLabel: 'Change theme',
    groupLabel: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },

  productsIndex: {
    breadcrumb: 'Products',
    h1: 'Products',
    populatedArrowLabel: 'Learn more →',
    arcAriaLabel: 'The Blackbrowed Labs arc',
  },

  footer: {
    copyright: '© 2026 Blackbrowed Labs. Lars Weiser, Reinbek.',
    about: 'About',
    github: 'GitHub',
    githubAriaLabel: 'Blackbrowed Labs on GitHub',
    navAriaLabel: 'Footer navigation',
    products: 'Products',
    contact: 'Contact',
    legal: 'Legal',
    privacy: 'Privacy',
  },

  contactForm: {
    ariaLabel: 'Contact form',

    fields: {
      nameLabel: 'Name',
      emailLabel: 'Email address',
      messageLabel: 'Message',
      honeypotLabel: 'Website',
      emailFormatHint: 'Please enter a complete email address (e.g. name@domain.com).',
    },

    requiredIndicator: '*',
    requiredIndicatorAriaLabel: 'Required field',

    turnstile: {
      attribution: 'Protected by Cloudflare Turnstile',
    },

    privacyNotice: {
      heading: 'Privacy notice',
      linkLabel: 'Privacy Policy',
    },

    submit: {
      label: 'Send',
      busy: 'Sending…',
    },

    success: 'Thank you. Your message has arrived.',

    errors: {
      regionAriaLabel: 'Form status',
      validation: 'Please complete all required fields correctly.',
      turnstile: 'The security check failed. Please try again.',
      rate_limit: 'Too many attempts. Please try again later.',
      server: 'The message could not be delivered. Please try again later, or email lars@blackbrowedlabs.com directly.',
      generic: 'Something went wrong. Please try again later.',
    },
  },
};

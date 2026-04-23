/**
 * UI-strings lookup by locale. Components import from here, not from
 * the per-locale files directly, so adding a locale later is a
 * one-file change.
 */

import { de } from './de';
import { en } from './en';
import type { UiStrings } from './de';

export type Locale = 'de' | 'en';

const strings: Record<Locale, UiStrings> = { de, en };

export function getUiStrings(locale: Locale): UiStrings {
  return strings[locale];
}

export type { UiStrings };

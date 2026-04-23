/**
 * Blackbrowed Labs — Tailwind preset
 *
 * Drop this into `tailwind.config.ts` via `presets: [require('./blackbrowed-preset')]`.
 * Colors map to CSS custom properties so light/dark theming is a single
 * `data-theme="dark"` attribute on <html> — no class toggling required.
 *
 * Pair with ./tokens.css (re-exported as design/tokens/colors_and_type.css)
 * which declares the CSS custom properties this preset references.
 *
 * Raw brand hexes (for reference — use the semantic classes instead):
 *
 *   Light mode:
 *     Tussock Gold   #7D4912  (primary — hero, CTAs, headings)
 *     Ridge Teal     #1C5E66  (accent  — links, secondary)
 *     Volcanic Stone #2C2622  (neutral — body, borders)
 *     Peat Ember     #882218  (error, destructive)
 *
 *   Dark mode:
 *     Gold     #D4A45C    Teal     #7CB3BC
 *     Neutral  #E0D8CE    Error    #EC9C8C
 *     bg #1C1C1E   bg-warm #24221F   bg-card #2E2A26   border #4A443E
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand — use like bg-bbl-primary, text-bbl-accent
        "bbl-primary":       "var(--bbl-primary)",
        "bbl-primary-hover": "var(--bbl-primary-hover)",
        "bbl-primary-hc":    "var(--bbl-primary-hc)",

        "bbl-accent":        "var(--bbl-accent)",
        "bbl-accent-hover":  "var(--bbl-accent-hover)",
        "bbl-accent-hc":     "var(--bbl-accent-hc)",

        "bbl-neutral":       "var(--bbl-neutral)",
        "bbl-neutral-hc":    "var(--bbl-neutral-hc)",

        "bbl-error":         "var(--bbl-error)",
        "bbl-error-hover":   "var(--bbl-error-hover)",
        "bbl-error-hc":      "var(--bbl-error-hc)",

        // Surfaces
        "bbl-bg":            "var(--bbl-bg)",
        "bbl-bg-warm":       "var(--bbl-bg-warm)",
        "bbl-bg-card":       "var(--bbl-bg-card)",
        "bbl-border":        "var(--bbl-border)",

        // Functional aliases — preferred in components
        surface:             "var(--color-surface)",
        "surface-warm":      "var(--color-surface-warm)",
        "surface-card":      "var(--color-surface-card)",
        border:              "var(--color-border)",
        text:                "var(--color-text)",
        "text-muted":        "var(--color-text-muted)",
        heading:             "var(--color-heading)",
        link:                "var(--color-link)",
        "link-hover":        "var(--color-link-hover)",
        "focus-ring":        "var(--color-focus-ring)",
        "error-text":        "var(--color-error-text)",
        "error-bg":          "var(--color-error-bg)",
        "cta-bg":            "var(--color-cta-bg)",
        "cta-text":          "var(--color-cta-text)",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "ui-monospace", "Menlo", "Consolas", "monospace"],
      },

      // Weights: 300 / 400 / 500 / 600 only. No 700+.
      fontWeight: {
        light:    "300",
        normal:   "400",
        medium:   "500",
        semibold: "600",
      },

      // Fluid type scale — matches --fs-* tokens
      fontSize: {
        display:  ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h1:       ["clamp(2rem, 4vw, 3rem)",     { lineHeight: "1.1",  letterSpacing: "-0.015em" }],
        h2:       ["clamp(1.5rem, 3vw, 2.25rem)",{ lineHeight: "1.2",  letterSpacing: "-0.01em" }],
        h3:       ["1.375rem",                   { lineHeight: "1.3",  letterSpacing: "-0.005em" }],
        h4:       ["1.125rem",                   { lineHeight: "1.4" }],
        lead:     ["1.1875rem",                  { lineHeight: "1.6" }],
        body:     ["1.0625rem",                  { lineHeight: "1.65" }],
        small:    ["0.9375rem",                  { lineHeight: "1.55" }],
        caption:  ["0.8125rem",                  { lineHeight: "1.45", letterSpacing: "0.02em" }],
      },

      // Spacing — 4-px base, matches --sp-* tokens
      spacing: {
        "sp-0":  "0",
        "sp-1":  "0.25rem",
        "sp-2":  "0.5rem",
        "sp-3":  "0.75rem",
        "sp-4":  "1rem",
        "sp-5":  "1.5rem",
        "sp-6":  "2rem",
        "sp-7":  "3rem",
        "sp-8":  "4rem",
        "sp-9":  "6rem",
        "sp-10": "8rem",
      },

      // Radii — mostly rectangular. No rounded-xl/2xl/full on surfaces.
      borderRadius: {
        "bbl-0": "0",
        "bbl-1": "2px",
        "bbl-2": "4px",
        "bbl-3": "6px",
      },

      // Motion — calm, short
      transitionTimingFunction: {
        bbl: "cubic-bezier(0.2, 0, 0, 1)",
      },
      transitionDuration: {
        "bbl-fast": "120ms",
        "bbl-base": "200ms",
      },

      // Layout
      maxWidth: {
        measure: "70ch",
        container: "1200px",
      },

      // Hairline — use border-[1px] or this utility via extend
      borderWidth: {
        hairline: "1px",
      },
    },
  },
  plugins: [],
};

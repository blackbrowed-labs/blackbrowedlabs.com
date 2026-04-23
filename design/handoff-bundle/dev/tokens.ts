/**
 * Blackbrowed Labs — Design tokens (TypeScript)
 *
 * Single source of truth for non-CSS consumers (MDX frontmatter, Astro
 * server components, JSON serialisation, generated docs). The CSS custom
 * properties in design/tokens/colors_and_type.css are the runtime source
 * of truth; this file mirrors them at build time.
 */

export const colorsLight = {
  bblPrimary:       "#7D4912",
  bblPrimaryHover:  "#6A3D0F",
  bblPrimaryHc:     "#5C360D",

  bblAccent:        "#1C5E66",
  bblAccentHover:   "#174E55",
  bblAccentHc:      "#134B52",

  bblNeutral:       "#2C2622",
  bblNeutralHc:     "#1A1614",

  bblError:         "#882218",
  bblErrorHover:    "#751E15",
  bblErrorHc:       "#6A1C14",

  bblBg:            "#FFFFFF",
  bblBgWarm:        "#FBF7F2",
  bblBgCard:        "#F5F0E9",
  bblBorder:        "#D6CDBE",
} as const;

export const colorsDark = {
  bblPrimary:       "#D4A45C",
  bblPrimaryHover:  "#DFB26E",
  bblPrimaryHc:     "#E2B87A",

  bblAccent:        "#7CB3BC",
  bblAccentHover:   "#8EC1C9",
  bblAccentHc:      "#92C6CE",

  bblNeutral:       "#E0D8CE",
  bblNeutralHc:     "#F0EAE2",

  bblError:         "#EC9C8C",
  bblErrorHover:    "#F0A494",
  bblErrorHc:       "#F0AC9C",

  bblBg:            "#1C1C1E",
  bblBgWarm:        "#24221F",
  bblBgCard:        "#2E2A26",
  bblBorder:        "#4A443E",
} as const;

export const typography = {
  fontSans: `"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`,
  fontMono: `"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace`,
  weights: { light: 300, regular: 400, medium: 500, semibold: 600 } as const,
  sizes: {
    display:  "clamp(2.75rem, 6vw, 4.5rem)",
    h1:       "clamp(2rem, 4vw, 3rem)",
    h2:       "clamp(1.5rem, 3vw, 2.25rem)",
    h3:       "1.375rem",
    h4:       "1.125rem",
    lead:     "1.1875rem",
    body:     "1.0625rem",
    small:    "0.9375rem",
    caption:  "0.8125rem",
  } as const,
  lineHeights: {
    display: 1.05, h1: 1.1, h2: 1.2, h3: 1.3, h4: 1.4,
    lead: 1.6, body: 1.65, small: 1.55, caption: 1.45,
  } as const,
  tracking: {
    display: "-0.02em", h1: "-0.015em", h2: "-0.01em", h3: "-0.005em",
    caption: "0.02em", wordmark: "0.10em",
  } as const,
} as const;

export const spacing = {
  sp0: "0",
  sp1: "0.25rem",  // 4
  sp2: "0.5rem",   // 8
  sp3: "0.75rem",  // 12
  sp4: "1rem",     // 16
  sp5: "1.5rem",   // 24
  sp6: "2rem",     // 32
  sp7: "3rem",     // 48
  sp8: "4rem",     // 64
  sp9: "6rem",     // 96
  sp10: "8rem",    // 128
} as const;

export const radii = {
  r0: "0",
  r1: "2px",
  r2: "4px",
  r3: "6px",
} as const;

export const motion = {
  ease: "cubic-bezier(0.2, 0, 0, 1)",
  durFast: "120ms",
  durBase: "200ms",
} as const;

export const layout = {
  measure: "70ch",
  containerMax: "1200px",
  hairline: "1px",
} as const;

export const brand = {
  name: "Blackbrowed Labs",
  tagline: {
    de: "Präzise Werkzeuge für den Unterricht.",
    en: "Precise tools for teaching.",
  },
  // The arc path — used at every scale. viewBox 0 0 300 120.
  arcPath:
    "M 14 96 C 60 82, 100 56, 138 36 C 152 28, 166 25, 180 28 C 208 40, 244 64, 286 86 C 244 78, 214 60, 190 48 C 178 45, 168 45, 158 48 C 138 54, 114 68, 84 80 C 62 93, 40 99, 20 102 L 14 96 Z",
} as const;

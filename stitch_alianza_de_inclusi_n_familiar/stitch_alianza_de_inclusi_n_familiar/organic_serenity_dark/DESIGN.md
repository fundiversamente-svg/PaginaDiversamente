---
name: Organic Serenity Dark
colors:
  surface: '#131412'
  surface-dim: '#131412'
  surface-bright: '#393937'
  surface-container-lowest: '#0e0e0d'
  surface-container-low: '#1b1c1a'
  surface-container: '#1f201e'
  surface-container-high: '#2a2a28'
  surface-container-highest: '#343533'
  on-surface: '#e4e2de'
  on-surface-variant: '#d5c3ba'
  inverse-surface: '#e4e2de'
  inverse-on-surface: '#30312e'
  outline: '#9e8d86'
  outline-variant: '#51443e'
  surface-tint: '#f4ba9c'
  primary: '#f4ba9c'
  on-primary: '#4b2712'
  primary-container: '#8c5e45'
  on-primary-container: '#ffe4d7'
  inverse-primary: '#80543c'
  secondary: '#c0cba7'
  on-secondary: '#2b331a'
  secondary-container: '#414a2e'
  on-secondary-container: '#afb996'
  tertiary: '#e9c349'
  on-tertiary: '#3c2f00'
  tertiary-container: '#cca72f'
  on-tertiary-container: '#4e3d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#f4ba9c'
  on-primary-fixed: '#311302'
  on-primary-fixed-variant: '#653d26'
  secondary-fixed: '#dce7c1'
  secondary-fixed-dim: '#c0cba7'
  on-secondary-fixed: '#161e07'
  on-secondary-fixed-variant: '#414a2e'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#131412'
  on-background: '#e4e2de'
  surface-variant: '#343533'
typography:
  headline-xl:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  caption:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is rooted in the philosophy of "nurtured growth." It serves an audience seeking support, clarity, and a sense of belonging. The aesthetic combines **Modern Minimalism** with **Tactile Warmth**, prioritizing emotional safety and professional reliability.

The visual narrative is now expressed through a **Dark Mode** interface, creating a digital sanctuary that feels intimate, protective, and high-end. Every interaction should feel intentional and gentle, avoiding sharp edges or aggressive transitions, mirroring the sophistication of the provided logo against a deep, nocturnal canvas.

## Colors

The palette is derived directly from the organic tones of the "Diversamente" logo, optimized for a dark color mode to maintain earthiness and vitality in low-light environments.

- **Primary (Terracotta/Bronze):** Used for key branding elements, primary buttons, and active states. It represents the "trunk" — the stable foundation, glowing warmly against the dark background.
- **Secondary (Sage/Olive):** Used for success states, secondary actions, and decorative illustrations. It symbolizes growth and peace.
- **Accent (Champagne Gold):** Used sparingly for highlighting premium features, subtle borders, or sophisticated iconography.
- **Background (Deep Charcoal/Dark Earth):** The primary canvas for all interfaces. Pure black is avoided in favor of a deep, warm neutral to reduce eye strain and maintain a welcoming atmosphere.
- **Text (Warm Off-White):** Instead of pure white, a soft cream/off-white is used for body text to maintain warmth while ensuring high legibility against the dark background.

## Typography

This design system uses a high-contrast typographic pairing to balance editorial elegance with maximum accessibility.

**Libre Caslon Text** is used for headlines to convey authority, history, and a classic "bookish" comfort. In dark mode, it provides an elegant, high-contrast editorial feel.

**Atkinson Hyperlegible Next** is selected for all functional text. Designed specifically for low-vision readers, its distinctive character shapes ensure that information is accessible to all families, regardless of cognitive or visual needs.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** with generous safe areas. 

- **Desktop (1440px+):** 12-column grid with 64px outer margins and 24px gutters. Content is often centered or offset to create an asymmetrical, editorial feel.
- **Tablet (768px - 1024px):** 8-column grid with 40px margins.
- **Mobile (<768px):** 4-column grid with 16px margins. 

The "Base 8" spacing system ensures consistency. Heavy use of the `xl` (80px) spacing unit between major sections is encouraged to maintain the sense of "abundant whitespace" requested in the brand narrative.

## Elevation & Depth

To maintain a gentle tone, this design system avoids harsh shadows. In dark mode, depth is conveyed through **Tonal Elevation** (surfaces getting lighter as they "lift") and **Ambient Glows**.

1.  **Level 0 (Surface):** The deep dark background.
2.  **Level 1 (Cards/Inputs):** A subtle lift using a slightly lighter container tone (Surface Container) with a very soft, diffused ambient shadow.
3.  **Level 2 (Modals/Popovers):** Higher elevation using further lightened tonal layers and a hint of the primary terracotta color in the glow.

Glassmorphism is used sparingly for navigation bars to allow the background organic shapes to peek through, using a high `backdrop-filter: blur(12px)`.

## Shapes

The shape language is organic and soft, mimicking the curves of the hands and leaves in the logo. 

- **Standard Elements:** Buttons, input fields, and small cards use `rounded-md` (0.5rem).
- **Featured Cards:** Large content containers or testimonials use `rounded-lg` (1rem).
- **Interactive Pill Elements:** Tags and chips use `rounded-xl` (1.5rem) or full pill shapes to signify clickability.

Avoid sharp 90-degree angles entirely to keep the UI feeling "human" and safe.

## Components

### Buttons
- **Primary:** Solid Terracotta background with dark-integrated text. Rounded corners (0.5rem). High-contrast and clear.
- **Secondary:** Sage Green outline with Sage Green text. Subtle hover state with a light Sage container tint.
- **Tertiary:** Text-only in Primary color with a subtle Gold underline on hover.

### Input Fields
Darker surface-container background with a thin 1px border in a muted olive. On focus, the border thickens slightly and changes to Terracotta. Labels always appear above the field in `label-md`.

### Cards
Cards should rely on tonal elevation for definition. They use a slightly lighter background than the base surface. Content within cards should have at least 24px of internal padding (`md` spacing).

### Chips & Tags
Used for categories like "Resources" or "Support Groups." These should be pill-shaped with a muted Sage container background and clear text.

### Progress Indicators
Used for multi-step forms. Use a soft "leaf" icon or a smooth organic bar in the Primary bronze color to show progress clearly against the dark background.
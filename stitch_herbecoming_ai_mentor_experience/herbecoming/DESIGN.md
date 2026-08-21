---
name: HerBecoming
colors:
  surface: '#fdf9f3'
  surface-dim: '#dddad4'
  surface-bright: '#fdf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ed'
  surface-container: '#f1ede7'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e6e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#514442'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0ea'
  outline: '#847371'
  outline-variant: '#d6c2bf'
  surface-tint: '#82524c'
  primary: '#82524c'
  on-primary: '#ffffff'
  primary-container: '#c98f88'
  on-primary-container: '#522925'
  inverse-primary: '#f6b7af'
  secondary: '#8a4e41'
  on-secondary: '#ffffff'
  secondary-container: '#feb1a0'
  on-secondary-container: '#794135'
  tertiary: '#695c56'
  on-tertiary: '#ffffff'
  tertiary-container: '#aa9a93'
  on-tertiary-container: '#3d322d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#f6b7af'
  on-primary-fixed: '#33110d'
  on-primary-fixed-variant: '#673b36'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#370e06'
  on-secondary-fixed-variant: '#6d372c'
  tertiary-fixed: '#f1dfd7'
  tertiary-fixed-dim: '#d4c3bc'
  on-tertiary-fixed: '#231a15'
  on-tertiary-fixed-variant: '#50443f'
  background: '#fdf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e6e2dc'
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 120px
---

## Brand & Style
The design system embodies a premium, editorial aesthetic tailored for personal growth and high-end wellness. It avoids the clinical nature of typical AI products, opting instead for the warmth of a modern tactile journal. The interface should evoke feelings of clarity, intentionality, and sophisticated calm.

The design style is **Minimalist-Editorial**. It prioritizes heavy whitespace, "airy" layouts, and high-quality typography. There is a strong emphasis on composition over decoration, using subtle tonal shifts rather than shadows or borders to define structure. The goal is to make the user feel like they are interacting with a curated publication rather than a software application.

## Colors
The palette is rooted in organic, warm neutrals that mimic natural paper and textiles.

- **Primary Background (#FBF7F1):** Used for the largest surface areas to maintain an open, expansive feel.
- **Accents:** Muted Rose and Soft Terracotta are reserved for meaningful highlights—active states, call-to-action buttons, or progress indicators. Use them sparingly to preserve the premium, understated feel.
- **Text Hierarchy:** Deep Warm Brown provides high-contrast legibility for body and headlines, while Taupe is used for metadata and helper text.
- **Tonal Layers:** Surfaces like Soft Blush and Warm Beige are used to create subtle distinction between sections without relying on heavy lines.

## Typography
The typographic system relies on the contrast between an elegant serif and a clean, understated sans-serif.

- **Headlines:** Playfair Display provides the editorial voice. It should be used for titles, quotes, and primary section headers. Use tight letter-spacing for larger display sizes to enhance the "luxury" feel.
- **Body & UI:** DM Sans (Humanist) ensures high readability. Generous line-height (1.6) is mandatory to maintain the airy, relaxed reading experience.
- **Labels:** Use uppercase for small labels and buttons to create a clear structural distinction from body text.

## Layout & Spacing
This design system utilizes a **fixed-center grid** for desktop and a fluid grid for mobile. 

- **Desktop:** 12-column grid with a maximum content width of 1140px. Large margins (120px+) are encouraged to pull the user's focus to the center, mimicking a book layout.
- **Mobile:** 4-column grid with 20px margins.
- **Rhythm:** Use large vertical spacing (`lg` or `xl`) between major sections to prevent visual clutter. Small spacing should be reserved for tight clusters of information like labels and input fields.

## Elevation & Depth
Depth is created through **Tonal Layers** rather than shadows. 

- **Level 0 (Base):** Primary Background (#FBF7F1).
- **Level 1 (Cards/Containers):** Soft Blush Cream (#F5E7DF) or Light Rose Beige (#EBD8D2).
- **Level 2 (Interaction):** Subtle 1px borders in Soft Linen (#E8DCD2). 

Shadows are avoided entirely, or if necessary for accessibility, use a very diffused "Ambient" style: `0 12px 32px rgba(62, 51, 46, 0.04)`.

## Shapes
The shape language is soft and approachable. Standard UI elements (buttons, inputs, cards) use a **0.5rem (8px)** radius. For specific featured elements or image frames, a larger **1rem (16px)** radius may be used to emphasize a "gentle" aesthetic. Avoid sharp 0px corners entirely to maintain the feminine, soft-touch feel.

## Components
- **Buttons:** Large, with generous padding. Primary buttons use the Muted Rose background with white or Cream text. Secondary buttons are outlined in Soft Linen with Deep Warm Brown text.
- **The AI "Dialogue":** Avoid traditional chat bubbles. Instead, use an editorial "Script" format. The AI's responses should appear as standard typography on the base background, distinguished by a subtle Soft Blush vertical bar on the left or a serif typeface for the AI's name/label.
- **Input Fields:** Minimalist. A simple 1px border on the bottom or a very soft background fill. No heavy boxes. Focus states should transition the border color to Soft Terracotta.
- **Cards:** Use tonal backgrounds (Soft Blush) rather than shadows. Cards should have no border unless they are placed on an identical background color.
- **Chips/Tags:** Small, pill-shaped, with a Warm Beige background and Taupe text. High-contrast tags should be avoided.
- **Mentorship Progress:** Use thin, elegant lines and subtle terracotta dots to show milestones.
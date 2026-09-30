---
name: Industrial Attachment Operations
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444653'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#003c37'
  on-tertiary: '#ffffff'
  tertiary-container: '#00554f'
  on-tertiary-container: '#75cac1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#9cf2e8'
  tertiary-fixed-dim: '#80d5cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#00504a'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.025em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 2.5rem
---

## Brand & Style

The design system establishes an authoritative, dependable, and precision-driven environment engineered specifically for higher education academic-industry monitoring. It rejects ephemeral consumer fluff in favor of institutional trust, quiet competence, and relentless utilitarian clarity. 

Rooted in a refined **Corporate Modern** philosophy inspired by Material 3 and enterprise SaaS, the interface organizes high-density administrative workflows—such as logbook approvals, supervisor site visits, bi-weekly evaluations, and competency verification—into a structured, stress-free mobile experience. The tone is calm, academic, and exact: high-contrast legibility, intentional white space, disciplined information hierarchy, and systematic feedback loops reassure students and faculty evaluators alike that their progress is recorded with zero ambiguity.

## Colors

The color palette centers on high-trust, functional hues configured to provide instant cognitive parsing without visual fatigue.

- **Primary (`#1E40AF` - Deep Sapphire Blue):** Anchors the application's core identity. Applied to top app bars, primary interactive buttons, prominent brand markers, and selected states.
- **Secondary (`#0284C7` - Vibrant Sky Cobalt):** Used for forward-moving progress metrics, interactive links, floating action highlights, and active tab indicator fills.
- **Tertiary (`#0F766E` - Deep Slate Teal):** Allocated for specialized academic milestones, supervisor comments, and verified industry mentor sign-offs.
- **Neutral Surface & Foundation:** Canvas base is `#F8FAFC` (Slate 50), paired with `#FFFFFF` for structural card surfaces and bottom sheets. Structural divisions utilize `#E2E8F0` for crisp 1px borders. Text colors transition from `#0F172A` (Slate 900, primary text) to `#475569` (Slate 600, secondary text) and `#94A3B8` (Slate 400, muted captions).

### Semantic Status Matrix
Academic review cycles rely on strict, high-legibility status pairs with dedicated 12% tint backgrounds:
- **Approved / Verified:** Foreground `#15803D` (Emerald 700) on `#DCFCE7` (Emerald 100).
- **Pending Review / Submitted:** Foreground `#0369A1` (Sky 700) on `#E0F2FE` (Sky 100).
- **Requires Revision / Attention:** Foreground `#B45309` (Amber 700) on `#FEF3C7` (Amber 100).
- **Rejected / Non-Compliant:** Foreground `#B91C1C` (Rose 700) on `#FEE2E2` (Rose 100).
- **Draft / Unsubmitted:** Foreground `#475569` (Slate 600) on `#F1F5F9` (Slate 100).

## Typography

The type scale utilizes Inter exclusively to achieve neutral, hyper-legible execution across varying densities of administrative data. 

- **Numerical & Tabular Data:** All hours logged, submission counts, and dates leverage `font-feature-settings: "tnum" 1, "cv05" 1` for consistent alignment across vertical lists.
- **Headlines & Titles:** Set with negative letter-spacing to tighten optical grouping, preventing headings from overwhelming compact 412px mobile canvases.
- **Form Labels & Status Badges:** Set in `label-md` and `label-sm` with slight positive tracking (`0.02em` to `0.025em`) and uppercase or medium-semibold weights to ensure fast scannability in peripheral vision.

## Layout & Spacing

The layout is built around a rigorous 8px spatial grid, calibrated specifically for standard modern Android viewports (412x917px).

- **Screen Canvas Boundaries:** Screen margins are pinned to `margin` (20px / 1.25rem), providing comfortable guttering from the physical device edges while conserving valuable horizontal line length for long-form student reflection entries.
- **System Insets:**
  - Top Android Status Bar: 44px reserved height, containing light-themed system indicators.
  - Bottom Navigation Bar Container: 80px total height, accommodating an M3 active indicator pill, clear labels, and clearance above the 24px Android gesture handle pill.
- **Vertical Hierarchy:** Section titles are separated by `space-xl` (24px) from preceding content blocks and `space-sm` (12px) from child cards. Cards and list records maintain a standard vertical gap of `space-md` (16px).

## Elevation & Depth

Visual hierarchy employs a hybrid strategy of tonal separation and subtle structural boundaries, avoiding dark or dramatic drop shadows.

- **Level 0 (Base Canvas):** `#F8FAFC`. Completely flat with zero elevation.
- **Level 1 (Card & Module Surface):** `#FFFFFF` paired with a mandatory crisp `1px solid #E2E8F0` border and an ultra-soft ambient shadow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Dropdowns, Menus & Filter Drawers):** `#FFFFFF` with `1px solid #CBD5E1` border and diffuse shadow: `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modal Sheets & Floating Action Units):** Elevated `#FFFFFF` surface with `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)` with no border, indicating active focal interaction.

## Shapes

The design system enforces a balanced roundedness tier (`roundedness: 2`, base 8px/0.5rem), using varying radii to differentiate between structural containers, interactive inputs, and action buttons:

- **Structural Cards & Bottom Sheets:** `rounded-lg` (16px) creates a clean, friendly, yet distinctly structured container that organizes log items and evaluation forms.
- **Form Inputs, Dropdowns & Modals:** `rounded` (8px to 12px) reinforces tactile precision.
- **Interactive Tags, Chips & Badges:** `rounded` (8px) for compact meta indicators.
- **Buttons & Bottom Navigation Indicators:** Full pill geometry (`rounded-full` / 24px-9999px) for primary action triggers and active navigation indicators, adhering to Material 3 standard interaction models.

## Components

### Buttons
- **Primary:** Full-width or auto-width pill geometry (48px height), background `#1E40AF`, text `#FFFFFF` (`label-lg`), with no border. On tap/hover, transitions to `#1E3A8A`.
- **Secondary (Tonal):** Background `#EFF6FF`, text `#1E40AF`, zero border, 48px height.
- **Outlined / Tertiary:** Background transparent, `1px solid #CBD5E1`, text `#334155`.

### Chips & Status Badges
- **Status Badges:** Fixed 24px height, padding 2px 10px, `rounded-md` (6px to 8px), typography `label-sm`. Built strictly using the Semantic Status Matrix tint-and-text combinations (e.g., `#DCFCE7` background with `#15803D` bold text for approved logs).
- **Filter Chips:** 32px height, `rounded-lg` (8px), background `#FFFFFF`, border `1px solid #E2E8F0`, containing optional leading 14px icons. When selected: background `#EFF6FF`, border `1px solid #1E40AF`, text `#1E40AF`.

### Cards
- **Log Entry Card:** `#FFFFFF` background, `1px solid #E2E8F0`, `rounded-lg` (16px), inner padding `space-md` (16px). Features a structured header with day/date stamp, status badge pinned to the top right, a body snippet for logged competencies, and a bottom metadata row displaying supervisor signature state and logged hours.

### Input Fields
- **Text & Area Inputs:** 52px height for text fields, background `#FFFFFF`, border `1px solid #CBD5E1`, border-radius 12px, padding horizontal 16px. Placeholder text `#94A3B8`. 
- **Focus State:** 2px ring in `#1E40AF` with border color transition to `#1E40AF`.
- **Validation State:** 1px solid `#B91C1C` border with inline helper text rendered in `body-sm` `#B91C1C`.

### Selection Controls
- **Checkboxes & Radios:** 20x20px touch target framed in 48x48px accessible tap zone. Unchecked: `1.5px solid #94A3B8`. Checked: solid `#1E40AF` with crisp white checkmark vector.
- **Switches:** M3 format with track 52x32px and thumb 24x24px. Active track `#1E40AF` with white thumb.

### Navigation Components
- **Top App Bar:** Height 56px, background `#FFFFFF` or `#F8FAFC`, title in `headline-sm` with optional back arrow icon (24px) aligned to the left margin.
- **Bottom Navigation Bar:** Height 80px, background `#FFFFFF`, top border `1px solid #E2E8F0`. Contains 4 to 5 core destinations. Active destination features an oval pill container (64x32px) filled with `#DBEAFE` holding a `#1E40AF` icon, with a label underneath set in `label-sm` bold.
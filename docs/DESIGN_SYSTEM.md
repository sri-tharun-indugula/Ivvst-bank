# 🎨 NovaBank Design System & Tokens

NovaBank is built on the **Nova Precision** fintech design system, curated to convey institutional authority, crisp structural lines, and calm visual hierarchy.

---

## 1. Color Palette

### Primary & Functional Colors
| Token | Light Mode Hex | Dark Mode Hex | Usage |
| :--- | :--- | :--- | :--- |
| `--brand-navy` | `#0D2137` / `#0F172A` | `#F8FAFC` | Brand logos, typography headers, primary containers |
| `--brand-blue` | `#2563EB` | `#3B82F6` | Primary action buttons, active navigation, focus rings |
| `--brand-mint` | `#10B981` | `#34D399` | Inflows, credit badges, successful operations, savings |
| `--brand-gold` | `#F59E0B` | `#FBBF24` | Credit card warnings, pending states, cautionary alerts |
| `--brand-rose` | `#EF4444` | `#F87171` | Debits, destructive actions, emergency freeze buttons |

### Neutral & Surface Tokens
| Token | Light Mode Hex | Dark Mode Hex | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-app` | `#F8FAFC` | `#080D1A` | Main application background canvas |
| `--bg-surface` | `#FFFFFF` | `#0F172A` | Standard card surfaces, topbar, sidebar |
| `--bg-surface-subtle` | `#F1F5F9` | `#162032` | Inset tables, pill backgrounds, progress troughs |
| `--border-subtle` | `#E2E8F0` | `#1E293B` | 1px clean card and divider boundaries |
| `--border-medium` | `#CBD5E1` | `#334155` | Hovered card borders and input focus boundaries |
| `--text-main` | `#0F172A` | `#F8FAFC` | Primary typography for balances and titles |
| `--text-muted` | `#475569` | `#94A3B8` | Secondary labels, descriptions, timestamps |
| `--text-faint` | `#94A3B8` | `#64748B` | Micro-captions, table headers, disabled icons |

---

## 2. Typography Strategy

- **Font Family**: `Inter`, sans-serif (Google Fonts).
- **Tabular Figures**: All financial balances and ledger numbers use `font-variant-numeric: tabular-nums` to guarantee aligned decimal alignment across vertical columns.

### Scale Hierarchy
- **Display Hero**: `48px` / Line height `56px` / Tracking `-0.03em`
- **Headline Large**: `32px` / Line height `40px` / Tracking `-0.02em`
- **Headline Medium**: `24px` / Line height `32px` / Tracking `-0.015em`
- **Title Balance**: `36px` / Line height `44px` / Tracking `-0.03em`
- **Body Regular**: `15px` / Line height `24px` / Tracking `0em`
- **Caption Caps**: `11px` / Line height `16px` / Tracking `+0.06em` (Uppercase)

---

## 3. Geometry & Corner Radii

NovaBank uses **Moderate Roundedness** to balance consumer friendliness with enterprise rigor:
- **`--radius-sm` (6px / 0.25rem)**: Micro-pills, badges, small buttons.
- **`--radius-md` (10px / 0.5rem)**: Standard buttons, text inputs, form selects.
- **`--radius-lg` (16px / 1rem)**: Dashboard cards, account boxes, modal panels.
- **`--radius-xl` (24px / 1.5rem)**: Physical credit/debit card surfaces.
- **Full (9999px)**: Avatars, indicator dots, toggle pills.

---

## 4. Elevation & Shadows

Visual depth is achieved through crisp 1px borders paired with subtle ambient diffusion:
- **Level 0 (Flat)**: Canvas base (`#F8FAFC`), no elevation.
- **Level 1 (Card Container)**: `box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)` + 1px border.
- **Level 2 (Hover & Popover)**: `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07)` + 1px medium border.
- **Level 3 (Modal Dialog)**: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1)` over blurred backdrop.

---

## 5. Accessibility (WCAG 2.1 AA/AAA)

- **Contrast Ratios**: All primary text maintains a minimum contrast ratio of `7.5:1` against white and dark backgrounds.
- **Color Independence**: Financial status is never conveyed by color alone—every state includes textual labels (e.g. `COMPLETED`, `PENDING`, `+` or `-` prefixes).
- **Visible Focus Rings**: Interactive elements feature a high-visibility `3px` focus ring (`rgba(37, 99, 235, 0.25)`).
- **Reduced Motion Support**: System animations respect user preference via standard CSS media queries.

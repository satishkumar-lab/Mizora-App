# Mizora — Design Context & Future Screen Guidelines

**Status:** Active — single source of truth for visual design  
**Last updated:** August 4, 2026  
**Figma file:** [CK-LP-Design — Satish Kumar (Copy)](https://www.figma.com/design/aC1iiy818RvETkuMY8fgNP/CK-LP-Design---Satish-Kumar--Copy-)

| Reference                 | Node         | Link                                                                                                                       |
| ------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Design System**         | `8673:15457` | [Open in Figma](https://www.figma.com/design/aC1iiy818RvETkuMY8fgNP/CK-LP-Design---Satish-Kumar--Copy-?node-id=8673-15457) |
| **Home Screen (Mizora+)** | `8674:15459` | [Open in Figma](https://www.figma.com/design/aC1iiy818RvETkuMY8fgNP/CK-LP-Design---Satish-Kumar--Copy-?node-id=8674-15459) |

Related product docs: [PRD.md](./PRD.md), [UX.md](./UX.md).

---

## 1. Mandate

Before designing or implementing **any new screen**:

1. Treat the **Design System** and **Home Screen** as the only visual authority.
2. Do **not** introduce a new visual style, palette, or component dialect.
3. Do **not** redesign existing components unless explicitly requested.
4. Reuse documented components; extend only when UX requires it—and extend using existing tokens.

**Content vs. chrome:** V1 product scope follows the PRD/UX (e.g. no calories/workout as core V1 features). Home may show aspirational or legacy modules—**new screens use PRD content** with **Home + DS styling**.

---

## 2. Design system analysis (tokens)

### 2.1 Color

**Green ramp (50–900):** Tinted backgrounds (50–200), primary actions/indicators (500–600 `#34c759`, `#25d366`), dark text on light (800–900).

**Lime ramp (300–700):** Signature chartreuse—badges, progress highlights, active nav pill, day pills. Key values: `#ddfb43` (Lime/400), `#c8f526` (Lime/500 / Brand Accent Bright), `#d6ff92`, `#a3b00d`, `#5c6d05` (premium label text).

**Neutral (White → Black):** Mid neutrals carry subtle green undertone (`#f4f6f3`, `#626b5e`, `#464846`). Primary text on Home: `#141c12`, `#111827`, black.

**Brand semantic**

| Token               | Hex       | Usage                                                       |
| ------------------- | --------- | ----------------------------------------------------------- |
| Brand/Primary       | `#34c759` | CTAs, links, progress fill, unlocked check, live badge text |
| Brand/Primary Light | `#d7ffc7` | Soft fills, live badge background (with alpha on Home)      |
| Brand/Accent        | `#ddfb43` | Progress ring/bar highlight, calendar pills, borders        |
| Brand/Accent Bright | `#c8f526` | Active bottom-nav pill                                      |
| Brand/Accent Soft   | `#f5ffbb` | Mizora+ chip background                                     |

**Surfaces**

| Token              | Hex       | Usage                                          |
| ------------------ | --------- | ---------------------------------------------- |
| Surface/Background | `#fafafa` | App canvas                                     |
| Surface/Card       | `#ffffff` | Cards, header chips                            |
| Surface/Secondary  | `#f4f6f3` | Locked status circles, outer reward card shell |
| Surface/Muted      | `#fafbf4` | Insight banner fill                            |
| Surface/Green Tint | `#e5ece2` | Progress bar tracks                            |

**Borders:** Light `#f2f2f7`, Default `#ededed`, Green `#ebefea`, Divider `#f2f3f0`. Home also uses `#f2f3f0` / `#e0f0ff` (0.6–0.67px) on cards.

**Accents:** Blue `#0a84ff` + Blue Light `#ebf7ff` (water). Orange badge `#f8ffd2` / stroke `#734a00` (metric icon badges).

### 2.2 Typography

**Font family:** Satoshi only (all weights below are Satoshi).

| Token           | Spec                          |
| --------------- | ----------------------------- |
| Display/Large   | Bold 24px                     |
| Heading/H1      | Medium 16px                   |
| Heading/H2      | Bold 14px                     |
| Heading/H3      | Medium 14px                   |
| Body/Medium     | Medium 12px                   |
| Body/Regular    | Regular 12px                  |
| Caption/Medium  | Medium 10px                   |
| Caption/Regular | Regular 10px                  |
| Label/Small     | Regular 8px, line-height 12px |

| Role                      | Pattern                         |
| ------------------------- | ------------------------------- |
| Section title             | Medium **16px**, black          |
| Card / row title          | Bold **14px**, `#141c12`        |
| Primary metric            | Bold **20–23px**, black         |
| Metric unit               | Medium **12px**, `#626b5e`      |
| Secondary / goal copy     | Medium **10px**, `#626b5e`      |
| Tertiary / chart axis     | Regular **8px**, `#8e8e93`      |
| Inline links              | Medium **12px**, `#34c759`      |
| Premium chip              | Medium **12px**, `#5c6d05`      |
| Motivation / insight body | Regular **14px**; emphasis Bold |

The entire Mizora application uses Satoshi as the only font family. Every future screen must use Satoshi consistently. Do not introduce any other font family unless explicitly approved.

### 2.3 Spacing scale (DS)

`2, 4, 6, 8, 10, 12, 16, 20, 24, 32` px.

**Home screen rhythm (observe, don’t invent):**

| Context                    | Typical value                            |
| -------------------------- | ---------------------------------------- |
| Screen horizontal padding  | **20px**                                 |
| Top padding (below status) | **30px**                                 |
| Major vertical blocks      | **25px** gap                             |
| Section title → content    | **12px**                                 |
| Card internal padding      | **14–15px** (sometimes ~13.7px)          |
| Card grid gap              | **10px**                                 |
| Row / list item gap        | **13px**                                 |
| Bottom safe area for nav   | **~97px** content padding + floating nav |

### 2.4 Corner radius (DS + Home)

| Token | px     | Home usage                         |
| ----- | ------ | ---------------------------------- |
| xs    | 3      | Micro bar chart bars               |
| sm    | 10     | Chips (Today, Mizora+), inner list |
| md    | **15** | **Default metric cards**           |
| lg    | 20     | Reward card outer shell            |
| xl    | 24     | Workout calendar card              |
| 2xl   | 32     | Insight banner                     |
| full  | 100px+ | Pills, avatars, nav, FAB           |

Generous rounding is part of the brand—prefer **15px** for standard white cards.

### 2.5 Stroke weights

Thin **0.6px** (card borders), default **1px**, medium **1.5px** (avatar ring), thick **2px** (selected day pill outline).

### 2.6 Shadows & elevation

| Token           | Spec                                   |
| --------------- | -------------------------------------- |
| Shadow/Card     | offset (0, 4), blur 12, `#000000` ~5%  |
| Shadow/Soft     | blur 10, `#0F172A` ~4%                 |
| Shadow/Elevated | offset (0, 8), blur 24, `#000000` ~14% |

**Home default card:** `0 4px 6px rgba(0,0,0,0.02)` — treat as **Card-level** elevation.  
**Bottom nav capsule:** Shadow/Soft (`0 0 10px rgba(15,23,42,0.04)`).  
**FAB:** Lime gradient + circular; no heavy shadow.

### 2.7 Glassmorphism

`Glass/Light` blur 12px, `Glass/Heavy` blur 43px—for overlays and frosted panels when needed; not used on Home body content.

### 2.8 Icons

- **Sets:** Tabler-style dots/menus; custom/Xnix line arrows; Vuesax linear (chat); app social instances.
- **Sizes:** 14px (chevrons, crown), 16–20px (row actions), 24px (nav), 28–29px (FAB plus).
- **Metric badges:** 20px (inline), 40px (circular orange/blue badge on small cards).
- **Health metric icon family (required):** Use `MetricBadgeIcon` from `@/components/icons/MetricBadgeIcon` for steps, calories, water, and daily goal—tinted circle + Ionicons (`footsteps`, `flame`, `water`, `flag`). Do **not** use one-off gray circles or custom SVG walk glyphs in health UI unless Figma exports a new badge variant added to this component.
- **App / social badge family (required):** Use `AppBrandIcon` from `@/components/icons/AppBrandIcon` for unlock rows and blocked apps—same tinted circular shell as metric badges; brand glyphs via Ionicons (`logo-whatsapp`, `logo-snapchat`, etc.) or Font Awesome 6 when needed. Do not use remote favicons or one-off logos in lists.

### 2.9 Motion (inferred)

No motion spec in file; preserve **premium static polish**. When animating: short (~300–350ms), ease-out; nav pill and progress updates should feel snappy, not bouncy. No gratuitous parallax on data screens.

---

## 3. Reverse-engineered design language

### 3.1 Why spacing feels the way it does

- **20px** screen inset aligns content to a **353px** useful width on **393px** frame—comfortable thumb reach, consistent margins.
- **25px** between major sections creates clear chapters without wasting vertical space (mobile-first, India mid-range devices).
- **10–12px** inside sections keeps related metrics feeling like one unit (overview cluster).
- **14–15px** card padding balances density with “premium air.”

### 3.2 Why typography is layered

- **One hero number** per card (steps ring, kcal, water)—Satoshi Bold at 20px+.
- **Units and goals** drop to 10–12px and `#626b5e` so numbers dominate (motivation without clutter).
- **Section titles** at 16px Medium anchor scanning; everything else subservient.

### 3.3 Card proportions

- **Asymmetric grid:** Wide steps card (~193px) + stacked narrow metrics = visual anchor left, supporting stats right.
- **Full-width** modules (rewards, calendar, insight) for narrative/content lists.
- **Horizontal metrics bar:** Three equal columns + hairline dividers—tertiary detail, single white card.

### 3.4 Information density

- High **signal** (steps, unlock rows) with low **chart junk** (mini bar chart only on hero card).
- Lists show **one line title + one line goal + micro progress**—scannable in &lt;2 seconds per row.

### 3.5 Attention hierarchy

1. **Primary:** Hero progress ring / large metrics / active lime nav pill / FAB.
2. **Secondary:** Section headers, app names, day pills (lime fill).
3. **Tertiary:** Goals, units, dividers, inactive nav icons, future days (white + gray border).

### 3.6 Visual rhythm

- White cards on `#fafafa` canvas.
- Lime appears in **small doses** (progress, active states, streak)—never full-screen lime.
- Green `#34c759` = **success / unlocked / links**, not decorative fill.
- Repeating **15px rounded white card + soft shadow** pattern ties the page together.

### 3.7 Premium aesthetic

- Soft shadows, no hard borders except subtle 0.6px.
- Decorative **diagonal line pattern** in header background (optional brand texture).
- Gradient FAB and live badge communicate “alive” product without noise.

---

## 4. Component inventory (reuse first)

Components observed in Figma with stable names. **Reuse before creating variants.**

### 4.1 Navigation & chrome

| Component        | Figma name                            | Variants / notes                                                                |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| **Main_nav**     | `Main_nav`                            | 4 tabs in `tabs-capsule` + **FAB**; active tab: `#c8f526` pill 65×45, icon 24px |
| **Nav icons**    | `Home`, `Anaytics`, `Health`, `Chart` | Home: `main` \| `Hover`; others `Main`                                          |
| **Header row**   | `header-row`                          | Avatar 44px, green ring 1.667px, online dot 10px                                |
| **Mizora+ chip** | `upgrade-btn` (lime)                  | `#f5ffbb`, crown 14px, text `#5c6d05`                                           |
| **Date chip**    | `upgrade-btn` (white)                 | Border `#ededed` 0.6px, “Today” + chevron                                       |

### 4.2 Data display

| Component                 | Figma name                    | Notes                                        |
| ------------------------- | ----------------------------- | -------------------------------------------- |
| **Steps progress card**   | `steps-progress-card`         | Header, ring, goal pill, mini bar chart      |
| **Metric small card**     | `calories-card`, `water-card` | Label + 40px icon badge + value row          |
| **Horizontal metrics**    | `Horizontal_Metrics`          | 3-column stats + vertical dividers           |
| **Progress ring**         | Ellipse group in steps card   | Track + lime progress arc; center metrics    |
| **Mini bar chart**        | Bar containers in steps card  | Gray `#e5e5ea`, active `#ddfb43`, radius 3px |
| **Progress bar (linear)** | `bar-container`               | Track `#e5ece2` h 3.5px; fill `#34c759`      |
| **Live badge**            | `live-badge`                  | Green tint bg, “Live” + pulse dot            |

### 4.3 App lock / rewards (maps to PRD)

| Component                 | Figma name            | Notes                                                      |
| ------------------------- | --------------------- | ---------------------------------------------------------- |
| **Focus mode card**       | `focus-mode-card`     | White inner on gray shell                                  |
| **App row**               | `app-row-instagram`   | Icon 35px circle, title, goal, bar, status                 |
| **App icon container**    | `lock-btn` (row)      | `#f8f8f8` circle 35px                                      |
| **Unlock status**         | `lock-btn` (trailing) | Unlocked: `#34c759` + check; Locked: `#f4f6f3` + lock 14px |
| **Section header + link** | —                     | Title 16px + “View All” `#34c759` + arrow 18px             |
| **Manage footer**         | `focus-footer`        | Key badge 32px + copy + circle arrow                       |

### 4.4 Calendar & insights

| Component                 | Figma name              | Notes                                                                              |
| ------------------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| **Workout calendar card** | `Workout Calendar Card` | radius 24px                                                                        |
| **Day pill**              | `Mon 04`, etc.          | 50×84; active `#ddfb43`; today: white + 2px lime border; future: white + `#e5e7eb` |
| **Flame streak**          | `flame` on pill         | 14×16 optional above weekday                                                       |
| **Insight banner**        | `Insight Banner Card`   | `#fafbf4`, border `#ddfb43`, radius 32px, icon circle 40px                         |

### 4.5 Icon badges

| Component         | Name                | Size / fill                    |
| ----------------- | ------------------- | ------------------------------ |
| Orange icon badge | `orange-icon-badge` | 20px or 40px; warm badge asset |
| Blue icon badge   | `blue-icon-badge`   | 40px, `#ebf7ff` circle         |

### 4.6 Design system — not yet separate components on Home

For new flows, **compose from tokens** using the same rules as Home:

- Primary / secondary **buttons** → chip patterns (Mizora+, Today) and FAB gradient.
- **Inputs** → white fill, `Border/Default`, radius sm–md, Satoshi 14px (infer from Today chip).
- **Switches, dialogs, bottom sheets, snackbars** → not in file; build with Surface/Card, Shadow/Elevated, radius xl, spacing 16–24—**no new patterns**.

---

## 5. Home screen layout map (reference)

**Frame:** 393×~1165, `Surface/Background`.

| Block                | Purpose                                                               |
| -------------------- | --------------------------------------------------------------------- |
| Header               | Profile, Mizora+, date selector                                       |
| Health Overview      | Steps hero + side metrics + horizontal stats                          |
| Steps Unlock Rewards | Locked app list + manage CTA                                          |
| Workout Calendar     | Week streak UI (visual reference; align feature to PRD when shipping) |
| Insight Banner       | Single encouraging insight row                                        |
| Main_nav             | Fixed bottom floating nav + FAB                                       |

**Screen padding:** `px 20`, content gap `25px`, bottom `pb ~97` for nav clearance.

---

## 6. Design rules (every future screen)

1. **Colors:** Only DS tokens + Home-proven hex values; lime for energy, green for success/links.
2. **Type:** Satoshi roles as Home; secondary text `#626b5e`.
3. **Spacing:** DS scale only; default screen inset **20px**.
4. **Radius:** Cards **15px** unless a Home module uses 20/24/32 for same archetype.
5. **Elevation:** Default **Shadow/Card**; nav **Soft**; modals **Elevated**.
6. **Components:** Pull from §4; one-off frames only if UX doc requires and no composite fits.
7. **Hierarchy:** One primary focal element per viewport section.
8. **Decoration:** No extra gradients, blobs, or illustration unless Home already uses that pattern (header line art only).
9. **Interactions:** Active states use lime pill or `#34c759`; inactive neutral outline icons.
10. **PRD alignment:** Copy and features from PRD/UX; **visuals** from Figma.

---

## 7. Quality standard checklist

Every new screen must:

- [ ] Use `Surface/Background` canvas and white elevated cards like Home
- [ ] Match spacing rhythm (20 / 25 / 12 / 15 / 10)
- [ ] Use Satoshi hierarchy consistent with Home
- [ ] Use existing nav (`Main_nav`) when inside main app shell
- [ ] Reuse row, card, badge, and progress patterns for lists and metrics
- [ ] Feel native to iOS/Android safe areas (floating nav, FAB placement)
- [ ] Be pixel-faithful to Figma when a comp exists; otherwise infer from Home + DS only
- [ ] Avoid new color, font, or shadow vocabulary

---

## 8. Agent / designer workflow

1. Open **Design System** node for token lookup.
2. Open **Home** (or nearest shipped screen) for composition reference.
3. Cross-check **[UX.md](./UX.md)** for screen purpose and states—not for visual invention.
4. Document new components in this file when added to Figma (name, node ID, variants).
5. Do not ship UI that contradicts this doc without explicit approval.

---

## 9. Open alignment notes

| Topic          | Note                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Typography     | **Satoshi only**—see §2.2; match Home Screen type roles.                                                                                               |
| Home vs PRD V1 | Home shows calories, workout calendar, 4-tab nav labels—these may differ from UX tab map; **new V1 screens** follow UX IA with **Home visual system**. |
| Mizora+ chip   | Present on Home; V1 PRD has no premium—chip may be hidden or non-functional until Phase 2.                                                             |
| FAB (+)        | Primary create action on Home; wire to PRD flows (e.g. start challenge) when implementing.                                                             |

---

_End of document_

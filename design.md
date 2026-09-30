# Worbee — Workspace Builder Design System

## 1. Design intent

Worbee should feel like a premium design studio for a personal workspace: calm, tactile, and immediately understandable. The product is an interactive builder, not a conventional catalogue, so the isometric canvas remains the visual hero and controls stay focused around it.

The visual direction combines minimalist editorial layout with flat, bordered UI. It borrows the clarity of premium direct-to-consumer retail while giving the sprite scene room to feel playful and alive.

### Experience principles

- **The room is the product.** Let users see the setup before they read its details.
- **Choice feels physical.** Product cards, drag previews, and placement feedback should make adding an item feel tangible.
- **Calm canvas, strong actions.** Use a mostly white interface; reserve dark, high-contrast controls for important actions.
- **Useful at a glance.** Price, availability, and selected state are always clear without competing with the scene.
- **Warm, not whimsical.** The experience can be fun without becoming cartoonish or cluttered.

## 2. Design tokens

### Color

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#111827` | Primary CTA, active controls, primary text |
| `ink-hover` | `#374151` | Hovered primary actions |
| `coral` | `#dc2626` | Brand accent, price promotion, important highlights only |
| `canvas` | `#ffffff` | Page and panel background |
| `canvas-muted` | `#f9fafb` | Product tray, quiet panels, empty states |
| `surface-hover` | `#f3f4f6` | Hovered cards and controls |
| `line` | `#e5e7eb` | Default borders and dividers |
| `line-strong` | `#d1d5db` | Selected borders and stronger separators |
| `text-secondary` | `#6b7280` | Descriptions and metadata |
| `text-muted` | `#9ca3af` | Placeholders and quiet labels |
| `available` | `#10b981` | Availability dot and valid placement feedback |
| `available-soft` | `#d1fae5` | Valid-drop fill |
| `warning` | `#f59e0b` | Attention state |
| `danger` | `#ef4444` | Invalid placement and destructive actions |
| `info` | `#3b82f6` | Informational hints, used sparingly |

### Typography

Use **Inter** (or a metrically compatible system fallback) for both headings and body copy.

| Style | Size / line-height | Weight | Use |
| --- | --- | --- | --- |
| Display | `36px / 1.1` | 700 | Builder headline on spacious desktop layouts |
| H1 | `30px / 1.2` | 700 | Page title |
| H2 | `20px / 1.3` | 600 | Panel and summary headings |
| H3 | `16px / 1.4` | 600 | Product names and grouped controls |
| Body | `14px / 1.5` | 400 | Standard supporting content |
| Body small | `12px / 1.5` | 400 | Metadata, hints, and labels |
| Label | `12px / 1.4` | 500 | Controls, category labels, and field labels |
| Caption | `11px / 1.35` | 500 | Small status text |

Use tabular numbers (`font-variant-numeric: tabular-nums`) for all prices, quantities, and totals.

### Spacing and layout

Use a 4px base grid.

| Token | Value |
| --- | --- |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

- Maximum content width: `1280px`
- Desktop page padding: `32px`
- Desktop builder gap: `24px`
- Top bar height: `72px`
- Primary product tray width: `280px` to `320px`
- Summary rail width: `320px` to `360px`
- Canvas minimum visual height: `560px` on desktop

### Shape, borders, and elevation

| Element | Radius | Border / elevation |
| --- | --- | --- |
| Scene canvas | 16px | 1px `line`; no default shadow |
| Panels and cards | 8px | 1px `line`; no default shadow |
| Inputs | Full pill | 1px transparent; ink focus border |
| Primary/secondary buttons | Full pill | Flat; subtle hover only |
| Category tabs | Full pill | Grouped inside a quiet segmented control |
| Product sprite selection | 12px | 2px ink or coral accent, depending on state |
| Tooltips and floating menus | 8px | Thin border with small soft shadow |

The interface should feel flat and precise. Borders create structure; shadows are reserved for floating drag previews, menus, and transient feedback.

### Motion

| Token | Value | Use |
| --- | --- | --- |
| Fast | 150ms | Hover, focus, small button response |
| Base | 200ms | Tab changes, panel actions, selection states |
| Slow | 300ms | Sprite placement, summary expansion, canvas transition |
| Standard easing | `cubic-bezier(0.4, 0, 0.2, 1)` | General UI motion |
| Emphasized easing | `cubic-bezier(0.2, 0, 0, 1)` | Furniture entering the scene |

Respect `prefers-reduced-motion`: replace placement motion with an immediate state change and keep only essential feedback.

## 3. Page layout

### Desktop builder

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Worbee                                  Saved setup     [Review setup]  │
├───────────────┬──────────────────────────────────────┬───────────────────┤
│ Product tray  │                                      │ Setup summary     │
│               │        Isometric workspace           │                   │
│ [Desks]       │        drag and arrange sprites      │  4 items          │
│ [Chairs]      │                                      │  Monthly estimate │
│ [Accessories] │                                      │  [Review setup]   │
│               │                                      │                   │
└───────────────┴──────────────────────────────────────┴───────────────────┘
```

- The canvas is visually dominant and occupies the center column.
- The product tray is a stable left rail; its controls should never cover the scene on desktop.
- The summary is a stable right rail and remains visible while browsing choices.
- On wider screens, the page background remains white and the canvas uses an off-white internal floor/background illustration.

### Tablet and mobile

- Collapse the three-column builder into a canvas-first vertical layout.
- Keep the canvas at the top; show the summary as a sticky bottom bar with item count, total, and a review action.
- Place product categories in a horizontally scrollable pill tab row.
- Open product choices in a bottom sheet or expandable tray beneath the canvas.
- Use tap-to-place as an equal interaction to drag-and-drop.

## 4. Builder visual states

### Empty workspace

- Show a bright, uncluttered isometric room or floor plane with enough visual personality to feel welcoming.
- Keep a light instructional prompt inside the canvas: “Choose a desk to start your setup.”
- Highlight the first relevant product card rather than covering the scene with a modal.

### Dragging

- Render a semi-opaque drag preview that follows the pointer.
- A valid position receives a soft green floor/surface highlight and a solid, natural-looking preview.
- An invalid position receives a subtle red outline or red-tinted footprint; never rely on color alone—pair it with a short text cue such as “Desk surface required.”
- The original card remains visible in the tray so the interaction does not feel destructive.

### Selected item

- Outline the active sprite using a thin ink border with rounded visual bounds.
- Reveal a small floating toolbar: Move, Remove, and product name.
- Do not leave selected outlines on every item; only one item should be visually active at a time.

### Placed and replaced items

- New sprites settle into place with a 200–300ms scale/fade transition.
- Replacing the primary desk or chair uses a short crossfade and a visible Undo action.
- Price changes animate gently but remain legible with tabular numerals.

## 5. Components

### Header

- Left: the Worbee wordmark.
- Center or desktop-left: concise context such as “Design your workspace.”
- Right: saved-state indicator and primary `Review setup` button.
- Keep the header uncluttered; do not add catalogue navigation, account menus, or marketing links to the builder flow.

### Category tabs

- Categories: Desks, Chairs, Accessories, and later optional zones.
- Use a segmented-control container with pill tabs.
- Active tab: ink fill, white text.
- Inactive tab: white or quiet off-white background, ink text, hairline border.
- Include a visible item count badge only when it helps, such as “Accessories · 3.”

### Product cards

- Use a compact bordered card with the sprite or product image at the top and information below.
- Card imagery has no internal image padding; the card content has 16px padding.
- Show product name, a one-line comfort/function benefit, availability dot, and monthly price.
- Selected product: strong border and a small “In your setup” badge.
- Draggable card: cursor/handle affordance on desktop, clear “Tap to place” cue on mobile.

### Contextual hotspots

- Use only for high-confidence, relevant actions: “Add monitor,” “Place a plant,” or “Add lamp.”
- Anchor each hotspot close to the natural placement surface without covering the sprite itself.
- Style as a small white pill with a thin border, plus icon, and brief label.
- Hide a hotspot once the related placement is filled or its product limit is reached.

### Setup summary

- Keep it sparse: item count, itemized list, monthly estimate, and delivery/installation note.
- Use 1px dividers between item rows.
- Show a small green availability dot near the inventory note.
- The total is visually strong but not red; use ink and tabular numerals.
- Primary action: black, fully rounded `Review setup` button.

### Checkout review

- Use the same itemized visual language as the summary.
- Place the enquiry form in a bordered panel beneath or alongside it.
- Inputs are full-pilled and quiet off-white; labels remain visible above inputs.
- Inline validation uses text and icon feedback; do not depend on color alone.

## 6. Sprite art direction

- Use transparent PNG or WebP sprites with a fixed front-left isometric perspective.
- Keep shared warm daylight, thin charcoal linework, natural oak, off-white furniture, muted sage plants, and limited coral-red accents.
- Use a consistent anchor point and gentle contact shadow under every floor object.
- Avoid photorealistic product cut-outs mixed with illustrated sprites.
- Do not use large dark backdrops within individual transparent sprites; the canvas owns the environment.
- Build a small, cohesive core set first: two desks, two chairs, a monitor, lamp, floor plant, desk plant, keyboard/mouse, and storage.

## 7. Accessibility requirements

- All category tabs, product cards, actions, and form controls have clear focus states.
- Dragging is never required: keyboard and tap-to-place paths are always available.
- Use visible labels instead of icon-only controls for product-changing actions.
- Ensure normal text meets WCAG AA contrast; primary ink on white exceeds this comfortably.
- Use concise live status messages for events such as “Monitor added to compact desk” and “Placement unavailable: choose a desk.”
- Mark decorative scene artwork as decorative so it does not create unnecessary screen-reader noise.

## 8. Rules to preserve

### Never

- Use heavy shadows on cards, sprites, or main panels.
- Use saturated colored section backgrounds; use white and soft off-white as the primary canvas.
- Use square primary buttons or filter controls.
- Turn the main builder into a dense product catalogue grid.
- Rely on drag-only interaction or color-only status feedback.
- Mix illustration styles, perspectives, or shadow directions between sprites.

### Always

- Keep the isometric scene more prominent than the controls around it.
- Use fully rounded controls for clickable actions and filters.
- Use thin borders to organize information and tabular numerals for prices.
- Make selection, placement validity, and the current monthly estimate easy to understand at a glance.
- Keep the primary review action visible without blocking the workspace canvas.

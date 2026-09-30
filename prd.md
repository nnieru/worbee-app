# PRD — Worbee: Workspace Builder

## Overview

**Worbee — Workspace Builder** is a playful, visual workspace configurator for monis.rent. It helps digital nomads and startup teams a rental-ready office setup, see it take shape in real time, and submit it as a rental enquiry.

The experience should feel closer to designing a room in a game than shopping from a catalogue: users choose furniture and accessories, immediately see their workspace update, review the setup, and rent it.

## Goals

- Make choosing office furniture fast, visual, and enjoyable.
- Help users confidently assemble a practical workspace for their stay.
- Convert completed designs into qualified rental enquiries.
- Showcase monis.rent as a flexible, modern alternative to buying furniture.

## Primary user

A freelance developer or small startup team who needs a functional workspace within days. They care about speed, aesthetics, comfort, and avoiding the hassle of purchasing furniture.

## Core experience

1. User lands on “Build your Bali workspace.”
2. A polished illustrated or isometric workspace appears in the center of the screen.
3. They select furniture from a compact configurator panel.
4. Each selection updates the visual scene instantly, including price and item count.
5. They open a summary drawer or checkout page.
6. They submit their desired rental setup and contact details.

## Interaction model

Worbee should make the workspace itself feel like the interface. The user should not need to hunt through a separate product catalogue before seeing the effect of a choice.

- **Category tabs:** A compact selector switches between Chairs, Desks, Accessories, and optional room-zone collections.
- **Visual choice cards:** Each tab presents illustrated or photographed product cards; clicking one immediately places or replaces that item in the scene.
- **Contextual add controls:** When a compatible item is absent, small, clearly labelled controls appear beside its natural location—for example, “Add monitor” at the desktop display position or “Place a plant” on the floor or desktop.
- **Instant feedback:** Added items animate into position and the rental summary updates at the same moment.
- **Always-visible next step:** The primary “Rent your setup” action stays accessible below or beside the visual workspace without obscuring the design canvas.

## Expandable workspace zones

The MVP centers on a desk setup, but the interaction model must support optional, separately configurable zones. These can be introduced progressively without changing the core builder.

| Zone             | Example rental additions                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| Coffee Station   | Coffee machine, side table, mugs or water dispenser                         |
| Relax Zone       | Bean bag, lounge chair, side table, floor lamp                              |
| Outdoor Gear     | Surfboard rack or storage for nomad-friendly equipment, if offered by Monis |
| Garage / Storage | Tool shelf, storage cabinet, or utility shelving                            |

These zones should appear as optional cards or tabs beneath the main workspace. Selecting a zone changes the preview focus or opens a lightweight panel; it must not force the user to configure every zone before renting their desk setup.

## Features

### Workspace configurator

The configurator includes product groups with visual cards, price, and short benefit descriptions.

| Group       | Required options                                                                           |
| ----------- | ------------------------------------------------------------------------------------------ |
| Desk        | At least two options: compact desk and wide or standing desk                               |
| Chair       | At least two options: ergonomic task chair and premium or lounging chair                   |
| Accessories | Add or remove monitors, desk lamp, plant, keyboard/mouse kit, storage, and optional extras |

Each category should make it clear whether the user is replacing a single item or adding multiple items. Accessories support quantity controls where relevant—for example, one or two monitors.

### Live visual preview

The workspace preview is the heart of the product.

- It updates immediately whenever an item is selected, removed, or changed.
- Desk and chair selections visibly replace the existing furniture.
- Accessories appear in sensible locations: monitors on the desk, lamp beside the screen, plant on the floor or desk.
- Empty states should still look intentional and inviting.
- Transitions should feel smooth and lightweight, such as fades, slides, or small scale animations.
- Include a reset action and an optional “Surprise me” button that generates a curated setup.
- Show contextual add controls for common accessories before they have been selected, then replace those controls with the rendered item and a remove/change action.
- Support a focused view for any optional room zone while preserving the user’s main desk setup.

Use a warm, sunny Bali-inspired visual language with a bold red accent aligned to the Monis brand. Avoid a generic ecommerce grid as the primary interaction.

### Setup summary and checkout

A persistent compact summary shows:

- Selected items and quantities
- Monthly price estimate
- Total number of items
- Delivery and installation note
- “Rent this workspace” call to action

The checkout view expands this into an itemized summary and collects:

- Name
- Email or WhatsApp number
- Desired delivery date
- Rental duration
- Bali location or address
- Notes for the Monis team

On submission, show a clear success state: “Your dream workspace is on its way to becoming real.” The initial version may send the enquiry to a configured email endpoint, form service, or backend route.

## UX and visual direction

- Desktop-first immersive canvas, with a responsive mobile experience.
- Keep product controls simple: clear labels, images or icons, price, and selected state.
- Use high-quality product cut-outs, original illustrations, or a consistent stylized 2D/isometric asset system.
- Prioritize clarity: users should always understand what they selected and what it costs.

## Technical requirements

- Framework: Next.js
- Styling: Tailwind CSS
- Deployment: Vercel
- Source control: GitHub repository with `desent-bot` added as a collaborator
- Public deployment URL available for review
- Accessible keyboard controls, visible focus states, and descriptive labels for visual controls
- Fast initial load; optimize all product imagery and avoid heavy 3D dependencies unless performance remains excellent

## MVP acceptance criteria

- A user can select between at least two desks.
- A user can select between at least two chairs.
- A user can add and remove accessories, including monitors, lamps, and plants.
- A user can use category tabs and contextual scene controls to add or replace items.
- The workspace preview visibly changes with every selection.
- A live rental summary updates selected items and estimated monthly price.
- A checkout/enquiry view displays the chosen setup and captures user details.
- The app is responsive, deployed to a public Vercel URL, and its source is available on GitHub with `desent-bot` as collaborator.

## Future-scope acceptance criteria

- A user can optionally add furniture or equipment from a secondary zone without leaving the builder.
- Each configured zone contributes its selected items and price to the same rental summary.

## Success metrics

- Workspace-builder completion rate
- “Rent this workspace” conversion rate
- Average number of accessories added per completed design
- Enquiry-to-rental conversion rate
- Time from first selection to enquiry submission

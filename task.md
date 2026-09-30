# Worbee — Workspace Builder: Delivery Tasks

## Project setup

- [x] Create a Next.js application with TypeScript and Tailwind CSS.
- [x] Establish a warm neutral visual system with a coral accent, typography, spacing, and responsive layout.
- [ ] Configure the GitHub repository and add `desent-bot` as a collaborator.
- [ ] Connect the repository to Vercel and prepare environment variables for the enquiry endpoint.

## Product data

- [x] Define rental products, images, descriptions, and monthly prices in a reusable data model.
- [x] Add at least two desk choices: compact desk and wide or standing desk.
- [x] Add at least two chair choices: ergonomic task chair and premium or lounging chair.
- [x] Add accessories: monitor, desk lamp, plant, keyboard/mouse kit, and storage.
- [x] Support quantities for applicable accessories, including one or two monitors.

## Workspace builder

- [x] Build the full-screen visual workspace preview.
- [x] Render the selected desk and chair in the preview.
- [x] Render accessories in natural positions within the scene.
- [x] Add visual transitions when furniture or accessories change.
- [x] Build category controls with product cards, prices, selected states, and short descriptions.
- [x] Add reset and “Surprise me” actions.
- [x] Keep the configuration state synchronized across the preview, controls, and summary.

## Summary and enquiry

- [x] Build a persistent summary with selected items, quantities, item count, and estimated monthly price.
- [x] Create the expanded checkout/enquiry view with an itemized setup summary.
- [x] Collect name, email or WhatsApp, delivery date, rental duration, delivery location, and optional notes.
- [x] Add a validated server route that forwards enquiries to a configurable HTTPS endpoint.
- [x] Show a clear confirmation state after successful submission.

## Quality and launch

- [x] Ensure the builder is responsive on desktop, tablet, and mobile.
- [x] Add keyboard support, visible focus states, and accessible labels for visual controls.
- [x] Optimize image assets.
- [ ] Validate initial page performance with a production browser audit.
- [x] Test the core configuration flow, price calculation, reset action, and enquiry submission.
- [ ] Deploy the application to Vercel.
- [ ] Verify the public URL, GitHub repository access, and production enquiry flow.

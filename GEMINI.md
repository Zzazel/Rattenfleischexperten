# Project Context: Rattenfleischexperten [RFE]

## Project Identity
- **Goal:** A humorous, structured food rating site for "questionable" local food spots (Döner, Imbiss).
- **Aesthetic:** "Intentional Indie Web" — clean, minimal, slightly weird, mono-font accents, paper-like background.
- **Vibe:** Serious expert organisation reviewing suspicious food.

## Technical Architecture
- **Structure:** Multi-page static website (`index.html`, `protocols.html`, `council.html`, `manifesto.html`).
- **Backend:** Supabase (REST API) for dynamic review data. No Node.js server needed for deployment.
- **Styling:** Vanilla CSS (`style.css`).
- **Logic:** `main.js` (Theme toggle, Supabase fetching, secret animations).
- **Deployment:** Optimized for static hosters like Netlify (see `netlify.toml`).

## Core Features & Lore
- **The Ratten-Skala:** Ratings for Essen, Service, Ambiente (0-5 🐀).
- **Secret Admin Access:** 3-clicks on the footer rat triggers a "Rat Escape" animation to the top-left, followed by a blackout transition to `admin.html`.
- **The Council:** 7 specific members with fixed names/roles (Die Fette Kanalratte, Ratcliff Schmauser, etc.).
- **The Manifesto:** Fixed "Testverfahren" steps involving "Rattengeruchssinn" and "Schwitzverhalten".

## Current State
- All pages translated to German.
- Mobile optimization complete (responsive nav, grid adjustments).
- Supabase integration active (requires URL/Key in `main.js`).
- Admin panel functional for adding/editing reviews via Supabase.

## Future Instructions
- **Stay Indie:** Avoid corporate startup looks or over-designed animations.
- **Lore Integrity:** Keep the humor dry, technical, and rat-focused.
- **Simplicity First:** Maintain the "no-build" static structure where possible.

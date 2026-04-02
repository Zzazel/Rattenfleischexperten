# Project Context: Rattenfleischexperten [RFE]

## Project Identity & Lore
- **Goal:** A pseudo-serious food rating site for "questionable" local spots (Döner, Imbiss) using the **Ratten-Skala** (0-5 🐀).
- **Aesthetic:** "Intentional Indie Web" — minimal, slightly weird, high contrast, mono-font accents, paper-like background.
- **The Council:** 7 specific members with fixed names/roles (fette-Kanalratte, Sir Nibblesworth, Ratcliff jr., etc.) that oversee the "scientific" food analysis.
- **The Manifesto:** Fixed "Testverfahren" involving the "Döner-Axiom" and the formula: `Ψ = (0.5 * E) + (0.25 * A) + (0.25 * S)`.

## Technical Architecture (v1.0.0 "Initial Release")
- **Structure:** Multi-page static website (`index.html`, `protocols.html`, `council.html`, `manifesto.html`, `admin.html`).
- **Backend:** Supabase (REST API) for dynamic review data. No build process required.
- **Styling:** Vanilla CSS (`style.css`).
- **Logic:** `main.js` (Theme toggle, Supabase fetching, global state, secret animations).
- **Socials:** TikTok and Instagram links integrated into all footers.

## Core Features & v1.0.0 Mechanics
- **The Global Ratometer:** A persistent 24px bar positioned immediately below the header. It follows a 3-stage animation:
  1. **Stage 1 (Global):** 0-67% slow fill (90s) on normal pages.
  2. **Stage 2 (Admin Login):** 67-100% tense fill (10s) on `admin.html` before login.
  3. **Stage 3 (Logged In):** 100-130% "overdrive" burst with a glow effect after login.
- **Secret Admin Access:** 3-clicks on the footer rat triggers the "Rat Escape" animation to the top-left, followed by a blackout transition to `admin.html`.
- **Scoping Bridge:** `adminLoggedIn` and `updateRatometer` are explicitly attached to the `window` object in `main.js` to ensure reliable communication between scripts and the `admin.html` login logic.
- **Admin Management:** Functional panel for CRUD operations on reviews via Supabase. Textareas are expanded to `rows="10"` for better editing.

## Mandatory Standards
- **Swiss Spelling:** Mandatory use of **Swiss Spelling** across all pages (no "ß", use "ss" instead).
- **Design Integrity:** Maintain the dry, technical, rat-focused humor. Avoid corporate aesthetics or over-designed animations.
- **Lore Consistency:** Keep the "serious expert organization" vibe intact.

## Future Instructions
- **Stay Indie:** Prioritize simplicity and a "no-build" static structure where possible.
- **Persistence:** Consider implementing persistence for the Ratometer state if requested in v2.
- **Verification:** Always check for `window` scope access when adding new global triggers.

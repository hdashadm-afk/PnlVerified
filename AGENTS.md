<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Product family context

This repo (PNLVerified) is one of the modules under **Owner's Lens**, the
gas-station owner operating product family led by `katiwala-owner-os-`
(brand: **Dipstify**, `dipstify.com`). See that repo's
`docs/KATIWALA_PRODUCT_FAMILY.md` and `docs/DIPSTIFY_BRAND_GUIDE.md` for the
umbrella brand/structure — Dipstify replaced "Katiwala" as the public-facing
name (2026-07-20); this repo's own branding/UI has not been updated to match
yet, flagged only, not done.

# Session-start operating preference — "Founder's Lens"

Confirmed by the founder 2026-07-21 (same rule now in `katiwala-owner-os-`'s
`docs/MASTER_DIRECTION.md` §11 and `staffverified-app`'s `AGENTS.md` —
applies across the whole product family, not just one repo): deliver a
baseline-grounded status automatically at the start of a session — don't
wait to be asked "what's on my plate." Named **Founder's Lens** by the
founder — same naming family as Lens (the KOS assistant) and Owner's Lens
(the product's top-level dashboard): "get to see everything before deciding
to start the day," applied to how Claude opens a session. Check current
repo state, don't assume from memory. Format is always a table: item /
priority / effort / purpose (why it matters), with 🔴/🟡/🟢 for urgency
(plain chat text can't render literal color) and Low/Medium/High for effort
(the founder's rough read on how much work the item is, to help him triage
what to greenlight now vs. schedule for later). Coverage must be
exhaustive, not curated — every open PR, every unmerged/unactioned item,
every decision still waiting on the founder, across every repo the session
has touched, not a top-3. Opening line: **"Boss, here's your Lens today"**
(or equivalent), then straight into the full table — not a re-explanation
of what Founder's Lens is each time.

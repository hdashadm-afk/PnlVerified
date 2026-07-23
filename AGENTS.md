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

# Instruction-delivery preference — Standard Instruction Form

Confirmed by the founder 2026-07-23, superseding the 2026-07-21 attempt
(a published HTML artifact with checkboxes/tap-to-copy) — same rule now
in `katiwala-owner-os-`'s `docs/MASTER_DIRECTION.md` §11 and mirrored in
`staffverified-app`/`fuel-ops`'s own `AGENTS.md`. The artifact version
turned out to add more friction than it removed — a link/page to open
instead of reacting immediately. **Do not build an HTML artifact or file
for multi-step instructions.**

Multi-step instructions go in a **plain markdown table, posted directly
in the chat reply** — a one-line Objective, then three columns, Step /
Where / How:

**Objective:** *one line — what this accomplishes and why it matters*

| Step | Where | How |
|---|---|---|
| 1 | *the site/dashboard* | *what to do, exact literal values inline as `code`* |

Rules:
- Always lead with the one-line Objective before the table.
- No link, no file, no artifact — the objective + table is the entire
  reply.
- Number rows sequentially across the whole instruction set, even across
  different topics/sites — don't restart numbering per topic.
- Exact literal values (env var names, secrets, URLs, webhook event
  names) go inline as `` `code` `` — never prose the founder has to
  retype.
- Where is the complete, exact address whenever known, not a vague
  breadcrumb — use the real URL verbatim if a screenshot or prior
  navigation already revealed it. Fall back to a breadcrumb only when no
  exact URL is known yet.
- Chat text outside the table stays to one or two sentences.
- No persisted checkbox state (accepted tradeoff) — for a task spanning
  multiple sessions, re-confirm progress rather than relying on memory.
- Apply whenever a task has 3+ sequential steps, even within a single
  site (not just across multiple sites).

# Session-end preference — Closing brief

When a piece of work finishes (a task, a PR, an investigation), close
with a short brief — what was actually found/done, and what's next —
rather than stopping silently or jumping straight to the next thing
unprompted. Two or three sentences, not a re-walk of every step. Pairs
with Founder's Lens (session-start): together they mean the founder
never has to ask "so where are we" himself.

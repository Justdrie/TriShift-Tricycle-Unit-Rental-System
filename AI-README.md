# TriShift — Local AI Working Notes

This file is for the developer's **local** AI coding assistant. It is **not** part of the public/shared project documentation.

## First instruction for every AI session

> Read `README.md`, `AGENTS.md`, and `.agents/skills/trishift-admin-frontend/SKILL.md`. Inspect the current files and Git status. Help me implement or refine the **Admin Frontend only**. Don't change my groupmates' User/Driver pages or backend. Do not commit, push, open pull requests, switch branches, or change Git settings. Use the latest confirmed TriShift Admin Figma frames, Laravel Blade, Bootstrap 5.3, Poppins and vanilla JavaScript. Use labeled sample data until backend integrations exist. Explain what you changed and what you tested.

## Figma source

https://www.figma.com/design/WLwYlZQOKu1yhK5fkpAf2M/IT14---TriShift?node-id=0-1

The Figma file contains repeated or older versions of some frames. Inspect the intended latest Admin frame before changing a page; never overwrite existing work based solely on a frame name.

## Priority order

1. Shared Admin shell: logo, navigation, header, responsive sidebar, fonts and tokens.
2. Dashboard.
3. Daily Assignments.
4. Rental Collections.
5. Drivers.
6. Tricycles.
7. Maintenance.
8. Reports.
9. Import Records.
10. Activity History.

Nine **screens**, plus a shared shell—not ten separate screen designs.

## Frontend preview vs production functionality

- Preview: static data, local UI interactions, responsive checks.
- Production: database, route/controller wiring, authentication, permissions, transactions, CSV imports and audit trails. These belong to backend teammates.
- Label sample data; do not claim forms have stored records.

## GitHub workflow

GitHub is for **human-controlled collaboration**. AI only edits local approved source files and reports changes. The developer reviews, stages, commits and pushes at their own discretion.

AI instruction files (`AGENTS.md`, `AI-README.md`, `.agents/skills/`) should be excluded locally through `.git/info/exclude` and are not intended to be pushed. `README.md` is ordinary team documentation and may be shared after human review.

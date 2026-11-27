---
name: trishift-admin-frontend
description: Implement, refine, and verify the nine Administrator screens of the TriShift Laravel 13 application using the connected Figma frames, Blade, Bootstrap 5.3, Poppins, CSS, and JavaScript. Use for dashboard, assignments, rental collections, drivers, tricycles, maintenance, reports, import records, and activity history tasks.
---

# TriShift Admin Frontend Skill

## Activation

Use this skill for any TriShift Administrator UI, layout, CSS, interaction, Figma-to-Blade, accessibility, or responsive task. Read `README.md` and `AGENTS.md` first. The rules in `AGENTS.md` take precedence for file ownership and Git restrictions.

## Design target

[TriShift Figma file](https://www.figma.com/design/WLwYlZQOKu1yhK5fkpAf2M/IT14---TriShift?node-id=0-1)

The file contains multiple iterations of some Admin frames. Check the intended current frame, its screenshot, layout, colors, logo, and components before implementing; do not guess values or replace approved icons with unrelated icons.

## Nine Admin screens

| Screen | Main UI requirements |
| --- | --- |
| Dashboard | Greeting/gradient header, summary metrics, quick actions, unit cards, reminders, quick summary |
| Daily Assignments | Date filter, assignment list/board, add and swap workflows, driver/unit/time fields, conflict messages |
| Rental Collections | Assignment-linked payment form, receipt reference, payment history, daily totals, void/correction UI |
| Drivers | Search, status and regular/substitute records, forms, archive confirmation |
| Tricycles | Unit table/cards, status, model/plate/rate, form and archive confirmation |
| Maintenance | Service history, type, cost, service/due dates, reminders and status displays |
| Reports | Date/driver/unit filters, summaries, tables and CSV export affordance |
| Import Records | UTF-8 CSV selection, validation preview, rejected-row explanations and confirmation affordance |
| Activity History | Read-only audit table, time/account/action filters, change detail display |

## Workflow for each task

1. Identify the requested screen and its specific Figma frame and version.
2. Inspect existing Blade layout, Admin CSS/JS, assets and shared components.
3. Check read-only Git status/diff to protect uncommitted work.
4. Plan the smallest implementation: reuse sidebar/header/cards/forms/tables rather than duplicating them.
5. Implement in approved Admin files only; request permission for any necessary shared routes or Vite changes.
6. Use actual Figma colors, logo, typography and icon choices when available.
7. Make navigation, dropdowns, filters, dialogs and input feedback work for local preview.
8. Clearly label sample data and do not mimic real database writes.
9. Validate responsive layout, keyboard behavior, error/empty states and relevant build commands.
10. Report changed files, actual checks and backend dependencies.

## Style and engineering requirements

- Laravel 13 Blade, Bootstrap 5.3 and vanilla JavaScript; no new SPA framework.
- Poppins typography, TriShift green theme, consistent visual rhythm.
- Reusable components and narrowly scoped Admin CSS classes.
- Semantic table headers, labels and buttons; visible focus state; sufficient contrast.
- Verify usability around 375px, 768px and 1280px widths.
- Don't hardcode production data. Never use real sensitive client data as mock data.
- Use Blade's escaped outputs. No invented API URLs, insecure session handling or frontend-only access control.
- Don't change User/Driver frontend, controllers, database, app configuration, credentials or unrelated files.
- **Never run Git staging/commit/push/merge/branch-switch commands or open pull requests.** Human controls GitHub.

## Reporting format

- **Implemented:** actual UI work completed.
- **Files changed:** exact paths.
- **Verification:** commands/tests actually run and results.
- **Needs backend:** forms or data not yet connected.

Do not mark a screen complete solely because a placeholder page exists.

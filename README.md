# TriShift — Tricycle Unit Rental System

**IT 14/L · Application Development and Emerging Technologies**

TriShift is a browser-based system for managing tricycle unit assignments, rental collections, maintenance, records, reports, and audit history. It replaces scattered paper records with a more traceable workflow.

## Technology stack

| Area | Technology |
| --- | --- |
| Application framework | Laravel 13.x |
| PHP runtime | PHP 8.5.x (use a patched, supported release; initially configured with PHP 8.5.13) |
| Frontend | Laravel Blade, HTML5, CSS3, vanilla JavaScript (ES6+) |
| UI toolkit | Bootstrap 5.3.x, Bootstrap Icons |
| Typography | Poppins |
| Asset tooling | Vite, Node.js 24 LTS, npm |
| Backend database (planned) | MySQL 8.4 LTS and Laravel Eloquent |
| Testing | Laravel/PHPUnit and browser/UI checks |
| Collaboration | Git and GitHub; work on feature branches |
| Design reference | [TriShift Figma design](https://www.figma.com/design/WLwYlZQOKu1yhK5fkpAf2M/IT14---TriShift?node-id=0-1) |

**Architecture:** one Laravel application with separate Admin and Driver views. Do not introduce a separate React or Vue app without the team's approval.

## Responsibilities

- **Admin Frontend (this working area):** responsive Blade pages, layouts, Bootstrap styling, icons, interactions and frontend sample states.
- **Driver/User Frontend (teammate):** driver-facing view of personal assignment and payment history.
- **Backend (teammates):** database, routes, controllers, authentication, authorization, validation and financial integrity.

Frontend work must not alter backend or User/Driver code without explicit approval.

## Nine Admin screens

1. Dashboard — daily overview, fleet, collections, reminders and assignments.
2. Daily Assignments — date filters, driver/unit assignments, swaps and conflict feedback.
3. Rental Collections — payment form, history, summaries and correction interface.
4. Drivers — driver directory, search, regular/substitute types and archive UI.
5. Tricycles — fleet directory, unit status, rate and archive UI.
6. Maintenance — service logs, costs, due dates and reminders.
7. Reports — filtered operational summaries and CSV export interface.
8. Import Records — CSV upload, preview, validation messages and confirmation UI.
9. Activity History — read-only audit history and filters.

The approved **Admin** Figma frames are the visual source of truth. Several design versions may exist; check which intended frame is current before replacing an existing implementation.

## Important business rules

- Administrators may manage records; drivers may only view their **own** assignments and payment history.
- A tricycle or driver must not have overlapping active assignment periods.
- Swaps and substitute coverage preserve distinct operating segments.
- Valid collections belong to assignments; corrections use void-and-replace, retaining history.
- Maintenance reminders are based on entered due dates, not live vehicle telemetry.
- Referenced records are archived, not silently erased.
- Audit history identifies the acting administrator and changes.
- Import covers checked UTF-8 CSV driver and tricycle master records, not direct `.xlsx` imports.
- No GPS tracking, native mobile application, automatic payment gateway or automated vehicle diagnostics in the initial scope.

The frontend displays these rules; **server-side enforcement is the backend team's responsibility**.

## Relevant directories

```text
resources/views/admin/                # Admin Blade pages (your area)
resources/views/layouts/admin.blade.php  # Admin layout, if created
resources/views/components/admin/     # Reusable Admin components, if created
resources/views/user/                 # Driver frontend: do not edit
resources/css/admin.css               # Admin-only styles, if created
resources/js/admin.js                 # Admin-only interactions, if created
public/images/                       # Images; coordinate shared assets
routes/web.php                        # Shared routes: coordinate before changing
app/                                  # Backend team
 database/                            # Backend team
```

Actual paths should be verified before editing; files marked “if created” may not exist yet.

## Local setup (PowerShell)

From the Laravel project root (the directory containing `artisan`):

```powershell
composer install
npm ci
Copy-Item .env.example .env  # Only if .env does not already exist
php artisan key:generate     # Only for a new .env without an APP_KEY
```

For **local frontend previews without a running database**, configure `.env`:

```dotenv
APP_ENV=local
APP_DEBUG=true
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Don't commit `.env`. The backend team configures the final MySQL connection.

Launch the app in two terminals:

```powershell
php artisan serve
```

```powershell
npm run dev
```

Open the URL shown by `php artisan serve` (commonly `http://127.0.0.1:8000`). Preview routes must be local-only, and real Admin routes must eventually be protected by backend authentication and authorization.

## Design and coding standards

- Follow the latest confirmed Admin Figma frame: TriShift logo, green theme, typography and icon choices.
- Prefer reusable Blade layouts/components, Bootstrap utility classes and namespaced Admin CSS.
- Build functional, accessible menus, filters, tables, forms, modals, focus states and responsive behavior.
- Use Blade escaped `{{ ... }}` interpolation for dynamic text. Don't inject untrusted raw HTML.
- Use clearly labeled **sample data** while backend integration is pending; don't claim data was persisted.
- No fake production endpoints or frontend-only authorization in place of backend checks.
- Do not add dependencies or change shared configuration without team approval.

## Checks before requesting review

```powershell
php artisan --version
php artisan route:list
npm run build
composer audit
npm audit
```

Also test visible interaction and layouts on mobile, tablet and desktop. Report checks that could not run.

## Collaboration and AI assistance

- Team members use feature branches and review pull requests before merging to `main`.
- **Only the human developer controls Git commits, pushes, merges and pull requests.** An AI coding assistant must not perform these actions unless explicitly authorized in a separate request.
- Local-only AI instructions live in `AGENTS.md`, `AI-README.md`, and `.agents/skills/trishift-admin-frontend/SKILL.md`. They can be intentionally excluded from Git using `.git/info/exclude`.

## References

- [Laravel 13 documentation](https://laravel.com/docs/13.x)
- [Laravel Blade](https://laravel.com/docs/13.x/blade)
- [Laravel Vite](https://laravel.com/docs/13.x/vite)
- [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/)
- [Figma design](https://www.figma.com/design/WLwYlZQOKu1yhK5fkpAf2M/IT14---TriShift?node-id=0-1)

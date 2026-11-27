<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard · TriShift Admin</title>
    @vite(['resources/css/admin.css', 'resources/js/admin.js'])
</head>
<body class="ts-admin">
    <a class="ts-skip" href="#admin-content">Skip to content</a>
    <div class="ts-mobile-bar"><strong>TriShift</strong><button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#admin-sidebar" aria-controls="admin-sidebar"><i class="bi bi-list" aria-hidden="true"></i> Menu</button></div>
    <aside class="ts-sidebar offcanvas-lg offcanvas-start" tabindex="-1" id="admin-sidebar" aria-label="Admin navigation">
        <div class="offcanvas-header d-lg-none"><h2 class="offcanvas-title fs-5">TriShift Admin</h2><button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#admin-sidebar" aria-label="Close menu"></button></div>
        <div class="ts-sidebar-inner">
            <a href="#dashboard" class="ts-brand" aria-label="TriShift dashboard"><img src="{{ asset('images/admin/6bcdd.png') }}" width="94" height="63" alt=""><span><strong>TriShift</strong><small>Tricycle Unit Rental System</small></span></a>
            <p class="ts-menu-label">MAIN MENU</p>
            <nav>
                @foreach ([
                    ['dashboard', 'Dashboard', '5a9a7.svg', '7faf6.svg'],
                    ['assignments', 'Daily Assignments', 'fb118.svg', 'ba691.svg'],
                    ['collections', 'Rental Collections', '30919.svg', 'd6f3e.svg'],
                    ['drivers', 'Drivers', '2a800.svg', '01525.svg'],
                    ['tricycles', 'Tricycles', 'ae38c.svg', '53edf.svg'],
                    ['maintenance', 'Maintenance', 'cab2f.svg', 'ebe2c.svg'],
                    ['reports', 'Reports', '61fe7.svg', '0528b.svg'],
                    ['import', 'Import Records', '918fe.svg', '9b654.svg'],
                    ['activity', 'Activity History', '54139.svg', 'a560b.svg'],
                ] as [$key, $label, $icon, $activeIcon])
                    <a class="ts-nav-link {{ $key === 'dashboard' ? 'active' : '' }}" href="#{{ $key }}" data-page-link="{{ $key }}" @if($key === 'dashboard') aria-current="page" @endif>
                        <span class="ts-nav-icon"><img class="ts-icon-default" src="{{ asset('images/admin/'.$icon) }}" alt=""><img class="ts-icon-active" src="{{ asset('images/admin/'.$activeIcon) }}" alt=""></span>{{ $label }}
                    </a>
                @endforeach
            </nav>
            <div class="ts-account"><strong>Manager Account</strong><small>Administrator</small></div>
        </div>
    </aside>
    <main class="ts-main" id="admin-content" tabindex="-1">
        <header class="ts-hero">
            <div class="ts-hero-art" aria-hidden="true"><span class="ts-hero-color"></span><span class="ts-hero-ripple"></span><span class="ts-hero-ripple"></span><span class="ts-hero-ripple"></span><span class="ts-hero-shape ts-hero-shape-one"></span><span class="ts-hero-shape ts-hero-shape-two"></span><span class="ts-hero-shape ts-hero-shape-three"></span><span class="ts-hero-shape ts-hero-shape-four"></span><span class="ts-hero-shape ts-hero-shape-five"></span><span class="ts-hero-shape ts-hero-shape-six"></span></div>
            <div class="ts-hero-copy"><p>TRISHIFT / ADMINISTRATOR</p><h1 id="admin-title">Good morning, Manager!</h1><p id="admin-description">Here is a quick overview of today's operations.</p></div>
            <div class="ts-header-actions"><button type="button" class="btn btn-soft" data-bs-toggle="offcanvas" data-bs-target="#admin-notifications" aria-controls="admin-notifications"><i class="bi bi-bell" aria-hidden="true"></i> Notifications <span id="notification-count" class="badge text-bg-success">0</span></button></div>
        </header>
        <div class="ts-content">
            @yield('content')
        </div>
    </main>
    @include('admin.dialogs')
    <aside class="offcanvas offcanvas-end" tabindex="-1" id="admin-notifications" aria-labelledby="notifications-title">
        <div class="offcanvas-header"><h2 id="notifications-title" class="fs-5">Notifications</h2><button class="btn-close" type="button" data-bs-dismiss="offcanvas" aria-label="Close notifications"></button></div>
        <div class="offcanvas-body"><p class="ts-muted">Review form updates and record validation results from this session.</p><div class="d-flex gap-2 mb-3"><button class="btn btn-soft" id="notifications-read" type="button">Mark all read</button><button class="btn btn-soft" id="notifications-clear" type="button">Clear all</button></div><p id="notifications-empty" class="ts-empty">You're all caught up.</p><ul id="notification-list" class="list-unstyled" aria-live="polite"></ul></div>
    </aside>
    <div class="ts-feedback alert alert-success shadow" id="admin-feedback" role="status" hidden></div>
    <noscript><div class="alert alert-warning">Enable JavaScript to use the Admin navigation and forms.</div></noscript>
</body>
</html>

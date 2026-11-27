<section data-admin-page="dashboard" data-title="Good morning, Manager!" data-description="Here is a quick overview of today's operations.">
    <div class="ts-toolbar"><a class="btn btn-primary" href="#assignments">+ Assign Driver</a><a class="btn btn-soft" href="#collections">₱ Record Payment</a><a class="btn btn-white" href="#maintenance">+ Add Maintenance</a></div>
    <div class="ts-metrics ts-metrics-four">
        <x-admin.metric label="Tricycles in Fleet" value="0" note="Awaiting connected records" />
        <x-admin.metric label="Collections Today" value="₱0" note="Awaiting connected records" tone="primary" />
        <x-admin.metric label="Active Drivers" value="0" note="Awaiting connected records" />
        <x-admin.metric label="Maintenance Alerts" value="0" note="Awaiting connected records" tone="warning" />
    </div>
    <x-admin.panel title="Today's Tricycle Assignments" class="ts-dashboard-board"><a class="ts-panel-link" href="#assignments">View all assignments</a><x-admin.units :payments="true" /></x-admin.panel>
    <div class="ts-columns ts-columns-summary">
        <x-admin.panel title="Important Reminders"><div class="ts-note"><h3>No maintenance reminders</h3><p>Upcoming service dates will appear here when records are connected.</p></div></x-admin.panel>
        <x-admin.panel title="Quick Summary"><dl class="ts-summary"><div><dt>Payments recorded</dt><dd>0</dd></div><div><dt>Assigned tricycles</dt><dd>0 / 0</dd></div></dl><p class="ts-muted">No fleet records available.</p></x-admin.panel>
    </div>
</section>

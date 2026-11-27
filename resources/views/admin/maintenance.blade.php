<section data-admin-page="maintenance" data-title="Maintenance" data-description="Keep track of oil changes, repairs and next service dates." hidden>
    <div class="ts-toolbar justify-content-end"><button class="btn btn-primary" type="button" data-focus="service-unit">+ Record Maintenance</button></div>
    <div class="ts-metrics"><x-admin.metric label="Service Reminders" value="0" note="Awaiting connected records" tone="primary" /><x-admin.metric label="Tricycles" value="0" note="Awaiting connected records" /><x-admin.metric label="Service Cost (Example)" value="₱0" note="Awaiting connected records" /></div>
    <x-admin.panel title="Upcoming Maintenance"><div class="ts-note"><h3>No upcoming maintenance</h3><p>Entered service due dates will appear here once records are connected.</p></div></x-admin.panel>
    <div class="ts-columns ts-columns-summary"><x-admin.panel title="Record Service Details"><form class="ts-form-grid" data-preview-form="service">
        <x-admin.field label="Tricycle Unit" name="service-unit" type="select"><option value="">Choose unit</option>@foreach([] as $unit)<option>Unit {{ $unit }}</option>@endforeach</x-admin.field>
        <x-admin.field label="Service Type" name="service-type" type="select"><option value="">Oil change / Repair</option><option>Oil change</option><option>Repair</option><option>Inspection</option></x-admin.field>
        <x-admin.field label="Service Date" name="service-date" type="date" />
        <x-admin.field label="Service Cost (₱)" name="service-cost" type="number" min="0" step="0.01" max="999999.99" placeholder="Enter amount" />
        <x-admin.field label="Next Service Date (Optional)" name="service-due" type="date" :required="false" />
        <x-admin.field label="Notes (Optional)" name="service-notes" :required="false" maxlength="250" placeholder="Service details" />
        <button class="btn btn-primary ts-full" type="submit">Save Service Record</button><p class="ts-form-message ts-full" role="status" hidden></p>
    </form></x-admin.panel><x-admin.panel title="Maintenance History"><p class="ts-empty">No service records yet.</p></x-admin.panel></div>
</section>


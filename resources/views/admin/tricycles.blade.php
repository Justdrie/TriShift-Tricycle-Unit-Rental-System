<section data-admin-page="tricycles" data-title="Tricycles" data-description="See the status of each unit and manage rental rates." hidden>
    <div class="ts-toolbar justify-content-end"><button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#unit-dialog">+ Add Tricycle</button></div>
    <div class="ts-metrics"><x-admin.metric label="Total Units" value="0" note="Awaiting connected records" tone="primary" /><x-admin.metric label="Available or Assigned" value="0" note="Awaiting connected records" /><x-admin.metric label="Under Maintenance" value="0" note="Awaiting connected records" tone="warning" /></div>
    <x-admin.panel title="Fleet Overview">
        <div class="ts-directory-filter"><x-admin.field label="Search unit or plate" name="unit-search" type="search" :required="false" placeholder="Search fleet…" /><x-admin.field label="Status" name="unit-status" type="select" :required="false"><option value="">All statuses</option><option>Available</option><option>Maintenance</option></x-admin.field></div>
        <div class="ts-unit-grid">
            @foreach([] as $unit)<article class="ts-unit ts-fleet-card {{ $unit === '03' ? 'ts-unit-warning' : '' }}" data-unit-card data-status="{{ $unit === '03' ? 'Maintenance' : 'Available' }}" data-search="Unit {{ $unit }} SAMPLE-{{ $unit }}">
                <div class="ts-vehicle-placeholder">TRICYCLE</div><div class="ts-unit-heading"><h3>UNIT {{ $unit }}</h3><span class="ts-status {{ $unit === '03' ? 'ts-status-warning' : '' }}">{{ $unit === '03' ? 'Maintenance' : 'Available' }}</span></div><hr><p>Daily rate</p><strong class="ts-rate">₱350</strong><p class="mt-2">{{ $unit === '03' ? 'Oil change scheduled' : 'No upcoming service shown' }}</p><button class="btn btn-soft w-100" data-unit-detail="{{ $unit }}" data-bs-toggle="modal" data-bs-target="#unit-details-dialog" type="button">View Unit Details</button>
            </article>@endforeach
        </div><p class="ts-empty" id="unit-empty">No units match these filters.</p>
    </x-admin.panel><div class="ts-note"><h3>Before assigning a unit</h3><p>Tricycles marked Maintenance should not receive new assignments.</p></div>
</section>


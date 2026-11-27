<section data-admin-page="assignments" data-title="Daily Assignments" data-description="Manage tricycles, drivers and operating times." hidden>
    <div class="ts-toolbar justify-content-end"><button class="btn btn-primary" data-focus="assignment-unit" type="button">+ New Assignment</button></div>
    <x-admin.panel title="Assignment Board">
        <div class="ts-inline-filter"><label for="assignment-date">Schedule date</label><input class="form-control" id="assignment-date" type="date" ></div>
        <x-admin.units /><p id="assignment-empty" class="ts-empty">No assignments for this date.</p>
        <p class="ts-muted mt-4 mb-0">To change a driver, use Record Swap. Previous operating periods remain in history.</p>
    </x-admin.panel>
    <div class="ts-columns ts-columns-assignment">
        <x-admin.panel title="Create New Assignment">
            <form id="assignment-form" data-preview-form="assignment" class="ts-form-grid">
                <x-admin.field label="Select Tricycle" name="assignment-unit" type="select"><option value="">Choose an available unit</option></x-admin.field>
                <x-admin.field label="Select Driver" name="assignment-driver" type="select"><option value="">Choose an active driver</option>@foreach([] as $driver)<option>Driver {{ $driver }}</option>@endforeach</x-admin.field>
                <x-admin.field label="Start Date and Time" name="assignment-start" type="datetime-local" />
                <x-admin.field label="End Date and Time" name="assignment-end" type="datetime-local" />
                <p class="ts-muted ts-full">Choose a driver, unit, and operating period. Overlapping assignments are not allowed.</p>
                <p class="ts-form-message ts-full" role="status" hidden></p>
            </form>
        </x-admin.panel>
        <x-admin.panel title="Assignment Actions"><p class="ts-muted">Use these options for daily changes.</p><div class="d-grid gap-3 mt-4"><button class="btn btn-primary" type="submit" form="assignment-form">Save Assignment</button><button class="btn btn-soft" type="button" data-bs-toggle="modal" data-bs-target="#swap-dialog">Record Driver Swap</button></div><hr><p class="ts-muted">Swaps keep earlier records and times.</p></x-admin.panel>
    </div>
</section>

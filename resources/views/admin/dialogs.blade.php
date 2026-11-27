<x-admin.dialog id="swap-dialog" title="Record Driver Swap"><form data-preview-form="swap" class="ts-form-stack">
    <x-admin.field label="Current Assignment" name="swap-assignment" type="select"><option value="">Select assignment</option></x-admin.field>
    <x-admin.field label="Replacement Driver" name="swap-driver" type="select"><option value="">Choose driver</option>@foreach([] as $driver)<option>Driver {{ $driver }}</option>@endforeach</x-admin.field>
    <x-admin.field label="Swap Date and Time" name="swap-time" type="datetime-local"  />
    <x-admin.field label="Reason" name="swap-reason" maxlength="250" />
    <p class="ts-muted">The earlier operating segment is retained. The replacement covers the remaining assignment period.</p><button type="submit" class="btn btn-primary">Record Swap</button><p class="ts-form-message" role="status" hidden></p>
</form></x-admin.dialog>
<x-admin.dialog id="correction-dialog" title="Void and Replace Payment"><p id="correction-record"></p><p class="ts-muted">Original amount: ₱350. The original payment stays in history as voided; a replacement would be linked to it.</p><form data-preview-form="correction" class="ts-form-stack">
    <x-admin.field label="Replacement Amount (₱)" name="correction-amount" type="number" min="0.01" max="999999.99" step="0.01" />
    <x-admin.field label="Reason for Correction" name="correction-reason" maxlength="250" />
    <label class="form-check"><input type="checkbox" class="form-check-input" required><span class="form-check-label">I understand that the original payment must be retained.</span></label><button type="submit" class="btn btn-primary">Confirm Correction</button><p class="ts-form-message" role="status" hidden></p>
</form></x-admin.dialog>
<x-admin.dialog id="driver-dialog" title="Add New Driver"><form data-preview-form="driver" class="ts-form-stack">
    <x-admin.field label="Driver Name" name="driver-name" maxlength="100" />
    <x-admin.field label="Contact Number" name="driver-contact" type="tel" maxlength="20" pattern="[0-9+()\s-]{7,20}" />
    <x-admin.field label="Driver Type" name="driver-type" type="select"><option>Regular</option><option>Substitute</option></x-admin.field>
    <button type="submit" class="btn btn-primary">Add Driver</button><p class="ts-form-message" role="status" hidden></p>
</form></x-admin.dialog>
<x-admin.dialog id="profile-dialog" title="Driver Profile"><h3 id="profile-name"></h3><dl class="ts-summary"><div><dt>Type</dt><dd>Regular</dd></div><div><dt>Status</dt><dd>Active</dd></div><div><dt>Contact</dt><dd>Not supplied in sample</dd></div></dl><h3>Assignment history</h3><p id="profile-history" class="ts-muted"></p><button type="button" class="btn btn-outline-danger" data-archive-kind="driver">Archive Driver</button></x-admin.dialog>
<x-admin.dialog id="unit-dialog" title="Add Tricycle"><form data-preview-form="unit" class="ts-form-stack">
    <x-admin.field label="Unit Number" name="unit-number" maxlength="30" placeholder="Unit 04" />
    <x-admin.field label="Plate Number" name="unit-plate" maxlength="30" />
    <x-admin.field label="Model" name="unit-model" maxlength="80" />
    <x-admin.field label="Daily Rental Rate (₱)" name="unit-rate" type="number" min="0.01" max="999999.99" step="0.01" />
    <x-admin.field label="Status" name="unit-new-status" type="select"><option>Available</option><option>Maintenance</option></x-admin.field><button type="submit" class="btn btn-primary">Add Tricycle</button><p class="ts-form-message" role="status" hidden></p>
</form></x-admin.dialog>
<x-admin.dialog id="unit-details-dialog" title="Unit Details"><h3 id="unit-detail-name"></h3><dl class="ts-summary"><div><dt>Plate (example)</dt><dd id="unit-detail-plate"></dd></div><div><dt>Model</dt><dd>Not supplied in sample</dd></div><div><dt>Daily rate</dt><dd>₱350</dd></div><div><dt>Status</dt><dd id="unit-detail-status"></dd></div></dl><button type="button" class="btn btn-outline-danger" data-archive-kind="unit">Archive Tricycle</button></x-admin.dialog>
<x-admin.dialog id="archive-dialog" title="Archive Record"><p id="archive-record"></p><p class="ts-muted">Referenced records are archived, never erased. Past assignments, payments and service records remain available.</p><form data-preview-form="archive" class="ts-form-stack"><x-admin.field label="Reason" name="archive-reason" maxlength="250" /><label class="form-check"><input type="checkbox" class="form-check-input" required><span class="form-check-label">Confirm archiving this record.</span></label><button type="submit" class="btn btn-outline-danger">Archive Record</button><p class="ts-form-message" role="status" hidden></p></form></x-admin.dialog>
<x-admin.dialog id="activity-dialog" title="Activity Details"><h3 id="activity-record"></h3><p class="ts-muted">Administrator: Manager · 23 November 2026</p><p id="activity-change"></p><p class="ts-muted">Read-only sample change history.</p></x-admin.dialog>

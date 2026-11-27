<section data-admin-page="collections" data-title="Rental Collections" data-description="Record daily rental payments and review payment history." hidden>
    <div class="ts-metrics">
        <x-admin.metric label="Payments received today" value="₱0" note="Awaiting connected records" tone="primary" />
        <x-admin.metric label="Number of payments" value="0" note="Awaiting connected records" />
        <x-admin.metric label="Tricycles in fleet" value="0" note="Awaiting connected records" />
    </div>
    <div class="ts-columns ts-columns-payment">
        <x-admin.panel title="Record a Payment"><p class="ts-muted">Choose an assignment to connect the payment.</p>
            <form data-preview-form="payment" class="ts-form-stack">
                <x-admin.field label="Driver and Assignment" name="payment-assignment" type="select"><option value="">Select an assignment</option></x-admin.field>
                <x-admin.field label="Amount Received (₱)" name="payment-amount" type="number" min="0.01" step="0.01" max="999999.99" placeholder="Enter payment amount" />
                <x-admin.field label="Payment Date" name="payment-date" type="date"   />
                <x-admin.field label="Receipt Reference (Optional)" name="payment-reference" :required="false" maxlength="80" placeholder="Enter reference number" />
                <button class="btn btn-primary" type="submit">Save Payment</button><p class="ts-form-message" role="status" hidden></p>
            </form>
        </x-admin.panel>
        <x-admin.panel title="Recent Payment History"><p class="ts-muted">Search by date, driver or tricycle.</p>
            <label class="visually-hidden" for="payment-search">Search payments</label><input class="form-control mb-3" id="payment-search" type="search" placeholder="Search driver, unit or date…">
            <div class="table-responsive" tabindex="0" role="region" aria-label="Scrollable sample records"><table class="table ts-table"><caption class="visually-hidden">Example payments. Select a record to preview a correction.</caption><thead><tr><th scope="col">Driver / Unit</th><th scope="col">Amount</th><th scope="col">Status</th></tr></thead><tbody>
                @foreach([] as $driver)<tr data-payment-row><td><button class="ts-text-button" type="button" data-payment-detail="Driver {{ $driver }} · Unit 0{{ $loop->iteration }}" data-bs-toggle="modal" data-bs-target="#correction-dialog">Driver {{ $driver }}</button><small>Unit 0{{ $loop->iteration }} · 23 Nov 2026</small></td><td>₱350</td><td><span class="ts-status">Recorded</span></td></tr>@endforeach
            </tbody></table></div><p class="ts-empty" id="payment-empty">No payments match your search.</p>
            <div class="mt-4"><h3>Incorrect payment?</h3><p class="ts-muted">Open its record to void and replace it.<br>Original payment remains in activity history.</p></div><button class="btn btn-soft w-100 mt-3" data-focus="payment-search" type="button">View All Payments</button>
        </x-admin.panel>
    </div>
</section>

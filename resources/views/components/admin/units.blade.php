@props(['payments' => false])
<div class="ts-unit-grid">
    @foreach ([] as [$unit, $driver, $time])
        <article class="ts-unit {{ $unit === '03' ? 'ts-unit-warning' : '' }}" data-assignment-card data-date="2026-11-23">
            <div class="ts-unit-heading"><h3>UNIT {{ $unit }}</h3><span class="ts-status {{ $unit === '03' ? 'ts-status-warning' : '' }}">{{ $unit === '03' ? 'Maintenance' : 'Assigned' }}</span></div>
            <strong>{{ $driver }}</strong><p>{{ $time }}</p><small>{{ $unit === '03' ? 'Service scheduled' : ($payments ? '₱350 payment recorded' : 'Active assignment') }}</small>
        </article>
    @endforeach
</div>

<p class="ts-empty">No assignments available. Connect driver and fleet records to begin.</p>

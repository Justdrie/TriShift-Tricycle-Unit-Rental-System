@props(['label', 'value', 'note', 'tone' => 'default', 'valueId' => null])
<article class="ts-metric ts-metric-{{ $tone }}">
    <img class="ts-metric-detail" src="{{ asset('images/admin/'.match($tone) { 'primary' => '9b0ec.svg', 'warning' => '5a111.svg', default => '0c2f3.svg' }) }}" alt="">
    <h2>{{ $label }}</h2><p class="ts-metric-value" @if($valueId) id="{{ $valueId }}" @endif>{{ $value }}</p><p class="ts-metric-note">{{ $note }}</p>
</article>

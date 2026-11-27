@props(['title'])
<section {{ $attributes->class(['ts-panel']) }}>
    <h2>{{ $title }}</h2>
    {{ $slot }}
</section>

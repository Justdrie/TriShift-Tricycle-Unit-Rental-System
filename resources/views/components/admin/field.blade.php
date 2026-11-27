@props(['label', 'name', 'type' => 'text', 'required' => true])
<div class="ts-field">
    <label for="{{ $name }}">{{ $label }}</label>
    @if($type === 'select')
        <select id="{{ $name }}" name="{{ $name }}" {{ $attributes->class(['form-select']) }} @required($required)>{{ $slot }}</select>
    @else
        <input id="{{ $name }}" name="{{ $name }}" type="{{ $type }}" {{ $attributes->class(['form-control']) }} @required($required)>
    @endif
</div>

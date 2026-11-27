@props(['id', 'title'])
<div class="modal" id="{{ $id }}" tabindex="-1" aria-labelledby="{{ $id }}-title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content">
        <div class="modal-header"><h2 class="modal-title fs-5" id="{{ $id }}-title">{{ $title }}</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close dialog"></button></div>
        <div class="modal-body">{{ $slot }}</div>
        <div class="modal-footer"><button type="button" class="btn btn-soft" data-bs-dismiss="modal">Close</button></div>
    </div></div>
</div>

import { Modal, Offcanvas } from 'bootstrap';

// Isolated, illustrative records. No requests, localStorage, or database writes.
const assignments = [];
const payments = [];
const services = [];
const normalize = (value) => String(value).trim().toLowerCase();

export function assignmentError({ unit, driver, start, end }) {
    if (!unit || !driver || !start || !end) return 'Choose a unit, driver, and both operating times.';
    if (!Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end)) || start >= end) return 'End time must be after start time.';
    const conflict = assignments.find((row) => (row.unit === unit || row.driver === driver) && start < row.end && end > row.start);
    return conflict ? `Schedule conflict: ${conflict.driver} / Unit ${conflict.unit} operates ${conflict.start.replace('T', ' ')} to ${conflict.end.replace('T', ' ')}.` : '';
}

// RFC-style quoted fields, embedded newlines, CRLF, escaped quotes, and UTF-8 BOM.
export function parseCsv(text) {
    const rows = [];
    let row = [], field = '', quoted = false, closed = false;
    const source = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < source.length; i++) {
        const char = source[i];
        if (quoted) {
            if (char === '"' && source[i + 1] === '"') { field += '"'; i++; }
            else if (char === '"') { quoted = false; closed = true; }
            else field += char;
        } else if (char === '"') {
            if (field || closed) throw new Error('Unexpected quote in an unquoted field.');
            quoted = true;
        } else if (char === ',' || char === '\n' || char === '\r') {
            row.push(field); field = ''; closed = false;
            if (char !== ',') {
                if (row.some((cell) => cell.trim())) rows.push(row);
                row = [];
                if (char === '\r' && source[i + 1] === '\n') i++;
            }
        } else {
            if (closed) throw new Error('Unexpected character after a closing quote.');
            field += char;
        }
    }
    if (quoted) throw new Error('Unclosed quoted field.');
    row.push(field);
    if (row.some((cell) => cell.trim())) rows.push(row);
    return rows;
}

export function validateCsv(rows, type) {
    if (rows.length < 2) throw new Error('The CSV must contain a header and at least one record.');
    if (rows.length > 1001) throw new Error('Use a file with no more than 1,000 records.');
    const headers = rows[0].map(normalize);
    const required = type === 'drivers' ? ['name', 'contact', 'type'] : ['unit', 'plate', 'model', 'rate', 'status'];
    if (new Set(headers).size !== headers.length) throw new Error('Duplicate column headings are not allowed.');
    if (required.some((key) => !headers.includes(key))) throw new Error(`Required columns: ${required.join(', ')}.`);
    const existingNames = [];
    const seen = new Set(existingNames);
    const plates = new Set();
    return rows.slice(1).map((cells, index) => {
        const record = Object.fromEntries(headers.map((key, position) => [key, (cells[position] ?? '').trim()]));
        const label = record.name || record.unit || '(Missing name / unit)';
        const key = normalize(label);
        const reasons = [];
        if (cells.length !== headers.length) reasons.push('Column count does not match the header');
        if (required.some((column) => !record[column])) reasons.push('Missing required value');
        if (Object.values(record).some((value) => value.length > 250)) reasons.push('Value exceeds 250 characters');
        if (seen.has(key)) reasons.push(type === 'drivers' ? 'Duplicate name' : 'Duplicate unit');
        if (type === 'drivers') {
            if (!['regular', 'substitute'].includes(normalize(record.type))) reasons.push('Type must be Regular or Substitute');
            if (!/^[+()\d\s-]{7,20}$/.test(record.contact)) reasons.push('Invalid contact number');
        } else {
            if (plates.has(normalize(record.plate))) reasons.push('Duplicate plate');
            if (!/^\d+(\.\d{1,2})?$/.test(record.rate) || Number(record.rate) <= 0 || Number(record.rate) > 999999.99) reasons.push('Rate must be a positive amount up to 999999.99 with at most two decimals');
            if (!['available', 'maintenance'].includes(normalize(record.status))) reasons.push('Status must be Available or Maintenance');
        }
        if (!reasons.length) { seen.add(key); if (type === 'tricycles') plates.add(normalize(record.plate)); }
        return { row: index + 2, label, valid: !reasons.length, reason: reasons.join('; ') || 'Ready for preview' };
    });
}

export function csvText(rows) {
    // Prevent formula execution when opening exported text in spreadsheet apps.
    const escape = (value) => {
        let cell = String(value ?? '');
        if (/^[\s]*[=+@-]/.test(cell) || /^[\t\r\n]/.test(cell)) cell = `'${cell}`;
        return `"${cell.replaceAll('"', '""')}"`;
    };
    return '\uFEFF' + rows.map((row) => row.map(escape).join(',')).join('\r\n');
}

function initializeAdmin() {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const value = (id) => document.getElementById(id).value.trim();
    const money = (amount) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(amount);
    let feedbackTimer;
    const notify = (message) => {
        const element = $('#admin-feedback');
        element.textContent = message; element.hidden = false;
        window.dispatchEvent(new CustomEvent("admin:notification", {detail: {message}}));
        clearTimeout(feedbackTimer);
        feedbackTimer = setTimeout(() => { element.hidden = true; }, 9000);
    };
    const formMessage = (form, message, error = false) => {
        const element = $('.ts-form-message', form);
        element.textContent = message; element.hidden = false;
        element.classList.toggle('is-error', error);
        window.dispatchEvent(new CustomEvent('admin:notification', {detail: {message, error}}));
    };
    function navigate(moveFocus = true) {
        const key = location.hash.slice(1).split('?')[0] || 'dashboard';
        const page = $$('[data-admin-page]').find((item) => item.dataset.adminPage === key) || $('[data-admin-page="dashboard"]');
        $$('[data-admin-page]').forEach((item) => { item.hidden = item !== page; });
        $$('[data-page-link]').forEach((link) => {
            const active = link.dataset.pageLink === page.dataset.adminPage;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        });
        $('#admin-title').textContent = page.dataset.title;
        $('#admin-description').textContent = page.dataset.description;
        document.title = `${page.dataset.title} · TriShift Admin`;
        const sidebar = $('#admin-sidebar');
        if (sidebar.classList.contains('show')) {
            sidebar.addEventListener('hidden.bs.offcanvas', () => $('#admin-content').focus({ preventScroll: true }), { once: true });
            Offcanvas.getInstance(sidebar)?.hide();
        }
        if (moveFocus) { $('#admin-content').focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
    }
    window.addEventListener('hashchange', () => navigate());
    navigate(false);
    $$('[data-page-link]').forEach((link) => link.addEventListener('click', () => {
        if (location.hash === link.hash) Offcanvas.getInstance($('#admin-sidebar'))?.hide();
    }));
    $$('[data-focus]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.focus)?.focus()));

    // Prevent native navigation for every preview form, including when validation fails.
    $$('[data-preview-form]').forEach((form) => {
        form.addEventListener('input', () => { $('.ts-form-message', form).hidden = true; });
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            if ($$('input[required]:not([type="checkbox"]), select[required]', form).some((input) => !input.value.trim())) {
                formMessage(form, 'Required fields cannot contain only spaces.', true); return;
            }
            let error = '', message = '';
            switch (form.dataset.previewForm) {
                case 'assignment':
                    error = assignmentError({ unit: value('assignment-unit'), driver: value('assignment-driver'), start: value('assignment-start'), end: value('assignment-end') });
                    message = 'Assignment details checked. Saving is not available yet; no assignment was saved.';
                    break;
                case 'swap': {
                    const original = assignments.find((row) => row.unit === value('swap-assignment'));
                    const time = value('swap-time');
                    if (!original || time <= original.start || time >= original.end) error = 'Swap time must fall strictly inside the selected operating period on 23 November 2026.';
                    else if (original.driver === value('swap-driver')) error = 'Choose a different replacement driver.';
                    else if (assignments.some((row) => row.driver === value('swap-driver') && time < row.end && original.end > row.start)) error = 'The replacement driver has an overlapping assignment.';
                    else message = `Swap details: ${original.driver} retains ${original.start.slice(11)}–${time.slice(11)}; ${value('swap-driver')} covers ${time.slice(11)}–${original.end.slice(11)}. No swap was saved.`;
                    break;
                }
                case 'payment': message = `Payment details: ${money(Number(value('payment-amount')))} for Unit ${value('payment-assignment')}. No payment was recorded.`; break;
                case 'correction': message = `Correction details: retain the original ₱350 payment as voided and link a ${money(Number(value('correction-amount')))} replacement. Nothing was changed.`; break;
                case 'service':
                    if (value('service-due') && value('service-due') < value('service-date')) error = 'The next service date cannot be before the service date.';
                    message = 'Service details checked. Saving is not available yet; no service record was saved.'; break;
                case 'driver':
                    
                    message = 'Driver details checked. Saving is not available yet; no driver was added.'; break;
                case 'unit':
                    
                    message = 'Tricycle details checked. Saving is not available yet; no tricycle was added.'; break;
                case 'archive': message = 'Archiving is not available yet. No record was changed.'; break;
                default: message = 'Details checked. Saving is not available yet; no data was saved.';
            }
            formMessage(form, error || message, Boolean(error));
        });
    });
    $$('.modal').forEach((dialog) => dialog.addEventListener('hidden.bs.modal', () => {
        $$('form', dialog).forEach((form) => { form.reset(); $('.ts-form-message', form).hidden = true; });
    }));
    $('#assignment-date').addEventListener('input', () => {
        const match = false;
        $$('[data-admin-page="assignments"] [data-assignment-card]').forEach((card) => { card.hidden = !match; });
        $('#assignment-empty').hidden = match;
    });
    $('#payment-search').addEventListener('input', () => {
        const rows = $$('[data-payment-row]');
        rows.forEach((row) => { row.hidden = !normalize(row.textContent).includes(normalize(value('payment-search'))); });
        $('#payment-empty').hidden = rows.some((row) => !row.hidden);
    });
    let driverType = 'All';
    function filterDrivers() {
        const rows = $$('[data-driver-row]');
        rows.forEach((row) => { row.hidden = !normalize(row.textContent).includes(normalize(value('driver-search'))) || (driverType !== 'All' && row.dataset.type !== driverType); });
        $('#driver-empty').hidden = rows.some((row) => !row.hidden);
    }
    $('#driver-search').addEventListener('input', filterDrivers);
    $$('[data-driver-type]').forEach((button) => button.addEventListener('click', () => {
        driverType = button.dataset.driverType;
        $$('[data-driver-type]').forEach((item) => {
            const selected = item === button; item.setAttribute('aria-pressed', String(selected));
            item.classList.toggle('btn-soft', selected); item.classList.toggle('btn-white', !selected);
        }); filterDrivers();
    }));
    function filterUnits() {
        const cards = $$('[data-unit-card]');
        cards.forEach((card) => { card.hidden = !normalize(card.dataset.search).includes(normalize(value('unit-search'))) || Boolean(value('unit-status') && value('unit-status') !== card.dataset.status); });
        $('#unit-empty').hidden = cards.some((card) => !card.hidden);
    }
    ['unit-search', 'unit-status'].forEach((id) => document.getElementById(id).addEventListener('input', filterUnits));
    $$('[data-profile]').forEach((button) => button.addEventListener('click', () => {
        $('#profile-name').textContent = button.dataset.profile;
        const row = assignments.find((item) => item.driver === button.dataset.profile);
        $('#profile-history').textContent = row ? `23 Nov 2026 · Unit ${row.unit} · ${row.start.slice(11)}–${row.end.slice(11)}` : 'No assignments in the example schedule.';
    }));
    $$('[data-unit-detail]').forEach((button) => button.addEventListener('click', () => {
        const unit = button.dataset.unitDetail;
        $('#unit-detail-name').textContent = `Unit ${unit}`;
        $('#unit-detail-plate').textContent = `SAMPLE-${unit}`;
        $('#unit-detail-status').textContent = unit === '03' ? 'Maintenance' : 'Available';
    }));
    let archiveTrigger;
    $$('[data-archive-kind]').forEach((button) => button.addEventListener('click', () => {
        archiveTrigger = button;
        $('#archive-record').textContent = button.dataset.archiveKind === 'driver' ? $('#profile-name').textContent : $('#unit-detail-name').textContent;
        const current = button.closest('.modal');
        current.addEventListener('hidden.bs.modal', () => Modal.getOrCreateInstance($('#archive-dialog')).show(), { once: true });
        Modal.getInstance(current)?.hide();
    }));
    $('#archive-dialog').addEventListener('hidden.bs.modal', () => {
        if (archiveTrigger) {
            const parent = archiveTrigger.closest('.modal');
            parent.addEventListener('shown.bs.modal', () => archiveTrigger.focus(), { once: true });
            Modal.getOrCreateInstance(parent).show();
        }
    });
    $$('[data-payment-detail]').forEach((button) => button.addEventListener('click', () => { $('#correction-record').textContent = button.dataset.paymentDetail; }));
    $$('[data-activity-detail]').forEach((button) => button.addEventListener('click', () => {
        $('#activity-record').textContent = button.dataset.record; $('#activity-change').textContent = button.dataset.activityDetail;
    }));
    function rangeError(prefix) {
        const invalid = value(`${prefix}-start`) && value(`${prefix}-end`) && value(`${prefix}-start`) > value(`${prefix}-end`);
        const message = $(`#${prefix}-error`);
        message.hidden = !invalid; message.textContent = invalid ? 'Start date must be on or before end date.' : '';
        message.classList.toggle('is-error', Boolean(invalid));
        return Boolean(invalid);
    }
    function inRange(row, prefix) { return (!value(`${prefix}-start`) || row.date >= value(`${prefix}-start`)) && (!value(`${prefix}-end`) || row.date <= value(`${prefix}-end`)); }
    function filterActivity() {
        const invalid = rangeError('activity'), rows = $$('[data-activity-row]');
        rows.forEach((row) => { row.hidden = invalid || !inRange(row.dataset, 'activity') || Boolean(value('activity-account') && row.dataset.account !== value('activity-account')) || Boolean(value('activity-action') && row.dataset.action !== value('activity-action')); });
        $('#activity-empty').hidden = rows.some((row) => !row.hidden);
    }
    ['activity-start', 'activity-end', 'activity-account', 'activity-action'].forEach((id) => document.getElementById(id).addEventListener('input', filterActivity));
    function reportRows(rows) {
        if (rangeError('report')) return [];
        return rows.filter((row) => inRange(row, 'report') && (!value('report-driver') || row.driver === value('report-driver')) && (!value('report-unit') || row.unit === value('report-unit')));
    }
    const total = (rows) => rows.reduce((sum, row) => sum + row.amount, 0);
    function updateReports() {
        const selectedPayments = reportRows(payments), selectedServices = reportRows(services);
        $('#report-collections').textContent = $('#report-payment-total').textContent = money(total(selectedPayments));
        $('#report-maintenance').textContent = $('#report-service-total').textContent = money(total(selectedServices));
        $('#report-payment-count').textContent = String(selectedPayments.length);
        $('#report-service-count').textContent = String(selectedServices.length);
        $('#report-assignments').textContent = String(reportRows(assignments.map((row) => ({ date: row.start.slice(0, 10), driver: row.driver, unit: `Unit ${row.unit}` }))).length);
        $$('[data-export]').forEach((button) => { button.disabled = rangeError('report'); });
    }
    ['report-start', 'report-end', 'report-driver', 'report-unit'].forEach((id) => document.getElementById(id).addEventListener('input', updateReports));
    function download(filename, rows) {
        const blob = new Blob([csvText(rows)], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    $$('[data-export]').forEach((button) => button.addEventListener('click', () => {
        if (rangeError('report')) return;
        const rows = reportRows(button.dataset.export === 'payments' ? payments : services);
        download(`trishift-sample-${button.dataset.export}.csv`, [['Data', 'Date', 'Driver', 'Unit', 'Amount (PHP)', 'Status'], ...rows.map((row) => ['SAMPLE', row.date, row.driver, row.unit, row.amount, row.status])]);
        notify(`Exported ${rows.length} sample ${button.dataset.export} record(s) for the selected filters.`);
    }));

    updateReports();
    let validRows = [], loadVersion = 0;
    function clearImport(message) {
        loadVersion++; validRows = []; $('#csv-confirm').disabled = true; $('#csv-preview').replaceChildren();
        $('#csv-status').textContent = message;
    }
    async function previewFile(file) {
        clearImport('Reading file locally…');
        const version = loadVersion, type = value('import-type');
        if (!file) { $('#csv-status').textContent = 'No file selected.'; return; }
        try {
            if (!/\.csv$/i.test(file.name)) throw new Error('Choose a .csv file. Excel .xlsx files are not supported.');
            if (file.size > 1024 * 1024) throw new Error('File exceeds the 1 MB preview limit.');
            const text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
            if (version !== loadVersion) return;
            const rows = validateCsv(parseCsv(text), type);
            validRows = rows.filter((row) => row.valid);
            const fragment = document.createDocumentFragment();
            rows.forEach((row) => {
                const tr = document.createElement('tr');
                [row.row, row.label, row.valid ? 'Valid' : 'Rejected', row.reason].forEach((cell, index) => {
                    const td = document.createElement(index === 0 ? 'th' : 'td');
                    if (index === 0) td.scope = 'row';
                    td.textContent = String(cell); tr.append(td);
                }); fragment.append(tr);
            });
            $('#csv-preview').replaceChildren(fragment); $('#csv-confirm').disabled = validRows.length === 0;
            $('#csv-status').textContent = `${file.name}: ${validRows.length} valid, ${rows.length - validRows.length} rejected. File stays in this browser; nothing is uploaded.`;
        } catch (error) {
            if (version !== loadVersion) return;
            clearImport(error instanceof TypeError ? 'File must be valid UTF-8 text.' : error.message);
        }
    }
    $('#csv-file').addEventListener('change', (event) => previewFile(event.target.files[0]));
    $('#import-type').addEventListener('change', () => {
        $('#csv-file').value = '';
        clearImport('Record type changed. Select a CSV to validate.');
        $('#csv-help').textContent = value('import-type') === 'drivers' ? 'Required columns: name, contact, type (Regular or Substitute).' : 'Required columns: unit, plate, model, rate, status (Available or Maintenance).';
    });
    const dropzone = $('#csv-dropzone');
    ['dragenter', 'dragover'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.add('is-dragging'); }));
    ['dragleave', 'drop'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.remove('is-dragging'); }));
    dropzone.addEventListener('drop', (event) => {
        if (event.dataTransfer.files.length !== 1) { clearImport('Choose exactly one CSV file.'); return; }
        $('#csv-file').value = ''; previewFile(event.dataTransfer.files[0]);
    });
    $('#csv-template').addEventListener('click', () => {
        const isDriver = value('import-type') === 'drivers';
        download(`trishift-${isDriver ? 'drivers' : 'tricycles'}-template.csv`, isDriver ? [['name', 'contact', 'type'], ['Example Driver', '09000000000', 'Substitute']] : [['unit', 'plate', 'model', 'rate', 'status'], ['Unit 04', 'EXAMPLE-04', 'Example model', '350', 'Available']]);
    });
    $('#csv-confirm').addEventListener('click', () => {
        if (!validRows.length) return;
        notify(`Validation completed for ${validRows.length} valid row(s). No records were imported. Importing is not available yet.`);
        $('#csv-status').textContent = `${validRows.length} valid row(s) validated. Importing is not available yet; nothing was imported.`;
    });
}

if (typeof document !== 'undefined' && document.body.classList.contains('ts-admin')) initializeAdmin();

// Session-only UI notifications; backend alerts can dispatch the same event.
if (typeof document !== 'undefined' && document.querySelector('#notification-list')) {
    const list = document.querySelector('#notification-list');
    const count = document.querySelector('#notification-count');
    const empty = document.querySelector('#notifications-empty');
    const refresh = () => { count.textContent = String(list.querySelectorAll('[data-unread]').length); empty.hidden = list.children.length > 0; };
    window.addEventListener('admin:notification', (event) => {
        if (!event.detail || typeof event.detail.message !== 'string') return;
        const item = document.createElement('li'); item.className = 'ts-notification'; item.dataset.unread = 'true';
        const heading = document.createElement('strong'); heading.textContent = event.detail.error ? 'Needs attention' : 'Form update';
        const message = document.createElement('p'); message.textContent = event.detail.message;
        const time = document.createElement('small'); time.textContent = new Date().toLocaleTimeString('en-PH', {hour:'2-digit',minute:'2-digit'});
        const dismiss = document.createElement('button'); dismiss.type = 'button'; dismiss.className = 'ts-text-button'; dismiss.textContent = 'Dismiss'; dismiss.addEventListener('click', () => {item.remove();refresh();});
        item.append(heading,message,time,dismiss); list.prepend(item); if(list.children.length > 30) list.lastElementChild.remove(); refresh();
    });
    document.querySelector('#notifications-read').addEventListener('click', () => {list.querySelectorAll('[data-unread]').forEach(item => delete item.dataset.unread);refresh();});
    document.querySelector('#notifications-clear').addEventListener('click', () => {list.replaceChildren();refresh();});
}

// Stop decorative ripple work when the tab is not visible.
if (typeof document !== 'undefined' && document.body.classList.contains('ts-admin')) {
    const syncMotionVisibility = () => document.body.classList.toggle('ts-motion-paused', document.hidden);
    document.addEventListener('visibilitychange', syncMotionVisibility);
    syncMotionVisibility();
}

if (typeof document !== 'undefined' && document.body.classList.contains('ts-admin')) {
    const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const parse = value => { const [y,m,d] = value.split('T')[0].split('-').map(Number); return y && m && d ? new Date(y,m-1,d) : new Date(); };
    document.querySelectorAll('input[type="date"],input[type="datetime-local"]').forEach(input => {
        if (!('showPopover' in HTMLElement.prototype)) return;
        const timed = input.type === 'datetime-local';
        const wrapper = document.createElement('div'); wrapper.className = 'ts-date-control';
        input.before(wrapper); wrapper.append(input); input.classList.add('ts-date-enhanced');
        const trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'ts-calendar-trigger';
        const label = input.labels?.[0]?.textContent.trim() || 'date';
        trigger.setAttribute('aria-label', `Choose ${label}`); trigger.setAttribute('aria-haspopup','dialog'); trigger.setAttribute('aria-expanded','false');
        const icon = document.createElement('i'); icon.className = 'bi bi-calendar3'; icon.setAttribute('aria-hidden','true'); trigger.append(icon); wrapper.append(trigger);
        const popup = document.createElement('div'); popup.className = 'ts-calendar'; popup.id = `${input.id}-calendar`; popup.setAttribute('popover','auto'); popup.setAttribute('role','dialog'); popup.setAttribute('aria-label', `Choose ${label}`); wrapper.append(popup); trigger.setAttribute('aria-controls',popup.id);
        let month, draft, timeValue;
        const allowed = date => (!input.min || date >= input.min.slice(0,10)) && (!input.max || date <= input.max.slice(0,10));
        function commit(value) { input.value = value; input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})); popup.hidePopover(); trigger.focus(); }
        function button(text, name, action) { const b=document.createElement('button'); b.type='button'; b.textContent=text; b.setAttribute('aria-label',name); b.addEventListener('click',action); return b; }
        function position() {
            const r=input.getBoundingClientRect(), width=Math.min(292,window.innerWidth-24);
            popup.style.width=`${width}px`; popup.style.left=`${Math.max(12,Math.min(r.left,window.innerWidth-width-12))}px`;
            const h=popup.getBoundingClientRect().height;
            popup.style.top=`${Math.max(12, r.bottom+h+8 <= innerHeight ? r.bottom+6 : r.top-h-6)}px`;
        }
        function render() {
            popup.replaceChildren();
            const header=document.createElement('div');header.className='ts-calendar-header';
            const title=document.createElement('strong'); title.textContent=month.toLocaleDateString('en-PH',{month:'long',year:'numeric'}); title.setAttribute('aria-live','polite');
            header.append(button('‹','Previous month',()=>{month.setMonth(month.getMonth()-1);render();popup.querySelector('[aria-label="Previous month"]')?.focus();}),title,button('›','Next month',()=>{month.setMonth(month.getMonth()+1);render();popup.querySelector('[aria-label="Next month"]')?.focus();}));popup.append(header);
            const weekdays=document.createElement('div');weekdays.className='ts-calendar-weekdays';weekdays.setAttribute('aria-hidden','true');
            ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(day=>{const span=document.createElement('span');span.textContent=day;weekdays.append(span);});popup.append(weekdays);
            const grid=document.createElement('div');grid.className='ts-calendar-days';
            const start=new Date(month.getFullYear(),month.getMonth(),1-month.getDay());
            for(let i=0;i<42;i++) {
                const day=new Date(start); day.setDate(start.getDate()+i); const value=iso(day);
                const b=button(String(day.getDate()),day.toLocaleDateString('en-PH',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),()=>{draft=value;if(timed){render();popup.querySelector('input[type="time"]').focus();}else commit(value);});
                b.dataset.date=value;b.disabled=!allowed(value);b.classList.toggle('outside-month',day.getMonth()!==month.getMonth());b.classList.toggle('selected',value===draft);b.setAttribute('aria-pressed',String(value===draft));if(value===iso(new Date()))b.setAttribute('aria-current','date');
                b.tabIndex=value===(draft || iso(new Date()))?0:-1;
                b.addEventListener('keydown',event=>{const offsets={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};if(!(event.key in offsets))return;event.preventDefault();const next=new Date(day);next.setDate(next.getDate()+offsets[event.key]);const nextValue=iso(next);if(!allowed(nextValue))return;month=new Date(next.getFullYear(),next.getMonth(),1);render();const target=popup.querySelector(`[data-date="${nextValue}"]`);popup.querySelectorAll('.ts-calendar-days button').forEach(day=>day.tabIndex=-1);target.tabIndex=0;target.focus();});grid.append(b);
            }
            if(!grid.querySelector('button[tabindex="0"]:not(:disabled)')){const first=grid.querySelector('button:not(:disabled)');if(first)first.tabIndex=0;}popup.append(grid);
            if(timed){const timeLabel=document.createElement('label');timeLabel.className='ts-calendar-time';timeLabel.textContent='Time';const time=document.createElement('input');time.type='time';time.className='form-control';time.value=timeValue;time.addEventListener('input',()=>{timeValue=time.value;});timeLabel.append(time);popup.append(timeLabel);}
            const footer=document.createElement('div');footer.className='ts-calendar-footer';footer.append(button('Clear','Clear date',()=>commit('')));
            const today=button('Today','Choose today',()=>{draft=iso(new Date());month=new Date(new Date().getFullYear(),new Date().getMonth(),1);if(timed)render();else commit(draft);});today.disabled=!allowed(iso(new Date()));footer.append(today);
            if(timed){const apply=button('Apply','Apply date and time',()=>{const value=`${draft}T${timeValue}`;if(draft&&timeValue&&(!input.min||value>=input.min)&&(!input.max||value<=input.max))commit(value);else {const message=popup.querySelector('.ts-calendar-error');message.textContent='Choose a date and time within the allowed range.';}});footer.append(apply);}popup.append(footer);
            const error=document.createElement('p');error.className='ts-calendar-error';error.setAttribute('role','status');popup.append(error);
            if(popup.matches(':popover-open'))position();
        }
        function open(){if(input.disabled||input.readOnly)return;if(popup.matches(':popover-open')){popup.hidePopover();return;}draft=input.value.slice(0,10);timeValue=input.value.split('T')[1]?.slice(0,5)||'00:00';const date=parse(input.value);month=new Date(date.getFullYear(),date.getMonth(),1);render();popup.showPopover();position();popup.querySelector('.ts-calendar-days button[tabindex="0"]')?.focus();}
        trigger.addEventListener('click',open);
        input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'&&event.altKey){event.preventDefault();open();}});
        popup.addEventListener('toggle',()=>trigger.setAttribute('aria-expanded',String(popup.matches(':popover-open'))));
        popup.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();popup.hidePopover();trigger.focus();}});
        window.addEventListener('resize',()=>{if(popup.matches(':popover-open'))position();});
        document.addEventListener('scroll',event=>{if(popup.matches(':popover-open')&&!popup.contains(event.target))popup.hidePopover();},true);
        window.addEventListener('hashchange',()=>{if(popup.matches(':popover-open'))popup.hidePopover();});
        input.closest('.modal')?.addEventListener('hide.bs.modal',()=>{if(popup.matches(':popover-open'))popup.hidePopover();});
    });
}

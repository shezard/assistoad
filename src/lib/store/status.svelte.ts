let status = $state('');
let statusInvalid = $state(false);

export default {
    get status() { return status; },
    set status(value) { status = value; },
    get statusInvalid() { return statusInvalid; },
    set statusInvalid(value) { statusInvalid = value; },
}

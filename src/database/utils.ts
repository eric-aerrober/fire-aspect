export function randomId() {
    return Math.random().toString(36).substring(7) + '-' + Math.random().toString(36).substring(7) + '-' + Math.random().toString(36).substring(7)
}

export function shortRandomId() {
    return Math.random().toString(36).substring(7)
}

export function timestamp() {
    return new Date().toISOString()
}

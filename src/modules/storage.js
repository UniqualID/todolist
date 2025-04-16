function store(key, val) {
    let toStore = {
        type: typeof val,
        value: val,
    };

    localStorage.setItem(key, JSON.stringify(toStore));
}

function retrieve(key, defaultval = null) {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultval;

    const parsed = JSON.parse(localStorage.getItem(key));
    if (!parsed) return defaultval;
    switch (parsed.type) {
        case 'string':
            return parsed.value;
        case 'number':
            return +parsed.value;
        case 'boolean':
            return Boolean(parsed.value);
        case 'object':
            return parsed.value;
        default:
            return defaultval;
    }
}
export { store, retrieve };

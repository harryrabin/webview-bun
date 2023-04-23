Object.defineProperty(window, '__wvHandlers', {
    readonly: true,
    value: {}
})

Object.defineProperty(window, '__wvInvoke', {
    readonly: true,
    value: (rawJson) => {
        const args = JSON.parse(rawJson);
        if (__wvHandlers[args[0]] === undefined) return;

        const remainder = args.length > 1 ? args.slice(1) : [];

        __wvHandlers[args[0]](...remainder);
    }
})

Object.defineProperty(window, 'wvHandleMessage', {
    readonly: true,
    value: (name, handler) => {
        window.__wvHandlers[name] = handler
    }
})
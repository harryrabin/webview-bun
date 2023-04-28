Object.defineProperty(window, '__wvbHandlers', {
    value: {}
});

Object.defineProperty(window, '__wvbInvoke', {
    value: (name, argsJson) => {
        const args = JSON.parse(argsJson);
        window.__wvbHandlers[name](...args);
    }
});

Object.defineProperty(window, 'wvbHandleMessage', {
    value: (name, handler) => {
        window.__wvbHandlers[name] = handler;
    }
});
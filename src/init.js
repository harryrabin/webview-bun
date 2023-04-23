Object.defineProperty(window, '__wvHandlers', {
    value: {}
});

Object.defineProperty(window, '__wvInvoke', {
    value: (name, argsJson) => {
        const args = JSON.parse(argsJson);
        __wvHandlers[name](...args);
    }
});

Object.defineProperty(window, 'wvHandleMessage', {
    value: (name, handler) => {
        window.__wvHandlers[name] = handler;
    }
});
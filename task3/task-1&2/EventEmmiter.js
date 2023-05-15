class EventEmitter {
    listeners = {};

    addListener(eventName, fn) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(fn);
    }

    on(eventName, fn) {
        this.addListener(eventName, fn);
    }

    removeListener(eventName, fn) {
        const eventListeners = this.listeners[eventName];
        if (!eventListeners) return;

        const index = eventListeners.indexOf(fn);
        if (index !== -1) {
            eventListeners.splice(index, 1);
        }
    }

    off(eventName, fn) {
        this.removeListener(eventName, fn);
    }

    once(eventName, fn) {
        const wrapperFn = (...args) => {
            fn(...args);
            this.removeListener(eventName, wrapperFn);
        };
        this.addListener(eventName, wrapperFn);
    }

    emit(eventName, ...args) {
        const eventListeners = this.listeners[eventName];
        if (eventListeners) {
            for (const listener of eventListeners) {
                listener(...args);
            }
        }
    }

    listenerCount(eventName) {
        const eventListeners = this.listeners[eventName];
        return eventListeners ? eventListeners.length : 0;
    }

    rawListeners(eventName) {
        return this.listeners[eventName] || [];
    }
}

module.exports = {
    EventEmitter
};

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

const throttle = (cb, delay) => {
    let wait = false;

    return (...args) => {
        if (wait) {
            return;
        }

        cb(...args);
        wait = true;
        setTimeout(() => {
            wait = false;
        }, delay);
    }
}

module.exports = {
    sleep,
    throttle
}

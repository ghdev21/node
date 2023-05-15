const {EventEmitter} = require('./EventEmmiter');
const {EVENTS} = require('./CONSTANTS');
class WithTime extends EventEmitter {
    async execute(asyncFunc, ...args) {
        try {
            this.emit(EVENTS.BEGIN);

            const startTime = new Date();
            const result = await asyncFunc(...args);
            const endTime = new Date();

            this.emit(EVENTS.END);
            this.emit(EVENTS.DATA, result);
            console.log(`Exec time; ${endTime - startTime}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

module.exports = {
    WithTime
}

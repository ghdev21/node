const axios = require("axios");
const {EventEmitter} = require('./EventEmmiter');
const {WithTime} = require('./WithTime')
const {EVENTS, URL} = require('./CONSTANTS')


const myEmitter = new EventEmitter();
//test
function c1() {
    console.log('an event occurred!');
}

function c2() {
    console.log('yet another event occurred!');
}

myEmitter.on('eventOne', c1); // Register for eventOne
myEmitter.on('eventOne', c2); // Register for eventOne

// Register eventOnce for one time execution
myEmitter.once('eventOnce', () => console.log('eventOnce once fired'));
myEmitter.once('init', () => console.log('init once fired'));

// Register for 'status' event with parameters
myEmitter.on('status', (code, msg)=> console.log(`Got ${code} and ${msg}`));


myEmitter.emit('eventOne');

// Emit 'eventOnce' -> After this the eventOnce will be
// removed/unregistered automatically
myEmitter.emit('eventOnce');


myEmitter.emit('eventOne');
myEmitter.emit('init');
myEmitter.emit('init'); // Will not be fired
myEmitter.emit('eventOne');
myEmitter.emit('status', 200, 'ok');

// Get listener's count
console.log(myEmitter.listenerCount('eventOne'));

// Get array of rawListeners//
// Event registered with 'once()' will not be available here after the
// emit has been called
console.log(myEmitter.rawListeners('eventOne'));

// Get listener's count after remove one or all listeners of 'eventOne'
myEmitter.off('eventOne', c1);
console.log(myEmitter.listenerCount('eventOne'));
myEmitter.off('eventOne', c2);
console.log(myEmitter.listenerCount('eventOne'));


/////// task 2
console.log('TASK 2 below')
const withTime = new WithTime();

withTime.on(EVENTS.BEGIN, () => console.log('About to execute'));
withTime.on(EVENTS.END, () => console.log('Done with execute'));
withTime.on(EVENTS.DATA, ({data}) => console.log(JSON.stringify(data,null, 2)))

console.log(withTime.rawListeners(EVENTS.END));

withTime.execute(() => axios(URL))

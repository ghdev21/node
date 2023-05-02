function getRandomNumber(min = 0, max = 100) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

console.log(getRandomNumber());
console.log(getRandomNumber(1, 5));
console.log(getRandomNumber(90, 100));
console.log(getRandomNumber(0, 10));

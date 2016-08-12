/* Set counter module */
let Counter = require('../utilities/counter');
module.exports = class SetCounter {
  constructor(element, event_name, options = {}) {
    this.Counter = Counter;
    this.counter = new Counter(element, options);
    this.counter.start();
    document.addEventListener(event_name, this.update.bind(this));
  }
  update(event) {
    let percent = Math.floor((event.detail.loaded / event.detail.total) * 100);
    this.counter.count = percent;
  }
}


/* Counter module */
// let Counter = require('counter');

// let counter = new Counter(document.querySelector('.percent'), {suffix: ' %'});

// console.log(counter.count);
// counter.start();

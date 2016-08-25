/* Logo animation module */
let SquareAnimation = require('square_animation');
module.exports = class LogoAnimation {
  constructor(elements, border, square, options = {}) {
    this.elements = elements;
    this.border = border;
    this.square = square;
    this.SquareAnimation = SquareAnimation;
    this.squareAnimation = new SquareAnimation(this.square);

    this.interval_timeout = 300;
    this.square_timeout = 5000;
    this.counter = 0;
    this.steps = 8;
    this.interval = null;
  }
  animate() {
    this.interval = setInterval(this.update.bind(this), this.interval_timeout);
  }
  setSquare() {
    this.interval = setInterval(this.squareAnimation.animate(), this.square_timeout);
  }
  setBorder() {
    clearInterval(this.interval);
    this.border.classList.add('show');
    this.setSquare();
  }
  update() {
    if(this.counter && this.counter < this.steps) {
      let item = (this.counter < 4) ? this.counter : Math.abs(8 - this.counter);
      if(item) {
        if(item == 4) {
          this.setBorder();
        }
        else {
          let direction = (this.counter < 4) ? 'add' : 'remove'
          this.elements[item - 1].classList[direction]('show');
        }
      }
    }
    this.counter++;
    if(this.counter > this.steps) {
      this.counter = 0;
    }
  }
};
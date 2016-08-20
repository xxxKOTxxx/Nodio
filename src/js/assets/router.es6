/* Router module */
module.exports = class Router {
  constructor() {
    this.anchor = window.location.hash;
    console.log('this.anchor',this.anchor)
  }
}
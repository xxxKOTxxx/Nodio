/* Router module */
module.exports = class Router {
  constructor() {
    this.faq = document.querySelector('#faq');
    document.addEventListener('resize', this.resizeHandler.bind(this));
  }
  resizeHandler(event) {
    this.faq.style.right = rigth_padding + 'px';
  }
}
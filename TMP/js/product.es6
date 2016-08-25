/* Product page module */
module.exports = class Router {
  constructor() {
    this.selector = '#product';
    this.page = document.querySelector(this.selector);
    this.down_arrow = document.querySelector('.down-arrow');
    this.slide = null;
    this.stage = 0;
    document.addEventListener('set_page', this.setPageHandler.bind(this));
    document.addEventListener('hide_page', this.hidePage.bind(this));
    this.down_arrow.addEventListener('click', this.nextHandler.bind(this));
  }
  setPageHandler(event) {
    let data = event.detail;
    if(data.page == this.selector) {
      let slide_name = data.step || data.page.substr(1);
      this.slide = document.querySelector('.step.' + slide_name);
      this.setPage();
    }
  }
  setPage() {
    this.page.classList.add('show');
    for(let i = this.slide.classList.length - 1; i >= 0; i--) {
      if(this.slide.classList[i].substr(0, 6) == 'stage-') {
        this.slide.classList.remove(this.slide.classList[i])
      }
    }
    this.slide.classList.add('show', 'stage-' + this.stage);
console.log('slide',this.slide)
  }
  hidePage() {
console.log('hidePage')
    this.slide = null;
    this.stage = 0;
    let showed = document.querySelectorAll(this.selector + ' ' + '.show');
console.log('showed',showed.length)
    this.page.classList.remove('show');
    for(let i = showed.length - 1; i >= 0; i--) {
      showed[i].classList.remove('.show');
    }
  }
  nextHandler() {
    if(this.stage < 2) {
      this.stage++;
    }
    else {
      if(this.slide.nextSibling == null) {
        document.dispatchEvent(new CustomEvent('change_page', {detail: '#xana'}));
      }
      this.slide = this.slide.nextSibling;
    }
    this.setPage();
  }
}
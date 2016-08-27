/* Product page module */
module.exports = class Router {
  constructor() {
    this.selector = '#product';
    this.page = document.querySelector(this.selector);
    // this.next = document.querySelector('#next');
    this.pagination = document.querySelector('#pagination');
    this.pagination_items = document.querySelectorAll('#pagination-item');
    this.pagination_items_length = this.pagination_items.length;
    this.slides = document.querySelectorAll(this.selector + ' .step');
    this.slides_length = this.slides.length;
    this.slide_name = null;
    this.slide = null;
    this.stage = -1;
    this.timeouts = [];
    document.addEventListener('set_page', this.setPageHandler.bind(this));
    document.addEventListener('hide_page', this.hidePage.bind(this));
    // this.next.addEventListener('click', this.nextHandler.bind(this));
    for(let i = this.pagination_items_length - 1; i >= 0; i--) {
      this.pagination_items[i].addEventListener('click', this.paginationItemsHandler.bind(this));
    }
  }
  setPageHandler(event) {
    let data = event.detail;
    if(data.page == this.selector) {
      this.stage = -1;
      this.slide_name = data.step || data.page.substr(1);
      this.setPaginationItem('#' + this.slide_name);
      this.slide = document.querySelector('.step.' + this.slide_name);
      this.setPage();
    }
  }
  setPage() {
console.log('setPage',this.slide_name)
    this.page.classList.add('show');
    for(let i = this.slides_length - 1; i >= 0; i--) {
      this.slides[i].classList.remove('show');
    }
    if(this.slide_name == 'product') {
      if(this.stage == -1) {
        this.stage = 0;
      }
    }
    else {
      this.stage = -1;
      this.product();
    }
    this[this.slide_name]();
    // for(let i = this.slide.classList.length - 1; i >= 0; i--) {
    //   if(this.slide.classList[i].substr(0, 6) == 'stage-') {
    //     this.slide.classList.remove(this.slide.classList[i])
    //   }
    // }
    // this.slide.classList.add('show', 'stage-' + this.stage);
  }
  hidePage() {
    this.slide_name = null;
    this.slide = null;
    this.stage = -1;
    let showed = document.querySelectorAll(this.selector + ' ' + '.show');
    this.page.classList.remove('show');
    for(let i = showed.length - 1; i >= 0; i--) {
      showed[i].classList.remove('.show');
    }
  }
  // nextHandler() {
  //   if(this.slide_name == 'product' && this.stage < 2) {
  //     this.stage++;
  //     this.setPage();
  //   }
  //   else {
  //     this.stage = -1;
  //     if(this.slide.nextSibling == null) {
  //       document.dispatchEvent(new CustomEvent('change_page', {detail: '#xana'}));
  //     }
  //     this.slide = this.slide.nextSibling;
  //     this.slide_name = this.slide.getAttribute('data-slide');
  //     let anchor = this.selector + '-' + this.slide_name;
  //     document.dispatchEvent(new CustomEvent('change_page', {detail: anchor}));
  //   }
  // }
  paginationItemsHandler(event) {
    event.preventDefault();
    if(event.target.classList.contains('active')) {
      return false;
    }
    let anchor = event.target.getAttribute('href');
console.log('paginationItemsHandler', event.target, anchor)
    document.dispatchEvent(new CustomEvent('change_page', {detail: anchor}));
  }
  setPaginationItem() {
    let active = this.selector;
    if(this.slide_name && this.slide_name !== 'product') {
      active += '-' + this.slide_name;
    }
    for(let i = this.pagination_items_length - 1; i >= 0; i--) {
      this.pagination_items[i].classList.remove('active');
      if(this.pagination_items[i].getAttribute('href') == active) {
        this.pagination_items[i].classList.add('active');
      }
    }
  }
  product() {
console.log('product',this.stage)
    let product = document.querySelector('.step.product');
    // let title = document.querySelector('.step.product .title');
    // let subtitle = document.querySelector('.step.product .subtitle');
    // let text = document.querySelector('.step.product .text');
    // let images = document.querySelector('.step.product .illustrations');
    // let image_1 = document.querySelector('.step.product .illustration.slide-1');
    // let image_2 = document.querySelector('.step.product .illustration.slide-2');
    // let image_3 = document.querySelector('.step.product .illustration.slide-3');
    switch(this.stage) {
      case -1:
        // this.pagination.classList.remove('show');
        product.classList.remove('show');
        product.classList.remove('stage-0', 'stage-1', 'stage-2');
        break;
      case 1:
        product.classList.remove('stage-0');
        product.classList.add('show', 'stage-1');
// console.log('this.stage',this.stage)
//         title.classList.add('show');
//         image_1.classList.remove('show');
//         image_2.classList.add('show');
        break;
      case 2:
        product.classList.remove('stage-1');
        product.classList.add('show', 'stage-2');
        this.pagination.classList.add('show');
        // title.classList.remove('show');
        // image_2.classList.remove('show');
        // setTimeout(
        //   function() {
        //     image_3.classList.add('show');
        //     images.classList.add('full');
        //   }
        //   , 500
        // );
        // setTimeout(
        //   function() {
        //     subtitle.classList.add('show');
        //     text.classList.add('show');
        //   }
        //   , 1000
        // );
        break;
      default:
        product.classList.add('show', 'stage-0');
        // title.classList.add('show');
        // setTimeout(
        //   function() {
        //     image_1.classList.add('show');
        //     images.classList.add('show');
        //   }
        //   , 500
        // );
        break;
    }
  }
  router() {
console.log('router')
    let router = document.querySelector('.step.router');
    router.classList.add('show');
    this.pagination.classList.add('show');
  }
  steady() {
console.log('steady')
    let steady = document.querySelector('.step.steady');
    steady.classList.add('show');
    this.pagination.classList.add('show');
  }
  open() {
console.log('open')
    let open = document.querySelector('.step.open');
    open.classList.add('show');
    this.pagination.classList.add('show');
  }
  design() {
console.log('design')
    let design = document.querySelector('.step.design');
    design.classList.add('show');
    this.pagination.classList.add('show');
  }
  tech() {
console.log('tech')
    let tech = document.querySelector('.step.tech');
    tech.classList.add('show');
    this.pagination.classList.add('show');
  }
}
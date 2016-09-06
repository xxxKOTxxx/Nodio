/* Router module */
let config = require('../configurations/router');
let Menu = require('menu');
let Pagination = require('pagination');
let History = require('history');
let Resize = require('resize');
let GeminiScrollbar = require('lib/gemini-scrollbar.js');
module.exports = class Router {
  constructor() {
    this.config = config;
    this.default_page = config.default.page;
    this.default_slide = config.default.slide;
    this.page_fade_time = config.page_fade_time;
    this.active = null;
    this.menu_value = null;

    this.resize = new Resize();

    this.menu = new Menu();
    this.menu_visible = false;

    this.history = new History();

    this.glow = document.querySelector('#glow');

    this.pages = document.querySelectorAll('.page');
    this.pages_length = this.pages.length;

    this.body = document.querySelector('body');
    this.scrollbar = new GeminiScrollbar({element: this.body}).create();

    this.slide = this.default_slide;
    this.product = document.querySelector('#product');
    this.pagination = new Pagination();

    document.addEventListener('change_page', this.changePage.bind(this));

    let event_detail = {
      detail: {
        page: window.location.hash,
        source: 'init'
      }
    };
    document.dispatchEvent(new CustomEvent('change_page', event_detail));
  }

  checkPage(page) {
    if(!page || page == '/' || !document.querySelector(page)) {
      this.slide = this.default_slide;
      return this.default_page;
    }
    return page;
  }

  setPage() {
    this.history.setState(this.active);
    let event_detail = {
      detail: {
        page: this.active,
        slide: this.slide
      }
    };
    document.dispatchEvent(new CustomEvent('set_navigation', event_detail));
    document.querySelector(this.active).classList.add('show');
    this.scrollbar.update();
  }

  hidePages() {
    for(let i = this.pages_length - 1; i >= 0; i--) {
      this.pages[i].classList.remove('show');
    }
  }

  changePage(event) {
    let page = event.detail.page;
console.log('changePage', page, this.active)
    if(this.active == page) {
      return false;
    }
    if(page == '#product-router') {
      if(event.detail.source == 'next') {
        this.setSlide();
        return false;
      }
    }
    if(page == '#product' || !page) {
      if(event.detail.source == 'menu' || event.detail.source == 'init' || event.detail.source == 'history') {
        this.active = this.default_page;
        this.setSlide(this.default_slide);
      }
    }
    else {
      this.glow.classList.add('show');
console.log('changePage glow show')
    }

    this.active = this.checkPage(page);
    this.hidePages();

    if(!this.menu_visible) {
      this.menu_visible = true;
      document.dispatchEvent(new CustomEvent('show_menu'));
    }

    this.menu_value = page.split('-')[0];
    if(this.menu.getCurrent() !== this.menu_value) {
      document.dispatchEvent(new CustomEvent('unset_menu'));
    }

    setTimeout(this.setPage.bind(this), this.page_fade_time);
  }

  setSlide(slide = false) {
console.log('setSlide',slide)
    if(!slide) {
      this.slide++;
      slide = this.slide;
    }
    else {
      this.slide = slide;
    }
    if(slide > 2) {
      this.slide = 2;
      let page = '#' + document.querySelector('.page.show').nextSibling.id;
      this.glow.classList.add('show');
console.log('setSlide glow show')
      let event_detail = {
        detail: {
          page: page,
          source: 'slide'
        }
      };
      document.dispatchEvent(new CustomEvent('change_page', event_detail));
      return false;
    }
    this.product.classList.remove('slide-1','slide-2');
    this.product.classList.add('slide-'+this.slide);
    this.glow.classList.remove('show');
console.log('setSlide glow hide')
    let event_detail = {
      detail: {
        page: this.active,
        slide: this.slide
      }
    };
    document.dispatchEvent(new CustomEvent('set_navigation', event_detail));
  }
}
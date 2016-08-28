/* Router module */
let config = require('../configurations/router');
// let Product = require('../pages/product');
// let Xana = require('../pages/xana');
// let Apps = require('../pages/apps');
// let Team = require('../pages/team');
// let Contacts = require('../pages/contacts');
let GeminiScrollbar = require('lib/gemini-scrollbar.js');
module.exports = class Router {
  constructor() {
    this.title = 'Nodio'
    this.config = config;
    this.active = null;
    this.states = [];
    this.state = 0
    this.page_fade_time = config.page_fade_time;

    this.cell_width = 30;
    // this.audio_block = document.querySelector('#audio-block');
    this.next = document.querySelector('#next');
    // this.faq = document.querySelector('#faq');
    // this.pagination = document.querySelector('#pagination');
    this.content = document.querySelector('.content');
    this.sidebar = document.querySelector('#sidebar');
    this.pages = document.querySelectorAll('.page');
    this.pages_length = this.pages.length;

    this.scrollbar = new GeminiScrollbar(
      {
        element: document.querySelector('body')
      }
    ).create();
    
    // this.video = true;
    // this.product = new Product();
    // this.xana = new Xana();
    // this.apps = new Apps();
    // this.team = new Team();
    // this.contacts = new Contacts();

    this.next.addEventListener('click', this.nextHandler.bind(this));
    window.addEventListener('resize', this.resizeHandler.bind(this));
    window.addEventListener('popstate', this.popstateHandler.bind(this));
    document.addEventListener('change_page', this.changePage.bind(this));
    let anchor = window.location.hash;
    document.dispatchEvent(new CustomEvent('change_page', {detail: anchor}));
    this.resizeHandler();
  }
  nextHandler() {
    let active = '#' + document.querySelector('.page.show').nextSibling.id;
    console.log('nextHandler',active)
    document.dispatchEvent(new CustomEvent('change_page', {detail: active}));
  }
  getAnchorData(anchor) {
    let anchor_array = anchor.split('-');
    this.page = anchor_array[0] || this.config.default.page;
    this.step = anchor_array[1] || this.config.default.step;
    if(!this[this.page.substr(1)]) {
      this.page = config.default.page;
      this.step = config.default.step;
    }
  }
  getStateData() {
    let state = {};
    state.data = {
      page: this.page,
      step: this.step,
    }
    state.title = this.title;
    let item = document.querySelector(this.page);
    let subtitle = false;
    if(item) {
      subtitle = item.getAttribute('data-title');
    }
    if(this.page == '#video') {
      subtitle = this.step.charAt(0).toUpperCase() + this.step.slice(1);
    }

    if(subtitle) {
      state.title += ' - ' + subtitle;
    }
    state.url = window.location.origin + this.page;
    if(this.step) {
      state.url += '-' + this.step;
    }
    return state;
  }
  popstateHandler(event) {
    console.log('popstateHandler', event)
    if(this.states !== event.state) {
      this.page = event.state.page;
      this.step = event.state.step;
      this.setPage(true);
    }
  }
  setPage(replace) {
    this.active = this.page;
    let state = this.getStateData();
    this.states[this.states.length] = state.data;
    if(history && history.pushState) {
      if(history.state == null || replace) {
        history.replaceState(state.data, state.title, state.url);
      }
      else {
        history.pushState(state.data, state.title, state.url);
      }
    }
    document.title = state.title;
console.log('setPage',state.data)
    document.dispatchEvent(new CustomEvent('set_menu', {detail: state.data}));
    document.dispatchEvent(new CustomEvent('set_page', {detail: state.data}));
    this.scrollbar.update();
  }
  changePage(event) {
    let anchor = event.detail;
console.log('changePage',anchor)
    this.getAnchorData(anchor);
    document.dispatchEvent(new CustomEvent('hide_page'));
    document.dispatchEvent(new CustomEvent('set_menu', {detail: {page: false}}));
    document.dispatchEvent(new CustomEvent('show_menu'));
    setTimeout(this.setPage.bind(this), this.page_fade_time);
  }
  resizeHandler() {
    let window_width = window.innerWidth;
    let sidebar_width = this.sidebar.clientWidth;
    let space_width = window_width - sidebar_width;
    let content_width = Math.floor(space_width / (this.cell_width * 2) - 1) * this.cell_width * 2;
    let rigth_padding = space_width - content_width;
    let window_height = window.innerHeight;
    let padding_top = 95;
    let space_height = window_height - padding_top;
    let content_height = Math.floor(space_height / (this.cell_width * 2)) * this.cell_width * 2;
    let bottom_padding = space_height - content_height;
// console.log('window_width',window_width)
// console.log('sidebar_width',sidebar_width)
// console.log('content_width',content_width)
// console.log('rigth_padding',rigth_padding)
// console.log('window_height',window_height,Math.floor(window_height / this.cell_width * 2))
    for(let i = this.pages_length - 1; i >= 0; i--) {
      this.pages[i].style.width = content_width + 'px';
      // this.pages[i].style.height = content_height + 'px';
    }
    this.content.style.paddingRight = rigth_padding + 'px';
    // this.audio_block.style.right = rigth_padding + 'px';
    // this.faq.style.right = rigth_padding + 'px';
    // this.pagination.style.right = rigth_padding + 'px';
    // this.faq.style.bottom = bottom_padding + 'px';
  }
}
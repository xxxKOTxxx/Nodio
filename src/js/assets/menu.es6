/* Menu module */
let print_config = require('../configurations/print');
let printString = require('../utilities/print_string');
module.exports = class Menu {
  constructor() {
    this.printString = printString;
    this.print_config = print_config;
    this.timeout = 500;
    this.active = null;
    this.printing = null;
    this.logo_printing = null;
    this.sidebar = document.querySelector('#sidebar');
    this.logo = document.querySelector('.logo');
    this.logo_text = document.querySelector('.logo-text');
    this.elements = document.querySelectorAll('.menu-element');
    this.elements_length = this.elements.length;
    this.links = document.querySelectorAll('.menu-link');
    this.links_length = this.links.length;
    
    this.logo.addEventListener('mouseenter', this.logoMouseenterHandler.bind(this), false);
    this.logo.addEventListener('mouseleave', this.logoMouseleaveHandler.bind(this), false);
    for (var i = this.links_length - 1; i >= 0; i--) {
      this.links[i].addEventListener('click', this.selectItemHandler.bind(this), false);
      this.links[i].addEventListener('mouseenter', this.mouseenterHandler.bind(this), false);
      this.links[i].addEventListener('mouseleave', this.mouseleaveHandler.bind(this), false);
    }

    document.addEventListener('set_menu', this.selectItemAction.bind(this));
    document.addEventListener('show_menu', this.showMenu.bind(this));
  }
  showMenu(event) {
    this.sidebar.classList.add('show');
    for(let i = this.elements_length - 1; i >= 0; i--) {
      (function(index, timeout, elements, showItem) {
        setTimeout(() => {showItem(elements[index])}, timeout * index);
      })(this.elements_length - 1 - i, this.timeout, this.elements, this.showItem);
    }
  }
  showItem(item) {
    item.classList.add('blink', 'show');
  }
  selectItemHandler(event) {
    event.preventDefault();
    let active = event.target.closest('.menu-link').getAttribute('href');
console.log('selectItemHandler',active)
    if(this.active !== active) {
      document.dispatchEvent(new CustomEvent('change_page', {detail: active}));
    }
  }
  selectItemAction(event) {
    let active = event.detail.page;
    if(active == '#video') {
      active += '-' + event.detail.step;
    }
console.log('selectItemAction',active)
    this.selectItem(active);
  }
  selectItem(active) {
    this.active = active;
    for(let i = this.links_length - 1; i >= 0; i--) {
      let href = this.links[i].getAttribute('href');
      this.links[i].classList.remove('active');
      if(active == href) {     
        this.links[i].classList.add('active');
      }
    }
  }
  mouseenterHandler(event) {
    if(!this.printing) {
      let target = event.target;
      let text = target.getAttribute('data-text');
      if(text) {
        let options = this.print_config.printer_settings.header_string;
        this.printing = document.createElement('span')
        target.appendChild(this.printing);
        this.printString(this.printing, text, options);
      }
    }
  }
  mouseleaveHandler() {
    if(this.printing) {
      this.printing.remove();
      this.printing = null;
    }
  }
  logoMouseenterHandler(event) {
    if(!this.logo_printing) {
      let text = this.logo_text.getAttribute('data-text');
      if(text) {
        let options = this.print_config.printer_settings.header_string;
        this.logo_printing = document.createElement('span')
        this.logo_text.appendChild(this.logo_printing);
        this.printString(this.logo_printing, text, options);
      }
    }
  }
  logoMouseleaveHandler() {
    this.logo_printing.remove();
    this.logo_printing = null;
  }
}
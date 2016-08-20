/* Menu module */
let print_config = require('../configurations/print');
let printString = require('../utilities/print_string');
module.exports = class Menu {
  constructor() {
    this.printString = printString;
    this.print_config = print_config;
    this.logo = false;
    this.active = null;
    this.items = querySelectorAll('.menu-link');
    this.items_length = items.length;
    for (var i = this.items_length - 1; i >= 0; i--) {
      this.items[i].addEventListener('click', this.selectItem.bind(this), false);
      this.items[i].addEventListener('mouseenter', this.mouseenterHandler.bind(this), false);
      this.items[i].addEventListener('mouseleave', this.mouseleaveHandler.bind(this), false);
    }
    document.addEventListener('set_menu', this.selectItem.bind(this));
  }
  show() {
    
  }
  selectItem(event) {
    let active = event.target.closest('.menu-link').getAttribute('href');
    if(this.active !== active) {
      this.active = active;
      for (var i = this.items_length - 1; i >= 0; i--) {
        let href = this.items[i].getAttribute('href');
        this.items[i].classList.remove('active');
        if(active == href) {     
          this.items[i].classList.add('active');
          this.hidePage();
        }
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
    this.printing.remove();
    this.printing = null;
  }
}
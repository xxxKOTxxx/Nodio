/* Set page module */
// let config = require('configurations/page');
let print_config = require('../configurations/print');
let printString = require('../utilities/print_string');
module.exports = class SetPage {
  constructor(video) {
    this.printString = printString;
    this.print_config = print_config;
    this.printing = null;
    this.video = video;
    this.video.hide();
    this.background = document.querySelector('.background');
    this.lines = document.querySelectorAll('.line');
    this.lines_length = this.lines.length;
    this.sidebar = document.querySelector('.sidebar');

    this.background.classList.add('show');
    this.sidebar.classList.add('show');

    this.menu_links = document.querySelectorAll('.menu-link');
    this.menu_links_length = this.menu_links.length;
    this.current_menu_item = null;

    for (var i = this.menu_links_length - 1; i >= 0; i--) {
      this.menu_links[i].addEventListener('click', this.selectMenuItem.bind(this), false);
      this.menu_links[i].addEventListener('mouseenter', this.hoverItem.bind(this), false);
      this.menu_links[i].addEventListener('mouseleave', this.unhoverItem.bind(this), false);
      if(i == 0) {
        let event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.menu_links[i].dispatchEvent(event);
      }
    }
  }
  selectMenuItem(event) {
    let active = event.target.closest('.menu-link').getAttribute('href');
    if(this.current_menu_item !== active) {
      this.current_menu_item = active;
      for (var i = this.menu_links_length - 1; i >= 0; i--) {
        let href = this.menu_links[i].getAttribute('href');
        this.menu_links[i].classList.remove('active');
        if(active == href) {     
          this.menu_links[i].classList.add('active');
        }
      }
    }
  }
  hoverItem(event) {
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
  unhoverItem() {
    this.printing.remove();
    this.printing = null;
  }
};
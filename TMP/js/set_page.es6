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
    this.body = document.querySelector('body');
    this.body.classList.remove('preloader-mode');
    this.content = document.querySelector('.content');
    this.background = document.querySelector('.background');
    this.lines = document.querySelectorAll('.background .line');
    this.line_bottom = document.querySelector('.background .line.bottom');
    this.lines_length = this.lines.length;
    this.sidebar = document.querySelector('#sidebar');
    this.pages = document.querySelectorAll('.page');
    this.pages_length = this.pages.length;
    this.persons = document.querySelectorAll('.person');
    this.persons_length = this.persons.length;

    this.background.classList.add('show');
    this.sidebar.classList.add('show');

    for(var i = this.lines_length - 1; i >= 0; i--) {
      this.lines[i].classList.add('show');
    }

    this.menu_links = document.querySelectorAll('.menu-link');
    this.menu_links_length = this.menu_links.length;
    this.current_menu_item = null;

    for (var i = this.menu_links_length - 1; i >= 0; i--) {
      this.menu_links[i].addEventListener('click', this.selectMenuItem.bind(this), false);
      this.menu_links[i].addEventListener('mouseenter', this.hoverItem.bind(this), false);
      this.menu_links[i].addEventListener('mouseleave', this.unhoverItem.bind(this), false);
      if(i == 2) {
        let event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.menu_links[i].dispatchEvent(event);
      }
    }
    this.cell_width = 30;
    this.content_width = 0;
    this.content_height = 0;
    this.resizeContent();
    window.addEventListener('resize', this.resizeContent.bind(this), false);
  }
  getContentWidth() {
    let cell_padding = 2;
    let window_width = window.innerWidth;
    let sidebar_width = this.sidebar.getBoundingClientRect().width;
    let content_padding_left = cell_padding * this.cell_width + sidebar_width;
    let space = window_width - content_padding_left;
    this.content_width = Math.floor(space / (cell_padding * this.cell_width)) * (cell_padding * this.cell_width) - (this.cell_width * 2);
    for(var i = this.lines_length - 1; i >= 0; i--) {
      this.lines[i].style.width = this.content_width + 'px';
    }
  }
  getContentheight() {
    // console.log('this.content.offsetHeight',this.content.offsetHeight)
  }
  resizeContent() {
    this.getContentWidth();
    this[this.current_menu_item.substring(1)]();
    this.getContentheight();
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
          this.hidePage();
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
  hidePage() {
    console.log('hide')
    let active_page = document.querySelector('.page.show');
    if(!active_page) {
      this.showPage();
      return
    }
    active_page.style.opacity = 0;
    setTimeout(this.showPage.bind(this), 600);
  }
  showPage() {
    console.log('show')
    for(var i = this.pages_length - 1; i >= 0; i--) {
      this.pages[i].classList.remove('show');
      if(this.pages[i]) {
        this.pages[i].style.opacity = 1;
      }
    }
    let active_page = document.querySelector(this.current_menu_item);
    if(active_page){
      active_page.classList.add('show');
      this[this.current_menu_item.substring(1)]();
    }
  }
  problem() {
  }
  vision() {
  }
  product() {
  }
  apps() {
    let apps = document.querySelector('#apps');
    this.content.style.height = apps.offsetHeight + 'px';
    this.setBottomLine(133);
  }
  team() {
    let cells = this.content_width / this.cell_width;
    let item_cell_width = 4;
    let top_cell_offset = 8;
    let top_cell_padding = 2;
    let row_cell_height = 7;
    let left_cell_padding = 2;
    let left_row_padding = true;
    let top = top_cell_offset + top_cell_padding;
    let left = left_cell_padding - item_cell_width;
    let start_odd = true;
    let odd = start_odd;
    let odd_row = true;
    for(let i = this.persons_length; i > 0; i--) {
      let index = this.persons_length - i;
      left += item_cell_width
      if(left + item_cell_width > cells) {
        odd_row = !odd_row;
        odd = start_odd;
        top += row_cell_height;
        left = left_cell_padding;
        if(!odd_row) {
          left++
        }
      }
      let top_position = top;
      if(!odd) {
        top_position += top_cell_padding;
      }
      odd = !odd;
      this.persons[index].style.top = top_position * this.cell_width + 'px';
      this.persons[index].style.left = left* this.cell_width + 'px';

      if(i == 1) {
        this.content.style.height = (row_cell_height + top_cell_padding + top_position) * this.cell_width + 'px';
        this.setBottomLine();
      }
    }
  }
  setBottomLine(offset = 0) {
    let height = this.content.offsetHeight;
    let bottom = height % (this.cell_width * 2) + (this.cell_width * 2);
console.log('offset',offset)
    this.line_bottom.style.bottom = bottom + offset + 'px';
  }
};
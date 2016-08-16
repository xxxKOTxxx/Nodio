/* Set menu module */
// let config = require('configurations/menu');
module.exports = class setMenu {
  constructor(selector) {
    // this.config = config;
    this.menu_links = document.querySelectorAll('.menu-link');
    this.menu_links_length = this.menu_links.length;
    for (var i = this.menu_links_length - 1; i >= 0; i--) {
      this.menu_links[i].addEventListener('click', selectMenuItem, false);
      this.menu_links[i].addEventListener('mouseenter', hoverItem, false);
      this.menu_links[i].addEventListener('mouseleave', unhoverItem, false);
      if(i == 0) {
        let event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.menu_links[i].dispatchEvent(event);
      }
    }
  }
  selectMenuItem(event) {
    let active = event.target.getAttribute('href');
    for (var i = this.menu_links_length - 1; i >= 0; i--) {
      let href = this.menu_links[i].getAttribute('href');
console.log('selectMenuItem', href)
      this.menu_links[i].classList.remove('active');
      if(active == href) {     
        this.menu_links[i].classList.add('active');
      }
    }
  }
  hoverItem(event) {
    let href = event.target.getAttribute('href');
console.log('hoverItem', href)
  }
  unhoverItem() {
    let href = event.target.getAttribute('href');
console.log('hoverItem', href)
  }
};
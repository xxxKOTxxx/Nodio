/* Next module */
module.exports = class Next {
  constructor() {
    this.next_links = document.querySelectorAll('.next-link');
    this.next_links_length = this.next_links.length;
    for(let i = this.next_links_length - 1; i >= 0; i--) {
      this.next_links[i].addEventListener('click', ()=> {this.pageHandler(true);});
    }
    document.addEventListener('change_page_key', this.keyHandler.bind(this));
    this.setMousewheelHandler();
  }
  pageHandler(direction = true) {
    let current = document.querySelector('.page.show');
    if(!current) {
      return false;
    }
    let next = false;
    if(current.id == 'product') {
      if(!direction) {
        return false;
      }
      next = current;
    }
    else {
      if(direction) {
        next = current.nextSibling;
      }
      else {
        next = current.previousSibling;
      }
    }
    if(next) {
      let page = '#' + next.id;
      let event_detail = {
        detail: {
          page: page,
          source: 'next'
        }
      };
      document.dispatchEvent(new CustomEvent('change_page', event_detail));
    }
  }
  setMousewheelHandler() {
    if(document.addEventListener) {
      if('onwheel' in document) {
        // IE9+, FF17+, Ch31+
        document.addEventListener("wheel", this.mousewheelHandler.bind(this));
      }
      else if('onmousewheel' in document) {
        // устаревший вариант события
        document.addEventListener("mousewheel", this.mousewheelHandler.bind(this));
      }
      else {
        // Firefox < 17
        document.addEventListener("MozMousePixelScroll", this.mousewheelHandler.bind(this));
      }
    }
    else { // IE8-
      document.attachEvent("onmousewheel", this.mousewheelHandler.bind(this));
    }
  }
  mousewheelHandler(event) {
    let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    this.switchHandler(delta);
  }
  keyHandler(event) {
    let direction = event.detail.direction;
    this.switchHandler(direction);
  }
  switchHandler(direction) {
    let modal = document.querySelector('#modal.show');
    let current = document.querySelector('.page.show');
    if(modal || !current) {
      return false;
    }
    let next_link = document.querySelector('.page.show .next-link');
    if(next_link) {
      let next_link_style = next_link.currentStyle || window.getComputedStyle(next_link, false);
      let opacity = next_link_style.opacity;
      if(opacity < 1) {
        return false;
      }
    }
    if(direction > 0) {
      let scroll = document.querySelector('body > .gm-scroll-view');
      let scrollTop = scroll.scrollTop;
      if(scrollTop === 0) {
        this.pageHandler(false);
      }
    }
    if(direction < 0) {
      let scroll = document.querySelector('body > .gm-scroll-view');
      let scrollTop = scroll.scrollTop;
      let scrollHeight = scroll.scrollHeight;
      let offsetHeight  = scroll.offsetHeight ;
      if(scrollTop + offsetHeight === scrollHeight) {
        this.pageHandler();
      }
    }
  }
}
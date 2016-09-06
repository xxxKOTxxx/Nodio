/* Next module */
module.exports = class Next {
  constructor() {
    this.next_links = document.querySelectorAll('.next-link');
    this.next_links_length = this.next_links.length;
    for(let i = this.next_links_length - 1; i >= 0; i--) {
      this.next_links[i].addEventListener('click', this.nextHandler.bind(this));
    }
    this.setMousewheelHandler();
    // this.next.addEventListener('click', this.nextHandler.bind(this));
    // document.addEventListener('set_navigation', this.setNext.bind(this));
  }
  // showNext() {
  //   this.next.classList.add('show');
  // }
  // hideNext() {
  //   this.next.classList.remove('show');
  // }
  // setNext(event) {
  //   let page = event.detail.page;
  //   if(page == '#contacts') {
  //     this.hideNext();
  //   }
  //   else {
  //     this.showNext();
  //   }
  // }
  nextHandler(current = false) {
    if(!current) {
      current = document.querySelector('.page.show');
    }
    let next = current.nextSibling;
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
    let modal = document.querySelector('#modal.show');
    let current = document.querySelector('.page.show');
    let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if(delta < 0 && current && !modal) {
      let scroll = document.querySelector('body > .gm-scroll-view');
      let scrollTop = scroll.scrollTop;
      let scrollHeight = scroll.scrollHeight;
      let offsetHeight  = scroll.offsetHeight ;
      if (scrollTop + offsetHeight === scrollHeight) {
        this.nextHandler(current);
      }
    }
  }
}
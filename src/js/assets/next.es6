/* Next module */
module.exports = class Next {
  constructor() {
    this.next = document.querySelector('#next');
    this.next.addEventListener('click', this.nextHandler.bind(this));
    document.addEventListener('set_navigation', this.setNext.bind(this));
  }
  showNext() {
    this.next.classList.add('show');
  }
  hideNext() {
    this.next.classList.remove('show');
  }
  setNext(event) {
    let page = event.detail.page;
    if(page == '#contacts') {
      this.hideNext();
    }
    else {
      this.showNext();
    }
  }
  nextHandler() {
  let current = document.querySelector('.page.show');
    let page = '#' + current.nextSibling.id;
    let event_detail = {
      detail: {
        page: page,
        source: 'next'
      }
    };
    document.dispatchEvent(new CustomEvent('change_page', event_detail));
  }
}
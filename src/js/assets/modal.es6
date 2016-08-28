/* Modal module */
let GeminiScrollbar = require('lib/gemini-scrollbar.js');
module.exports = class Modal {
  constructor() {
    this.modal = document.querySelector('#modal');
    this.close = document.querySelector('#modal-close');
    this.close_links = document.querySelectorAll('.close-modal');
    this.close_links_length = this.close_links.length;
    this.links = document.querySelectorAll('.modal-link');
    this.links_length = this.links.length;
    this.modals = document.querySelectorAll('.modal');
    this.modals_length = this.links.length;
    this.Scroll = GeminiScrollbar;
    for(let i = this.links_length - 1; i >= 0; i--) {
      this.links[i].addEventListener('click', this.setModal.bind(this), false);
    }
    for(let i = this.close_links_length - 1; i >= 0; i--) {
      this.close_links[i].addEventListener('click', this.closeModal.bind(this), false);
    }
    this.close.addEventListener('click', this.closeModal.bind(this), false);
  }
  setModal(event) {
    event.preventDefault();
    let active = event.target.getAttribute('href').substr(1);
    let modal = null;
    for(let i = this.modals_length - 1; i >= 0; i--) {
      if(this.modals[i].id == active) {
        this.modals[i].classList.add('show');
        modal = this.modals[i];
      }
      else {
        this.modals[i].classList.remove('show');
      }
    }
    this.modal.classList.add('show');
    this.scroll = new this.Scroll(
      {
        element: modal.querySelector('.modal-content')
      }
    ).create();
  }
  closeModal() {
    this.modal.classList.remove('show');
    this.scroll.destroy();
  }
}
/* Resize module */
module.exports = class Router {
  constructor() {
    window.addEventListener('resize', this.resizeHandler.bind(this));
    this.resizeHandler();
  }
  resizeHandler() {
    let window_width = window.innerWidth;
    let sidebar_width = this.sidebar.clientWidth;
    let space_width = window_width - sidebar_width;
    let content_width = Math.floor(space_width / (this.cell_width * 2) - 1) * this.cell_width * 2;
    let rigth_padding = space_width - content_width;
    for(let i = this.pages_length - 1; i >= 0; i--) {
      this.pages[i].style.width = content_width + 'px';
      // this.pages[i].style.height = content_height + 'px';
    }
    this.audio_block.style.right = rigth_padding + 'px';
    this.faq.style.right = rigth_padding + 'px';
    this.pagination.style.right = rigth_padding + 'px';
    let data = {
      content_width: content_width,
      rigth_padding: rigth_padding
    }
    document.dispatchEvent(new CustomEvent('resize', {detail: data}));
  }
}
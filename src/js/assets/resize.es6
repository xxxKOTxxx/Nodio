/* Resize module */
module.exports = class Router {
  constructor() {
    this.cell_size = 60;
    this.left_delta = 1;
    this.content = document.querySelector('.content');
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler.bind(this));
  }
  resizeHandler() {
    let window_width = window.innerWidth;
    let window_cells = Math.floor(window_width / this.cell_size);
    let content_width = this.content.clientWidth;
    let content_style = window.getComputedStyle ? getComputedStyle(this.content, null) : this.content.currentStyle;

    let content_left = parseInt(content_style.paddingLeft) || 0;
    let content_right = parseInt(content_style.paddingRight) || 0;
    let content_inner_width = content_width - content_left - content_right;
    let content_cells = Math.floor(content_inner_width / this.cell_size);
    let free_cells = window_cells - content_cells;
// console.log('window_width', window_width, window_cells)
// console.log('content', content_left, content_inner_width, content_right)
// console.log('content_cells', content_cells)
    let left = 2;
    let right = 1;
    // free_cells = Math.floor((free_cells - left - right) / 2);
    free_cells = free_cells - left - right;
console.log('free_cells1', free_cells)
    if(free_cells > 0) {
      right = 2;
      free_cells--;
    }
console.log('free_cells2', free_cells)
    free_cells = Math.floor(free_cells / 2);
    for(let i = free_cells - 1; i >= 0; i--) {
      left++;
      right++;
    }
    left = (left * this.cell_size) - this.left_delta + 'px';
    right = (right * this.cell_size) + 'px';
console.log('left',left)
console.log('right',right)
    if(left !== content_left) {
      this.content.style.paddingLeft = left;
    }
    if(right !== content_right) {
      this.content.style.paddingRight = right;
    }
  }
}
    // let sidebar_width = this.sidebar.clientWidth;
    // let space_width = window_width - sidebar_width;
    // let content_width = Math.floor(space_width / (this.cell_width * 2) - 1) * this.cell_width * 2;
    // let rigth_padding = space_width - content_width;
    // for(let i = this.pages_length - 1; i >= 0; i--) {
    //   this.pages[i].style.width = content_width + 'px';
    //   // this.pages[i].style.height = content_height + 'px';
    // }
    // this.audio_block.style.right = rigth_padding + 'px';
    // this.faq.style.right = rigth_padding + 'px';
    // this.pagination.style.right = rigth_padding + 'px';
    // let data = {
    //   content_width: content_width,
    //   rigth_padding: rigth_padding
    // }
    // document.dispatchEvent(new CustomEvent('resize', {detail: data}));
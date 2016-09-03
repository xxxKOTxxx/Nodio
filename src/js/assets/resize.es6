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
    this.widthHandler();
    this.heightHandler();
  }
  heightHandler() {
    let window_height = window.innerHeight;
    let content_height = this.content.clientHeight;
    let height = Math.max(window_height, content_height);
    let space = height % this.cell_size + 'px';
    this.content.style.paddingBottom = space;
console.log('window_height',window_height)
console.log('content_height',content_height)
console.log('height',height)
console.log('space',space)
  }
  widthHandler() {
    let window_width = window.innerWidth;
    let window_cells = Math.floor(window_width / this.cell_size);
    let content_width = this.content.clientWidth;
    let content_style = window.getComputedStyle ? getComputedStyle(this.content, null) : this.content.currentStyle;

    let content_left = parseInt(content_style.paddingLeft) || 0;
    let content_right = parseInt(content_style.paddingRight) || 0;
    let content_inner_width = content_width - content_left - content_right;
    let content_cells = Math.floor(content_inner_width / this.cell_size);
    let free_cells = window_cells - content_cells;
    let left = 2;
    let right = 1;
    free_cells = free_cells - left - right;
    if(free_cells > 0) {
      right = 2;
      free_cells--;
    }
    free_cells = Math.floor(free_cells / 2);
    for(let i = free_cells - 1; i >= 0; i--) {
      left++;
      right++;
    }
    left = (left * this.cell_size) - this.left_delta + 'px';
    right = (right * this.cell_size) + 'px';
    if(left !== content_left) {
      this.content.style.paddingLeft = left;
    }
    if(right !== content_right) {
      this.content.style.paddingRight = right;
    }
  }
}
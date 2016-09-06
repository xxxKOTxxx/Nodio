/* Resize module */
module.exports = class Router {
  constructor() {
    this.cell_size = 60;
    this.left_delta = 1;
    this.container = document.querySelector('.container');
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler.bind(this));
  }
  resizeHandler() {
    this.widthHandler();
    // this.heightHandler();
  }
  heightHandler() {
    let window_height = window.innerHeight;
    let container_height = this.container.clientHeight;
    let bottom = '0px';
    if(window_height > container_height) {
      bottom = window_height % this.cell_size + 'px';
    }
    this.container.style.paddingBottom = bottom;
console.log('window_height',window_height)
console.log('container_height',container_height)
console.log('bottom',bottom)
  }
  widthHandler() {
    let window_width = window.innerWidth;
    let window_cells = Math.floor(window_width / this.cell_size);
    let container_width = this.container.clientWidth;
    let container_style = window.getComputedStyle ? getComputedStyle(this.container, null) : this.container.currentStyle;

    let container_left = parseInt(container_style.paddingLeft) || 0;
    let container_right = parseInt(container_style.paddingRight) || 0;
    let container_inner_width = container_width - container_left - container_right;
    let container_cells = Math.floor(container_inner_width / this.cell_size);
    let free_cells = window_cells - container_cells;
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
    if(left !== container_left) {
      this.container.style.paddingLeft = left;
    }
    if(right !== container_right) {
      this.container.style.paddingRight = right;
    }
  }
}
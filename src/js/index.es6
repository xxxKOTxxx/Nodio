require('../stylus/index');

require('utilities/ie_fixes');
(function () {
'use strict';

/*** Animate logo ***/
let initialize = function() {
  let logo_inner = document.querySelector('.logo .inner');
  let logo_middle = document.querySelector('.logo .middle');
  let logo_outer = document.querySelector('.logo .outer');
  let animation_array = [logo_inner, logo_middle, logo_outer];
  let logo_border = document.querySelector('.logo .border');
  let logo_square = document.querySelector('.square');
  let LogoAnimation = require('assets/logo_animation');
  let logoAnimation = new LogoAnimation(animation_array, logo_border, logo_square);
  logoAnimation.animate();

  let header = document.getElementById('header');
  let logo = document.getElementById('logo');
  let HeaderHeight = require('assets/header_height');
  let headerHeight = new HeaderHeight(header, logo);
};
document.addEventListener('DOMContentLoaded', initialize);

/*** Set counter ***/
let counter_config = require('configurations/counter');
let SetCounter = require('assets/set_counter');
let counter_element = document.querySelector(counter_config.selector);
let counter = new SetCounter(counter_element, 'upload_progress', counter_config.options);

/*** Preloader ***/
let Preloader = require('assets/preloader');
let preloader = new Preloader('.print', counter);
preloader.print(1);

/*** Get user data ***/
let UserData = require('assets/user_data');
let userData = new UserData();

/*** Get video url ***/
let VideoUrl = require('assets/video_url');
let videoUrl = new VideoUrl();
let video_url = videoUrl.url;

/*** Upload video ***/
let UploadVideo = require('assets/upload_video');
let uploadVideo = new UploadVideo();
uploadVideo.upload(video_url);

let setVideoSource = function(event) {
  video_source = event.detail;
}
document.addEventListener('video_source', setVideoSource);

/*** Play video ***/
let video_source = null;
let startVideo = function(event) {
  let SetVideo = require('assets/set_video');
  let video = new SetVideo('#video', video_source);
  video.play();
}
document.addEventListener('start_video', startVideo);

// let showLines = function() {
//   let lines = document.querySelectorAll('.line');
//   let lines_length = lines.length;
//   for (var i = lines_length - 1; i >= 0; i--) {
//     lines[i].classList.add('show');
//   }

let startPage = function(event) {
  let video = event.detail;
  let SetPage = require('assets/set_page');
  let setPage = new SetPage(video);

}
document.addEventListener('video_finished', startPage);


})();
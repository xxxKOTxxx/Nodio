require('../stylus/index');

// import 'babel-polyfill';
require('ie_fixes');
(function () {
'use strict';

/*** Get video url ***/
let GetVideoUrl = require('assets/get_video_url');
let getVideoUrl = new GetVideoUrl();
let video_url = getVideoUrl.url;
console.log('video_url', video_url)

/*** Set counter ***/
let counter_config = require('configurations/counter');
let counter_element = document.querySelector(counter_config.selector)
let SetCounter = require('assets/set_counter');
let setCounter = new SetCounter(counter_element, 'upload_progress', counter_config.options);

/*** Upload video ***/
let UploadVideo = require('assets/upload_video');
let uploadVideo = new UploadVideo();
uploadVideo.upload(video_url);



/* Detect user ip module */
let getUserIPs = require('get_ip');
/* Detect user data module */
let getUserData = require('get_user_data');
/* Detect mobile module */
let MobileDetect = require('mobile-detect');
/* Detect OS module */
let getUserOS = require('get_user_os');
/* Detect browser module */
let getUserBrowser = require('get_user_browser');
/* Print module */
let printString = require('print_string');
/* Settings module */
let config = require('config');







let parsed_data = {};
let printer_queue_data = {};

let data_ready = false;

let data_counter = 0;
let printed_symbols = 0;
let statistic_symbols = 0;
let statistics_percent = 0;

let mobile_detect = new MobileDetect(navigator.userAgent);

let check_data = function() {
  data_counter++;
  if(data_counter == 2) {
    data_ready = true;
    document.dispatchEvent(new CustomEvent('data_ready'));
  }
};

/*** Assign user data ***/
let assignUserData = function(data) {
  Object.assign(parsed_data, data);
  check_data();
};

/*** Error handler ***/
let errorHandler = function(error) {
  console.error('Error ',error);
  check_data();
};

/* Get user global and local ip */
getUserIPs().then(assignUserData).catch(errorHandler);

/* Get user global ip, provider and location */
getUserData().then(assignUserData).catch(errorHandler);

/*** Get user device ***/
let getUserDevice = function() {
  let part = navigator.userAgent.split(' Build/');
  let nav_device = part[0].substr(part[0].lastIndexOf(';') + 2);
  if(nav_device.length > 15) {
    nav_device = false;
  }
  return nav_device || mobile_detect.mobile() || 'PC';
};
parsed_data.device = getUserDevice();

/*** Get user operation system ***/
let getUserOperationSystem = function() {
  return getUserOS() || mobile_detect.os();
};
parsed_data.os = getUserOperationSystem();

/*** Get user browser ***/
parsed_data.browser = getUserBrowser();

let setUserData = function() {
  Object.assign(config.user_data, parsed_data);
  if(config.user_data.location !== config.default_data_value) {
    config.user_data.location = config.user_data.location.city + ', ' + config.user_data.location.country;
  }
  if(config.user_data.os !== config.default_data_value) {
    config.user_data.os = config.user_data.os.name + ' ' + config.user_data.os.version;
  }
  if(config.user_data.browser !== config.default_data_value) {
    config.user_data.browser = config.user_data.browser.name + ' ' + config.user_data.browser.full_version;
  }
  getStatistics();
};

let getStatistics = function() {
  let print = document.querySelectorAll('.print.statistics');
  for(let i = print.length - 1; i >= 0; i--) {
    statistic_symbols += print[i].textContent.replace(' ', '').length;
  }
  let user_data_length = Object.keys(config.user_data).reduce(function(sum, key) {
    return sum + config.user_data[key].replace(' ', '').length;
  }, 0);
  statistic_symbols += user_data_length;
  animate();
};

let initialize = function() {
  if(!data_ready) {
    document.addEventListener('data_ready', setUserData);
  }
  else {
    setUserData();
  }
};
document.addEventListener('DOMContentLoaded', initialize);

let getPrinterElements = function() {
  let result = {};
  let printer_elements = document.querySelectorAll('.print');
  if(!printer_elements.length) {
    return result;
  }
  for(let element of printer_elements) {
    if(!result[element.getAttribute('data-print-step')]) {
      result[element.getAttribute('data-print-step')] = [];
    }
    result[element.getAttribute('data-print-step')].push(element);
  }
  return result;
};
let printer_elements = getPrinterElements();

let animate = function() {
  let logo_animation_timeout = 320;
  let body = document.querySelector('body');
  setTimeout(function() {
    body.className = 'ready';
    setHeaderHeigth();
    window.addEventListener('resize', setHeaderHeigth);
  }, logo_animation_timeout);
  printElements(1);
};

let printElements = function(step) {
  for (var i = printer_elements[step].length - 1; i >= 0; i--) {
    let settings = config.printer_settings[printer_elements[step][i].getAttribute('data-print-setting')];
    let string = false;
    if(printer_elements[step][i].getAttribute('data-print-string')) {
      string = config.user_data[printer_elements[step][i].getAttribute('data-print-string')];
    }
    printString(printer_elements[step][i], string, settings, {step: step});
  }
};

let animateStatistic = function(element) {
  // let statistic_interval = setInterval(function(index) {
  //   let current_percent = parseInt(element.textContent);
  //   let inequality = statistics_percent - current_percent;
  //   if(inequality > 0) {
  //     element.textContent = current_percent + 1 + '%';
  //   }
  //   if(current_percent == 100) {
  //     clearInterval(statistic_interval);
  //   }
  // }, config.statistic_animation_time);
};

let setStatistic = function() {
  printed_symbols++;
  let current_percent = Math.round(100 * (printed_symbols / statistic_symbols));
  if(current_percent != statistics_percent) {
    statistics_percent = current_percent;
    // if(!statistic_interval) {
    //   statistic_interval = true;
    //   let statistic = document.querySelector('.percent');
    //   animateStatistic(statistic);
    // }
  }
};

let user_data_block = document.getElementById('user-data-block');
let definitions_list = document.querySelectorAll('.definition');

let setHeaderHeigth = function() {
  let header = document.getElementById('header');
  let header_top = Math.ceil(header.getBoundingClientRect().top);
// console.log('header',header);
// console.log('header_top',header_top);
  let logo   = document.getElementById('logo');
// console.log('logo',logo);
  let logo_top = Math.ceil(logo.getBoundingClientRect().top);
// console.log('logo_top',logo_top);
  let header_height = (logo_top - header_top) + 'px';
// console.log('header_height',header_height);
  header.style.height = header_height;
  // user_data_block.scrollTop = user_data_block.scrollHeight;
};


let checkUserDataHeigth = function(step) {
  let next_definition = definitions_list[(step - 2) / 2];
  let user_data_block_heigth = user_data_block.getBoundingClientRect().height;
  let next_definition_offset = next_definition.getBoundingClientRect().top - user_data_block.getBoundingClientRect().top + next_definition.getBoundingClientRect().height;
  let delta = next_definition_offset + user_data_block.scrollTop - user_data_block_heigth;
  if(delta > 0) {
    user_data_block.scrollTop = delta;
  }
// console.log('step',step);
// console.log('user_data_block_heigth',user_data_block_heigth);
// console.log('user_data_block.scrollTop',user_data_block.scrollTop)
// console.log('next_definition_offset',next_definition_offset);
// console.log('delta',delta);
};
window['checkUserDataHeigth'] = checkUserDataHeigth;
let printerQueue = function(event) {
  let step = event.detail.step;
  if(!printer_queue_data[step]) {
    printer_queue_data[step] = 1;
  }
  else {
    printer_queue_data[step]++;
  }
  let queue_settings = Object.assign({}, config.printer_queue_defaults, config.printer_queue_options[step]);
  if(printer_queue_data[step] == printer_elements[step].length) {
    if(step == 1) {
      document.addEventListener('character_printed', setStatistic);
    }
    if(queue_settings.callback && event.detail.callback != false) {
      window[queue_settings.callback](step);
    }
    let timeout = queue_settings.frames_delay * config.frame_timeout;
    if(printer_elements[step + 1]) {
      setTimeout(function() {
        printElements(step + 1);
      }, timeout);
    }
  }
};

// let video = document.getElementById('video');
// let video_source = new XMLHttpRequest();
// video_source.onload = function() {
//   console.log( 'Данные полностью загружены на сервер!' );
//   video.src = URL.createObjectURL(video_source.response);
//   video.play();
// };
// if (video.canPlayType('video/mp4;codecs="avc1.42E01E, mp4a.40.2"')) {
//   video_source.open("GET", "media/1.mp4");
// }
// else {
//   // r.open("GET", "slide.webm");
//   console.error('Video not supported!')
// }
// video_source.onprogress = function(event) {
//   console.log(event.loaded, event.total);
//   console.log(Math.floor((event.loaded / event.total) * 100)+'%');
// }


// video_source.onerror = function() {
//   console.log( 'Произошла ошибка при загрузке данных на сервер!' );
// }

// video_source.responseType = "blob";
// video_source.send();

document.addEventListener('string_printed', printerQueue);
})();
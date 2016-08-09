require('../stylus/index');

import 'babel-polyfill';
require('ie_fixes');
(function () {
'use strict';
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
let statistic_interval = false;

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
  return nav_device || mobile_detect.mobile() || 'Computer';
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
  let statistic_interval = setInterval(function(index) {
    let current_percent = parseInt(element.textContent);
    let inequality = statistics_percent - current_percent;
    if(inequality > 0) {
      element.textContent = current_percent + 1 + '%';
    }
    if(current_percent == 100) {
      clearInterval(statistic_interval);
    }
  }, config.statistic_animation_time);
};

let setStatistic = function() {
  printed_symbols++;
  let current_percent = Math.round(100 * (printed_symbols / statistic_symbols));
  if(current_percent != statistics_percent) {
    statistics_percent = current_percent;
    if(!statistic_interval) {
      statistic_interval = true;
      let statistic = document.querySelector('.percent');
      animateStatistic(statistic);
    }
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

let tst_start = null;
let tst_end = null;
let video = document.getElementById('video');
let videoProgress = function(event) {
    var percent = null;
    if(!tst_start) {
      tst_start = new Date().getTime();
    }
// console.log('event',event);
// console.log('video',video);
// console.log('video.buffered',video.buffered);
// console.log('video.buffered.length',video.buffered.length);
// console.log('video.buffered.end',video.buffered.end);
// console.log('video.duration',video.duration);
// console.log('video.readyState',video.readyState);
    // FF4+, Chrome
    if (video && video.buffered && video.buffered.length > 0 && video.buffered.end && video.duration) {
        percent = video.buffered.end(0) / video.duration;
// console.log('percent1',percent);
    } 
    // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
    // to be anything other than 0. If the byte count is available we use this instead.
    // Browsers that support the else if do not seem to have the bufferedBytes value and
    // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
    else if (video && video.bytesTotal != undefined && video.bytesTotal > 0 && myVideoTag.bufferedBytes != undefined) {
        percent = video.bufferedBytes / video.bytesTotal;
// console.log('percent2',percent);
    }

    if (percent !== null) {
        percent = Math.round(100 * Math.min(1, Math.max(0, percent)));
  tst_end = new Date().getTime();
  let res = (tst_end - tst_start) / 1000;
        // console.log('percent',percent, res);
    }
};
let videoMeta = function(event) {
//   console.log('videoMeta',event);
// console.log('video.duration',video.duration);
};
let videoReady = function(event) {
  // console.log('videoReady',event);
};
video.addEventListener('progress', videoProgress);
video.addEventListener('loadedmetadata', videoMeta);
video.addEventListener('loadeddata', videoReady);

document.addEventListener('string_printed', printerQueue);
})();
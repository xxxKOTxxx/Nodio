require('../stylus/index');
import "babel-polyfill";
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

/*** Set default user data ***/
let default_data_value = 'unknown';
let user_data = {
  global_ip: default_data_value,
  local_ip: default_data_value,
  provider: default_data_value,
  location: default_data_value,
  device: default_data_value,
  os: default_data_value,
  browser: default_data_value,
};
let parsed_data = {};
let printer_queue_data = {};

let data_counter = 0;
let data_ready = false;
let statistic_symbols = 0;
let printed_symbols = 0;
let statistics_percent = 0;
let statistic_interval = false;
let statistic_animation_time = 250;
let frame_timeout = 40;

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

/*** Grt user operation system ***/
let getUserOperationSystem = function() {
  return getUserOS() || mobile_detect.os();
};
parsed_data.os = getUserOperationSystem();

/*** Grt user browser ***/
parsed_data.browser = getUserBrowser();

let setUserData = function() {
  Object.assign(user_data, parsed_data);
  if(user_data.location !== default_data_value) {
    user_data.location = user_data.location.city + ', ' + user_data.location.country;
  }
  if(user_data.os !== default_data_value) {
    user_data.os = user_data.os.name + ' ' + user_data.os.version;
  }
  if(user_data.browser !== default_data_value) {
    user_data.browser = user_data.browser.name + ' ' + user_data.browser.full_version;
  }
  user_data.name = '*#@~$&#^';
  getStatistics();
};

let getStatistics = function() {
  let print = document.querySelectorAll('.print.statistics');
  for(let i = print.length - 1; i >= 0; i--) {
    statistic_symbols += print[i].textContent.replace(' ', '').length;
  }
  let user_data_length = Object.keys(user_data).reduce(function(sum, key) {
    return sum + user_data[key].replace(' ', '').length;
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

let printer_settings = {
  info: {
    print_all: true,
    frame_timeout: frame_timeout,
    placeholder_frames: 9,
    opacity_frames: 16,
  },
  info_repcent: {
    print_all: true,
    frame_timeout: frame_timeout,
    placeholder_frames: 9,
    opacity_frames: 7,
  },
  info_percent: {
    print_all: true,
    frame_timeout: frame_timeout,
    placeholder_frames: 8,
    opacity_frames: 18,
  },
  header_all: {
    print_all: true,
    frame_timeout: frame_timeout,
    placeholder_frames: 5,
    opacity_frames: 10,
  },
  header_string: {
    placeholder_frames: 1,
    frame_timeout: frame_timeout,
  },
  footer_top: {
    print_all: true,
    frame_timeout: frame_timeout,
    placeholder_frames: 12,
    opacity_frames: 7,
  },
  footer_bottom: {
    print_all: true,
    frame_timeout: frame_timeout,
    placeholder_frames: 12,
    opacity_frames: 16,
    max_opacity: 0.75,
  }
};

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
  }, logo_animation_timeout);
  printElements(1);
};

let printElements = function(step) {
  for (var i = printer_elements[step].length - 1; i >= 0; i--) {
    let settings = printer_settings[printer_elements[step][i].getAttribute('data-print-setting')];
    let string = false;
    if(printer_elements[step][i].getAttribute('data-print-string')) {
      string = user_data[printer_elements[step][i].getAttribute('data-print-string')];
    }
    printString(printer_elements[step][i], string, settings, {step: step});
  }
};

// let squareAnimation = function() {
//   let square = document.querySelector('.square');
//   square.classList.remove('animate');
//   setTimeout(function() {
//     square.classList.add('animate');
//   }, 10);
// };

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
  }, statistic_animation_time);
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

let printer_queue_defaults = {
  frames_delay: 15,
  // animation_count: false
};
let printer_queue_options = {
  1: {
    frames_delay: 0
  },
  // 2: {
  //   animation_count: 1
  // },
  // 4: {
  //   animation_count: 1
  // },
  // 6: {
  //   animation_count: 1
  // },
  // 8: {
  //   animation_count: 1
  // }
};

let printerQueue = function(event) {
  let step = event.detail.step;
  if(!printer_queue_data[step]) {
    printer_queue_data[step] = 1;
  }
  else {
    printer_queue_data[step]++;
  }
  let queue_settings = Object.assign({}, printer_queue_defaults, printer_queue_options[step]);
  // if(queue_settings.animation_count == printer_queue_data[step]) {
  //   squareAnimation();
  // }
  if(printer_queue_data[step] == printer_elements[step].length) {
    if(step == 1) {
      document.addEventListener('character_printed', setStatistic);
    }
    let timeout = queue_settings.frames_delay * frame_timeout;
    if(printer_elements[step + 1]) {
      setTimeout(function() {
        printElements(step + 1);
      }, timeout);
    }
  }
};

document.addEventListener('string_printed', printerQueue);
})();
'use strict';
/*** Add styles ***/
require('../stylus/index');
/*** Add template ***/
require('../index.jade');
/*** Add modules ***/
/* Detect user ip module */
import getUserIPs from './get_ip';
/* Detect user data module */
import getUserData from './get_user_data';
/* Detect mobile module */
import MobileDetect from './mobile-detect';
/* Detect OS module */
import getUserOS from './get_user_os';
/* Detect browser module */
import getUserBrowser from './get_user_browser';
/* Print module */
import printString from './print_string';

/*** Set default user data ***/
let user_data = {
  global_ip: 'unknown',
  local_ip: 'unknown',
  provider: 'unknown',
  location: 'unknown',
  device: 'unknown',
  os: 'unknown',
  browser: 'unknown',
};

let data_counter = 0;
let data_ready = false;
let statistic_symbols = 0;

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
  Object.assign(user_data, data);
  check_data();
}

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
}
user_data.device = getUserDevice();

/*** Grt user operation system ***/
let getUserOperationSystem = function() {
  return getUserOS() || mobile_detect.os();
}
user_data.os = getUserOperationSystem();

/*** Grt user browser ***/
user_data.browser = getUserBrowser();

let getStatistics = function() {
  let print = document.querySelectorAll('.print');
  for(let i = print.length - 1; i >= 0; i--) {
    statistic_symbols += print[i].textContent.length
  }
  let user_data_string = user_data.global_ip + user_data.local_ip + user_data.provider + user_data.location.city + user_data.location.country + user_data.device + user_data.os.name + user_data.os.version + user_data.browser.name + user_data.browser.version;
  statistic_symbols += user_data_string.length;
}


let initialize = function() {
  if(!data_ready) {
    document.addEventListener('data_ready', getStatistics);
  }
  let body = document.querySelector('body');
  let location = document.querySelector('dd.location');
  let provider = document.querySelector('dd.provider');
  let global_ip = document.querySelector('dd.global_ip');
  let local_ip = document.querySelector('dd.local_ip');
  let device = document.querySelector('dd.device');
  let os = document.querySelector('dd.os');
  let browser = document.querySelector('dd.browser');
  let name = document.querySelector('dd.name');
  body.className = 'ready';
}
document.addEventListener('DOMContentLoaded', initialize);








let printer = document.querySelector('footer p');
printString(printer, false, {print_timeout: 0});




let go = document.querySelector('footer');

let gogo = function() {
  let square = document.querySelector('.square');
  square.classList.toggle('go');

};
go.addEventListener('click', gogo);
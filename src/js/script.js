'use strict';
var css = require('../stylus/styles.styl');
import getUserData from './get_user_data';
import getUserBrowser from './get_user_browser';
import getInternalIP from './get_internal_ip';
import MobileDetect from './mobile-detect';

let location = document.querySelector('dd.location');
let provider = document.querySelector('dd.provider');
let global_ip = document.querySelector('dd.global_ip');
let local_ip = document.querySelector('dd.local_ip');
let device = document.querySelector('dd.device');
let os = document.querySelector('dd.os');
let browser = document.querySelector('dd.browser');
let name = document.querySelector('dd.name');


let init = function(data) {
  location.innerHTML = user_data.location;
  provider.innerHTML = user_data.provider;
  global_ip.innerHTML = user_data.global_ip;
  console.log('internalHandler',user_data.internal_ip)
  local_ip.innerHTML = user_data.internal_ip;
  device.innerHTML = user_data.device;
  os.innerHTML = user_data.os;
  browser.innerHTML = user_data.browser;
  name.innerHTML = '$$@%^&%@';
}


let user_data = {};

let md = new MobileDetect(navigator.userAgent);
user_data.os = md.os();

let part = navigator.userAgent.split(' Build/');
let nav_device = part[0].substr(part[0].lastIndexOf(';') + 2);
if(nav_device.length > 15) {
  nav_device = false;
}
console.log('nav_device', nav_device)
user_data.device = nav_device || md.mobile() || 'Computer';
user_data.browser = getUserBrowser();

let el = document.querySelector('#test');
el.innerHTML = nav_device;
// el.innerHTML = md.userAgent() +' ' + md.os()+' '+md.mobile()+' '+user_data.device+' '+navigator.userAgent;


console.log('navigator.userAgent', navigator.userAgent)
console.log('navigator.appName', navigator.appName)
console.log('navigator.platform', navigator.platform)
console.log('navigator', navigator)
console.log('userAgent', md.userAgent())
console.log('versionStr', md.versionStr('Version'))
console.log('version',md.version('Webkit') );    

let errorHandler = function(error) {
  console.log('error',error);
  init();
};

let userDataHandler = function(data) {
  Object.assign(user_data, data);
  getInternalIP(user_data.global_ip).then(internalHandler).catch(errorHandler);
};

let internalHandler = function(data) {
  user_data.internal_ip = data;
  init();
}

getUserData().then(userDataHandler).catch(errorHandler);


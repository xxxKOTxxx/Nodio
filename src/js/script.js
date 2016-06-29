'use strict';
var css = require('../stylus/styles.styl');
import getUserData from './get_user_data';
import getUserOS from './get_user_os';
import getUserBrowser from './get_user_browser';
import getInternalIP from './get_internal_ip';
let user_data = {};

user_data.os = getUserOS();
user_data.browser = getUserBrowser();

let errorHandler = function(error) {
  console.log('error',error);
};

let userDataHandler = function(data) {
  Object.assign(user_data, data);
  console.log('userDataHandler',user_data);
  getInternalIP(user_data.global_ip).then(internalHandler, errorHandler);
};

let internalHandler = function(data) {
  user_data.internal_ip = data;
  console.log('internalHandler',user_data);
}

getUserData().then(userDataHandler, errorHandler);

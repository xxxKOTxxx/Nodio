'use strict';
export default function() {
  return new Promise( function(resolve, reject) {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

    var xhr = new XHR();
    xhr.open('GET', 'http://ip-api.com/json/', true);
    xhr.onload = function() {
      let json = JSON.parse(this.responseText);
      let result = {
        "global_ip": json.query,
        "location": json.org,
        "provider": json.isp
      }
      resolve(result);
    }

    xhr.onerror = function() {
      reject('Ошибка ' + this.status);
    }

    xhr.send();
  });
};
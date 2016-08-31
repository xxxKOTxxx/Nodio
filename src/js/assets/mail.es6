/* Mail module */
module.exports = class Mail {
  constructor() {
    this.action = '';
    this.type = '';
    this.email = '';
    this.message = '';
    this.forms = document.querySelectorAll('.send-form');
    this.forms_length = this.forms.length;
    for(let i = this.forms_length - 1; i >= 0; i--) {
      this.forms[i].addEventListener('submit', this.submithandler.bind(this), false);
    }
  }
  submithandler(event) {
    event.preventDefault();
    let form = event.target;
console.log('form',form)
    this.action = form.action;
console.log('action',this.action)
    this.type = form.name;
console.log('name',this.name)
    this.email = form.email.value;
console.log('email',this.email)
    let message_input = form.message;
    if(message_input) {
      this.message = message_input.value;
console.log('message',this.message)
    }
    else {
      this.message = '';
    }
    this.sendData();
  }
  sendData() {
    let data = "type=" + this.type + "&email=" + this.email + "&message=" + this.message;
    let request = new this.ajaxRequest();
    request.responseType = 'json';
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if(request.status == 200) {
console.log('response',request.response)
        }
        else {
          console.error("An error has occured making the request");
        }
      }
    };
    request.open("POST", this.action, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(data);
  }
  ajaxRequest() {
    let activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] // activeX versions to check for in IE
    if(window.ActiveXObject) { // Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
      for(let i = 0; i < activexmodes.length; i++) {
        try {
          return new ActiveXObject(activexmodes[i]);
        }
        catch(e) {
          console.error('activeX Error');
        }
      }
    }
    else if(window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } // if Mozilla, Safari etc
    else {
      return false
    }
  }
}
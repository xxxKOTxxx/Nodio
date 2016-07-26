export default function(element, string, options) {
  'use strict';
  let extend = function() {
    for(var i=1; i<arguments.length; i++)
      for(var key in arguments[i]) {
        if(arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    return arguments[0];
  };

  let settings = {
    placeholder_frames: 25,
    frame_timeout: 40
  };
  settings.print_timeout = settings.placeholder_frames * settings.frame_timeout;
  extend(settings, options); 

  let number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let symbol = ['!', '@', '#', '$', '^', '&', '*', '~', ':', ';', '.', ',', '?', '/', '|'];
  let letter = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  let placeholders = {
    number: number,
    symbol: symbol,
    letter: letter
  } 

  if(!string) {
    string = element.textContent;
  }

// console.log('element',element);
// console.log('string',string);

  let testChar = function(character) {
    let result = {};
    result.character = character;
    if(!isNaN(+character)) {
      result.type = 'number';
      result.number = character;
    }
    else {
      if (character.toLowerCase() == character.toUpperCase()) {
        result.type = 'symbol';
        result.number = symbol.indexOf(character);
      }
      else {
        result.type = 'letter';
        result.number = letter.indexOf(character.toLowerCase());
        if (character == character.toUpperCase()) {
          result.case = 'UpperCase';
        }
        if (character == character.toLowerCase()){
          result.case = 'LowerCase';
        }
      }
    }
    if(character == ' ') {
      result.type = 'space';
      result.number = null;
    }
    return result;
  };

  let placeholder = function(element, frames, timeout) {
    let placeholder = element.getElementsByClassName('placeholder')[0];
// console.log('placeholder',placeholder)
    let data = JSON.parse(placeholder.getAttribute('data-character'));
// console.log('data',data)
    placeholder.removeAttribute('data-character');
    let placeholder_string = placeholders[data.type];
    if(!placeholder_string) {
      return;
    }
    let placeholder_string_length = placeholder_string.length;
    data.current = -1;

    for(var i = 0; i < frames - 1; i++) {
      (function(index) {
        setTimeout(function() {
          let current_placeholder_index = randomizer(1, placeholder_string_length, [data.number, data.current]);
          data.current = current_placeholder_index;
          let current_placeholder = placeholder_string[current_placeholder_index];
          if(data.case == 'UpperCase') {
            current_placeholder = current_placeholder.toUpperCase();
          }
          placeholder.textContent = current_placeholder;
        }, timeout * i);
      })(i);
    }
    setTimeout(function() {
      placeholder.remove();
      element.className = 'print-character';
      element.parentNode.classList.remove("print");
    }, timeout * (frames - 1));
  };

  let randomizer = function(max, min, except) {
    if(typeof except == 'undefined') {
      except = [-1];
    }
    var result = except[0];
    while(except.indexOf(result) >= 0) {
      result = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return result;
  };

  let getTemplate = function(string) {
    let result = Array();
    let char_array = string.split('');
    for(let i = 0; i < string.length; i++) {
      let char_el = document.createElement('span');
      char_el.className = 'print-character placeholder';
      char_el.innerHTML = string[i];

      let char_data = testChar(string[i]);
      let placeholder = document.createElement('span');
      placeholder.className = 'placeholder';
      placeholder.setAttribute('data-character', JSON.stringify(char_data));
      char_el.appendChild(placeholder);
      result.push(char_el);
    }
    return result;
  };

  let printTemplate = function(element, template, timeout) {
    element.innerHTML = '';
    if(timeout) {
      for(var i = 0; i < template.length; i++) {
        (function(index) {
          setTimeout(function() {
            element.appendChild(template[index]);
            placeholder(template[index], settings.placeholder_frames, settings.frame_timeout);
          }, timeout * i);
        })(i);
      }
    }
    else {
      for(var i = 0; i < template.length; i++) {
        element.appendChild(template[i]);
        placeholder(template[i], settings.placeholder_frames, settings.frame_timeout);
      }
    }
  };

  let template = getTemplate(string);
  printTemplate(element, template, settings.print_timeout);
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = getValue;
var getSelectedValues = function getSelectedValues(options) {
  var result = [];
  if (options) {
    for (var index = 0; index < options.length; index += 1) {
      var option = options[index];
      if (option.selected) {
        result.push(option.value);
      }
    }
  }
  return result;
};

var isEvent = function isEvent(candidate) {
  return !!(candidate && candidate.stopPropagation && candidate.preventDefault);
};

function getValue(event) {
  if (isEvent(event)) {
    var _event$target = event.target,
        type = _event$target.type,
        value = _event$target.value,
        checked = _event$target.checked,
        files = _event$target.files,
        dataTransfer = event.dataTransfer;

    if (type === 'checkbox') {
      return checked;
    }
    if (type === 'file') {
      return files || dataTransfer && dataTransfer.files;
    }
    if (type === 'select-multiple') {
      return getSelectedValues(event.target.options);
    }
    return value;
  }
  // not an event, so must be either our value or an object containing our value in the 'value' key
  return event && (typeof event === 'undefined' ? 'undefined' : _typeof(event)) === 'object' && event.value !== undefined ? event.value : event;
}
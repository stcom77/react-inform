"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createValidate;
var hasThen = function hasThen(obj) {
  return !!obj && obj.then instanceof Function;
};

function gen(obj) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var keys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Object.keys(obj);

  return {
    keys: keys,
    index: index,
    key: keys[index],
    value: obj[keys[index]],
    next: function next() {
      return gen(obj, index + 1, keys);
    },
    done: index >= keys.length
  };
}

function validateField(value, values, rule) {
  if (rule.done) return undefined;
  var result = rule.value(value, values);

  if (hasThen(result)) {
    return result.then(function (res) {
      if (!res) return rule.key;
      return validateField(value, values, rule.next());
    });
  } else if (!result) return rule.key;
  return validateField(value, values, rule.next());
}

function createValidate(rulesMap) {
  return function (values) {
    var errors = {};
    var promises = [];
    Object.keys(rulesMap).forEach(function (key) {
      var rules = rulesMap[key];
      var value = values[key];
      var result = validateField(value, values, gen(rules));

      if (hasThen(result)) {
        promises.push(result.then(function (v) {
          if (v !== undefined) {
            errors[key] = v;
          }
        }));
      } else if (result !== undefined) errors[key] = result;
    });
    if (promises.length === 0) return errors;
    return Promise.all(promises).then(function () {
      return errors;
    });
  };
}
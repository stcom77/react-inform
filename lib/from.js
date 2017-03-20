'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = from;

var _createValidate = require('./createValidate');

var _createValidate2 = _interopRequireDefault(_createValidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function from(rules) {
  return {
    fields: Object.keys(rules),
    validate: (0, _createValidate2.default)(rules)
  };
}
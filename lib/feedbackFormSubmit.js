"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FeedbackFormSubmit = (_temp = _class = function (_Component) {
  _inherits(FeedbackFormSubmit, _Component);

  function FeedbackFormSubmit() {
    _classCallCheck(this, FeedbackFormSubmit);

    return _possibleConstructorReturn(this, (FeedbackFormSubmit.__proto__ || Object.getPrototypeOf(FeedbackFormSubmit)).apply(this, arguments));
  }

  _createClass(FeedbackFormSubmit, [{
    key: "handleClick",
    value: function handleClick(e) {
      if (!this.context.form.isValid()) {
        e.preventDefault();
        this.context.form.forceValidate();
        if (this.props.onInvalid) this.props.onInvalid(e);
      }
      if (this.props.onClick) this.props.onClick(e);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement("input", _extends({ type: "submit" }, this.props, { onClick: function onClick(e) {
          return _this2.handleClick(e);
        } }));
    }
  }]);

  return FeedbackFormSubmit;
}(_react.Component), _class.propTypes = {
  onInvalid: _react.PropTypes.func,
  onClick: _react.PropTypes.func
}, _class.contextTypes = {
  form: _react.PropTypes.object.isRequired
}, _temp);
exports.default = FeedbackFormSubmit;
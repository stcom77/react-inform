'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = form;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _getValue = require('./getValue');

var _getValue2 = _interopRequireDefault(_getValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function form() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$fields = _ref.fields,
      defaultFields = _ref$fields === undefined ? [] : _ref$fields,
      _ref$validate = _ref.validate,
      defaultValidate = _ref$validate === undefined ? function () {
    return {};
  } : _ref$validate;

  return function (Wrapped) {
    var _class, _temp2;

    return _temp2 = _class = function (_Component) {
      _inherits(FormWrapper, _Component);

      function FormWrapper() {
        var _ref2;

        var _temp, _this, _ret;

        _classCallCheck(this, FormWrapper);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = FormWrapper.__proto__ || Object.getPrototypeOf(FormWrapper)).call.apply(_ref2, [this].concat(args))), _this), _this.state = {
          errors: {},
          valid: undefined
        }, _this.broadcastChange = function (values) {
          if (_this.props.onChange) _this.props.onChange(values);
        }, _this.broadcastTouched = function (touched) {
          if (_this.props.onTouch) _this.props.onTouch(touched);
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(FormWrapper, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var values = this.props.value || {};
          this.setState({ values: values });

          var touched = this.props.touched || {};
          this.setState({ touched: touched });

          this.handleValidate(values);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (nextProps.value !== undefined) {
            var values = nextProps.value;
            this.setState({ values: values });
            this.handleValidate(values, nextProps.validate);
          } else if (nextProps.validate !== undefined) {
            this.handleValidate(this.state.values, nextProps.validate);
          }
          if (nextProps.touched !== undefined) {
            var touched = nextProps.touched;
            this.setState({ touched: touched });
          }
        }
      }, {
        key: 'setValues',
        value: function setValues(values) {
          var _this2 = this;

          if (values === undefined) return;
          if (this.props.value !== undefined) {
            this.broadcastChange(values);
          } else {
            this.setState({ values: values }, function () {
              return _this2.broadcastChange(values);
            });
            this.handleValidate(values);
          }
        }
      }, {
        key: 'setErrors',
        value: function setErrors(errors) {
          var valid = Object.keys(errors).length === 0;
          if (valid !== this.state.valid) {
            this.setState({ valid: valid });
            if (this.props.onValidate) this.props.onValidate(valid);
          }
          this.setState({ errors: errors });
        }
      }, {
        key: 'handleValidate',
        value: function handleValidate(values) {
          var _this3 = this;

          var validate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.validate;

          var errors = validate(values);
          if (errors.then instanceof Function) {
            errors.then(function (errs) {
              return _this3.setErrors(errs);
            });
          } else {
            this.setErrors(errors);
          }
        }
      }, {
        key: 'handleChange',
        value: function handleChange(name, e) {
          var value = (0, _getValue2.default)(e);
          var values = _extends({}, this.state.values, _defineProperty({}, name, value));

          if (value === this.state.values[name]) return;
          this.setValues(values);
        }
      }, {
        key: 'updateTouched',
        value: function updateTouched(touched) {
          var _this4 = this;

          if (this.props.touched !== undefined) {
            this.broadcastTouched(touched);
          } else {
            this.setState({ touched: touched }, function () {
              return _this4.broadcastTouched(touched);
            });
          }
        }
      }, {
        key: 'touch',
        value: function touch(preVals) {
          var _this5 = this;

          var toVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

          var vals = preVals.filter(function (v) {
            return _this5.props.fields.indexOf(v) !== -1;
          });
          var alreadySet = vals.reduce(function (acc, name) {
            return acc && _this5.state.touched[name] === toVal;
          }, true);
          if (alreadySet) return;

          var touched = vals.reduce(function (acc, name) {
            return _extends({}, acc, _defineProperty({}, name, toVal));
          }, this.state.touched);

          this.updateTouched(touched);
        }
      }, {
        key: 'formProps',
        value: function formProps() {
          var _this6 = this;

          return {
            isValid: function isValid() {
              return _this6.state.valid;
            },
            touch: function touch() {
              var vals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
              return _this6.touch(vals);
            },
            forceValidate: function forceValidate() {
              return _this6.touch(_this6.props.fields);
            },
            untouch: function untouch() {
              var vals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
              return _this6.touch(vals, false);
            },
            resetTouched: function resetTouched() {
              return _this6.touch(_this6.props.fields, false);
            },
            values: function values() {
              return _this6.state.values;
            },
            onValues: function onValues(values) {
              _this6.setValues(values);
            },
            getErrors: function getErrors() {
              return _this6.state.errors;
            }
          };
        }
      }, {
        key: 'baseProps',
        value: function baseProps(name) {
          var _this7 = this;

          var values = this.state.values;

          return {
            onChange: function onChange(e) {
              return _this7.handleChange(name, e);
            },
            onBlur: function onBlur() {
              return _this7.touch([name]);
            },
            value: values[name] || '',
            checked: typeof values[name] === 'boolean' ? values[name] : undefined
          };
        }
      }, {
        key: 'makeField',
        value: function makeField(name) {
          var _state = this.state,
              errors = _state.errors,
              touched = _state.touched;

          var baseProps = this.baseProps(name);
          return _extends({}, baseProps, {
            error: touched[name] ? errors[name] : undefined,
            props: baseProps
          });
        }
      }, {
        key: 'makeFields',
        value: function makeFields() {
          var _this8 = this;

          return this.props.fields.reduce(function (acc, name) {
            return _extends({}, acc, _defineProperty({}, name, _this8.makeField(name)));
          }, {});
        }
      }, {
        key: 'generatedProps',
        value: function generatedProps() {
          return {
            form: this.formProps(),
            fields: this.makeFields()
          };
        }
      }, {
        key: 'getChildContext',
        value: function getChildContext() {
          return this.generatedProps();
        }
      }, {
        key: 'render',
        value: function render() {
          // eslint-disable-next-line no-unused-vars
          var _props = this.props,
              value = _props.value,
              onChange = _props.onChange,
              onValidate = _props.onValidate,
              validate = _props.validate,
              fields = _props.fields,
              otherProps = _objectWithoutProperties(_props, ['value', 'onChange', 'onValidate', 'validate', 'fields']);

          return _react2.default.createElement(Wrapped, _extends({}, otherProps, this.generatedProps()));
        }
      }]);

      return FormWrapper;
    }(_react.Component), _class.defaultProps = {
      fields: defaultFields,
      validate: defaultValidate
    }, _class.childContextTypes = {
      form: _react.PropTypes.object,
      fields: _react.PropTypes.object
    }, _class.propTypes = {
      fields: _react.PropTypes.array,
      validate: _react.PropTypes.func,
      value: _react.PropTypes.object,
      touched: _react.PropTypes.object,
      onTouch: _react.PropTypes.func,
      onChange: _react.PropTypes.func,
      onValidate: _react.PropTypes.func,
      getErrors: _react.PropTypes.func
    }, _temp2;
  };
}
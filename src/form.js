import React, { Component, PropTypes } from 'react';

import getValue from './getValue';

export default function form({
  fields: defaultFields = [],
  validate: defaultValidate = () => ({}),
} = {}) {
  return (Wrapped) => class FormWrapper extends Component {
    static defaultProps = {
      fields: defaultFields,
      validate: defaultValidate,
    }

    static childContextTypes = {
      form: PropTypes.object,
      fields: PropTypes.object,
    }

    static propTypes = {
      fields: PropTypes.array,
      validate: PropTypes.func,
      value: PropTypes.object,
      onChange: PropTypes.func,
      onValidate: PropTypes.func,
    }

    state = {
      touched: {},
      errors: {},
      valid: undefined,
    }

    componentWillMount() {
      const values = this.props.value || {};
      this.setState({ values });
      this.handleValidate(values);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== undefined) {
        const values = nextProps.value;
        this.setState({ values });
        this.handleValidate(values, nextProps.validate);
      } else if (nextProps.validate !== undefined) {
        this.handleValidate(this.state.values, nextProps.validate);
      }
    }

    setValues(values) {
      if (values === undefined) return;
      if (this.props.value !== undefined) {
        this.broadcastChange(values);
      } else {
        this.setState({ values }, () => this.broadcastChange(values));
        this.handleValidate(values);
      }
    }

    setErrors(errors) {
      const valid = Object.keys(errors).length === 0;
      if (valid !== this.state.valid) {
        this.setState({ valid });
        if (this.props.onValidate) this.props.onValidate(valid);
      }
      this.setState({ errors });
    }

    handleValidate(values, validate = this.props.validate) {
      const errors = validate(values);
      if (errors.then instanceof Function) {
        errors.then(errs => this.setErrors(errs));
      } else {
        this.setErrors(errors);
      }
    }

    field(name) {
      return {
        onBlur: () => this.blur(name),
        onChange: e => this.handleChange(name, e),
      };
    }

    broadcastChange = values => {
      if (this.props.onChange) this.props.onChange(values);
    }

    handleChange(name, e) {
      const value = getValue(e);
      const values = {
        ...this.state.values,
        [name]: value,
      };

      if (value === this.state.values[name]) return;
      this.setValues(values);
    }

    touch(vals) {
      const allTouched = vals.reduce((acc, name) => acc && this.state.touched[name], true);
      if (allTouched) return;

      this.setState({ touched: {
        ...this.state.touched,
        ...vals.reduce((acc, name) => ({ ...acc, [name]: true }), {}),
      } });
    }

    formProps() {
      return {
        isValid: () => this.state.valid,
        forceValidate: () => this.touch(this.props.fields),
        values: () => this.state.values,
        onValues: values => {
          this.setValues(values);
        },
      };
    }

    makeField(name) {
      const { values, errors, touched } = this.state;
      return {
        onChange: e => this.handleChange(name, e),
        onBlur: () => this.touch([name]),
        value: values[name] || '',
        error: touched[name] ? errors[name] : undefined,
        checked: typeof values[name] === 'boolean' ? values[name] : undefined,
      };
    }

    makeFields() {
      return this.props.fields
        .reduce((acc, name) => ({ ...acc, [name]: this.makeField(name) }), {});
    }

    generatedProps() {
      return {
        form: this.formProps(),
        fields: this.makeFields(),
      };
    }

    getChildContext() {
      return this.generatedProps();
    }

    render() {
      // eslint-disable-next-line no-unused-vars
      const { value, onChange, onValidate, validate, fields, ...otherProps } = this.props;
      return <Wrapped {...otherProps} {...this.generatedProps()} />;
    }
  };
}

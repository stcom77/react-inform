import React, { Component, PropTypes } from 'react';

import getValue from './getValue';

export default function form({fields, validate = () => ({})}) {
  return (Wrapped) => class FormWrapper extends Component {
    static childContextTypes = {
      form: PropTypes.object,
      fields: PropTypes.object,
    }

    static propTypes = {
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
      this.setValues(nextProps.value);
    }

    setValues(values) {
      if (values === undefined) return;
      this.setState({ values });
      this.handleValidate(values);
    }

    setErrors(errors) {
      const valid = Object.keys(errors).length === 0;
      if (valid !== this.state.valid) {
        this.setState({ valid });
        if (this.props.onValidate) this.props.onValidate(valid);
      }
      this.setState({ errors });
    }

    handleValidate(values) {
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

    handleChange(name, e) {
      const value = getValue(e);
      const values = {
        ...this.state.values,
        [name]: value,
      };

      if (value === this.state.values[name]) return;
      if (this.props.onChange) this.props.onChange(values);
      if (this.props.value !== undefined) return;

      this.setState({
        values,
      });
      this.handleValidate(values);
    }

    touch(vals) {
      const allTouched = vals.reduce((acc, name) => acc && this.state.touched[name], true);
      if (allTouched) return;

      this.setState({touched: {
        ...this.state.touched,
        ...vals.reduce((acc, name) => ({...acc, [name]: true}), {}),
      }});
    }

    formProps() {
      return {
        isValid: () => this.state.valid,
        forceValidate: () => this.touch(fields),
        values: () => this.state.values,
        onValues: values => {
          if (!this.props.value) {
            this.setState({ values });
          }
          if (this.props.onChange) this.props.onChange(values);
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
      return fields.reduce((acc, name) => ({...acc, [name]: this.makeField(name)}), {});
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
      const { value, onChange, onValidate, ...otherProps } = this.props;
      return <Wrapped {...otherProps} {...this.generatedProps()}/>;
    }
  };
}

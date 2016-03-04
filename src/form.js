import React, { Component, PropTypes } from 'react';

import getValue from './getValue';

export default function form({fields, validate = () => ({})}) {
  return (Wrapped) => class Wrapper extends Component {
    static childContextTypes = {
      form: PropTypes.object,
      fields: PropTypes.object,
    }

    static propTypes = {
      formData: PropTypes.object,
      onChange: PropTypes.func,
    }

    constructor(props) {
      super(props);
      this.fields = this.createFields(fields);
      this.values = {};
      this.touched = {};
      this.resolveErrors();
      if (props.formData) this.applyValues(props.formData);
    }

    createFields(newFields) {
      return newFields.reduce((acc, v) => ({...acc, [v]: this.createField(v)}), {});
    }

    change(name, e, forced) {
      const value = getValue(e);
      this.fields[name].value = value;
      if (typeof value === 'boolean') this.fields[name].checked = value;
      else delete this.fields[name].checked;
      this.values[name] = value;
      if (value !== undefined) this.touched[name] = true;
      if (!forced) {
        this.resolveErrors();
        this.forceUpdate();
        if (this.props.onChange) this.props.onChange(this.values);
      }
    }

    applyValues(data) {
      fields.forEach(field => {
        const prop = data[field];
        this.change(field, prop, true);
      });
      this.resolveErrors();
    }

    setValues(data) {
      if (this.props.formData && this.props.onChange) {
        this.props.onChange(data);
      } else {
        this.applyValues(data);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.formData !== nextProps.formData) {
        this.applyValues(nextProps.formData);
      }
    }

    resolveErrors() {
      this.errors = validate(this.values);
      fields.forEach(field => {
        if (this.touched[field]) {
          this.fields[field].error = this.errors[field];
        }
      });
    }

    blur(name) {
      if (!this.touched[name]) {
        this.touched[name] = true;
        this.resolveErrors();
        this.forceUpdate();
      }
    }

    createField(name) {
      return {
        onFocus: () => true,
        onBlur: () => this.blur(name),
        onChange: e => this.change(name, e),
        value: undefined,
      };
    }

    touchAll() {
      fields.forEach(field => {
        this.touched[field] = true;
      });
    }

    formProps() {
      return {
        isValid: () => Object.keys(this.errors).length === 0,
        forceValidate: () => {
          this.touchAll();
          this.resolveErrors();
          this.forceUpdate();
        },
        values: () => this.values,
        onValues: values => this.setValues(values),
      };
    }

    getChildContext() {
      return {
        form: this.formProps(),
        fields: this.fields,
      };
    }

    render() {
      return <Wrapped fields={this.fields} {...this.props} form={this.formProps()}/>;
    }
  };
}

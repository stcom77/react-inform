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
    }

    constructor(props) {
      super(props);
      this.fields = this.createFields(fields);
      this.values = {};
      this.touched = {};
      this.resolveErrors();
      if (props.value !== undefined) this.setEachValue(props.value);
    }

    createFields(newFields) {
      return newFields.reduce((acc, v) => ({...acc, [v]: this.createField(v)}), {});
    }

    createField(name) {
      return {
        onBlur: () => this.blur(name),
        onChange: e => this.handleChange(name, e),
        value: undefined,
      };
    }

    handleChange(name, e) {
      const value = getValue(e);
      const changed = this.setValues({...this.values, [name]: value});
      if (changed) this.forceUpdate();
    }

    pushChanges(data) {
      if (this.props.onChange) this.props.onChange(data || this.values);
    }

    setValue(name, value) {
      if (this.values[name] === value) return false;
      this.fields[name].value = value;
      this.values[name] = value;
      if (typeof value === 'boolean') this.fields[name].checked = value;
      else delete this.fields[name].checked;
      return true;
    }

    flushChanges() {
      this.resolveErrors();
      this.forceUpdate();
    }

    setEachValue(data) {
      let changed = false;
      fields.forEach(field => {
        const prop = data[field];
        changed = this.setValue(field, prop) || changed;
      });
      if (changed) this.resolveErrors();
      return changed;
    }

    setValues(data) {
      let changed = false;
      if (this.props.value === undefined) {
        changed = this.setEachValue(data);
      }
      this.pushChanges(data);
      return changed;
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== undefined && this.props.value !== nextProps.value) {
        this.setEachValue(nextProps.value);
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
        this.flushChanges();
      }
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
          this.flushChanges();
        },
        values: () => this.values,
        onValues: values => this.setValues(values),
      };
    }

    generatedProps() {
      return {
        form: this.formProps(),
        fields: this.fields,
      };
    }

    getChildContext() {
      return this.generatedProps();
    }

    render() {
      return <Wrapped {...this.generatedProps()} {...this.props}/>;
    }
  };
}

import './index.css';
import '../foundation.css';

import React, { Component } from 'react';
import { render } from 'react-dom';
import alertify from 'alertify.js';
import {
  form,
  DisabledFormSubmit,
  FeedbackFormSubmit,
  ResetFormButton,
} from 'react-inform';

alertify.logPosition('top right');

function LabeledInput({ text, error, ...rest }) {
  let htmlFor = undefined;
  if (rest.id) {
    htmlFor = rest.id;
  }
  return (
    <div>
      <label htmlFor={htmlFor}>{text}</label>
      <input placeholder={text} type="text" {...rest} />
      <span className="ui-hint">{error}</span>
    </div>
  );
}

@form()
class MyForm extends Component {
  handleSubmit(e) {
    e.preventDefault();
    alertify.success('Awesome, it submitted!');
  }

  render() {
    const { fields: fieldMap } = this.props;
    const fields = Object.keys(fieldMap);
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        {fields.map(fieldName =>
          <LabeledInput
            text={fieldName}
            id={fieldName}
            key={fieldName}
            {...fieldMap[fieldName]}
          />
        )}
        <DisabledFormSubmit className="button" value="I am enabled when valid!" />
        <FeedbackFormSubmit
          className="button"
          value="I will reveal errors!"
          onInvalid={() => alertify.error('Please fix errors!')}
        />
        <ResetFormButton className="alert button" />
      </form>
    );
  }
}

class App extends Component {
  state= {
    descriptors: [{
      fieldName: 'Email',
      validate: "x => !!x && !!x.match(/[^@]+@[^@]+\\.[^@]+/) || 'Must be a valid email'",
    }, {
      fieldName: 'Password',
      validate: "x => !!x || 'Password is required'",
    }, {
      fieldName: 'Confirm Password',
      validate: "(x, values) => x === values.Password || 'Passwords must match'",
    }],
  };

  handleChange = e => {
    const { descriptors } = this.state;
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    const type = e.target.getAttribute('data-type');
    this.setState({
      descriptors: descriptors.map((des, i) => {
        if (i !== index) return des;
        return {
          ...des,
          [type]: e.target.value,
        };
      }),
    });
  }

  handleAdd = () => {
    const { descriptors } = this.state;
    this.setState({
      descriptors: descriptors.concat({
        fieldName: '',
        validate: 'x => undefined',
      }),
    });
  }

  tryEval(code) {
    try {
      return eval(code);
    } catch (e) {
      return undefined;
    }
  }

  convertDescriptor = ({ fieldName, validate }) => {
    const result = this.tryEval(validate);
    if (result instanceof Function) {
      return {
        fieldName,
        validate: result,
      };
    }
    return {
      fieldName,
      validate: () => undefined,
    };
  }

  makeValidate = () => {
    const descriptors = this.state.descriptors.map(this.convertDescriptor);

    return values => {
      const errors = {};
      descriptors.forEach(({ fieldName, validate }) => {
        if (!fieldName) return;
        try {
          const result = validate(values[fieldName], values);
          if (result === true) return;
          if (result) errors[fieldName] = result;
        } catch (e) {
          errors[fieldName] = e.toString();
        }
      });
      return errors;
    };
  }

  render() {
    const { descriptors } = this.state;
    const fields = descriptors.filter(({ fieldName }) => !!fieldName).map(d => d.fieldName);
    return (
      <div>
        <div className="panel callout">
          <MyForm onChange={value => this.setState({ value })} fields={fields} validate={this.makeValidate()} />
          <pre>{JSON.stringify(this.state.value || {}, 2, 2)}</pre>
        </div>
        <form className="fields">
          {descriptors.map((d, i) =>
            <div key={i}>
              <input
                type="text"
                placeholder="Name"
                data-index={i}
                data-type="fieldName"
                value={d.fieldName}
                onChange={this.handleChange}
              />
              <input
                type="text"
                placeholder="Validation"
                data-index={i}
                data-type="validate"
                value={d.validate}
                onChange={this.handleChange}
              />
            </div>
          )}
        </form>
        <button className="button" onClick={this.handleAdd}>+</button>
      </div>
    );
  }
}

render(<App />, document.getElementById('container'));

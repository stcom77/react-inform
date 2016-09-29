import './index.css';
import '../foundation.css';

import React, { Component } from 'react';
import TextArea from 'react-textarea-autosize';
import { render } from 'react-dom';
import alertify from 'alertify.js';
import { isEmail } from 'string-validator';
import {
  form,
  from,
  DisabledFormSubmit,
  FeedbackFormSubmit,
  ResetFormButton,
} from 'react-inform';

alertify.logPosition('top right');

function LabeledInput({ text, error, id, props }) {
  return (
    <div>
      <label htmlFor={id}>{text}</label>
      <input id={id} placeholder={text} type="text" {...props} />
      <span className="ui-hint">{error}</span>
    </div>
  );
}

const isRequired = value => value;

const rulesMap = {
  checkbox: {
    'Must be checked': v => v,
  },
  username: {
    'Username is required': isRequired,
  },
  email: {
    'Email is required': isRequired,
    'Must be a valid email': isEmail(),
  },
  password: {
    'Password is required': isRequired,
  },
  confirmPassword: {
    'Passwords must match': (value, { password }) => value === password,
  },
};

@form(from(rulesMap))
class MyForm extends Component {
  handleSubmit(e) {
    e.preventDefault();
    alertify.success('Awesome, it submitted!');
  }

  render() {
    const { username, email, password, confirmPassword, checkbox } = this.props.fields;
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="check-b">
          <input type="checkbox" id="check-b" name="check-b" {...checkbox.props} />
          Checkbox Just For Fun
          <span className="ui-hint">{checkbox.error}</span>
        </label>
        <LabeledInput text="Username" id="username" {...username} />
        <LabeledInput text="Email" id="email" {...email} />
        <LabeledInput type="password" text="Password" id="password" {...password} />
        <LabeledInput
          type="password"
          text="Confirm Password"
          id="confirmPassword"
          {...confirmPassword}
        />
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
    value: {
      checkbox: true,
      username: 'test user',
      email: 'badEmail',
    },
  };

  setValue(value) {
    this.setState({ value, typedValue: undefined });
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({ typedValue: value });

    try {
      const objValue = JSON.parse(value);
      this.setState({ value: objValue });
    } catch (error) {
      // do nothing
    }
  }

  render() {
    const { value, typedValue } = this.state;
    return (
      <div>
        <div className="panel callout">
          <MyForm onChange={v => this.setValue(v)} value={value} />
        </div>
        <small>Try editing this</small>
        <TextArea
          useCacheForDOMMeasurements
          value={typedValue || JSON.stringify(value, null, ' ')}
          onChange={e => this.handleChange(e)}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('container'));

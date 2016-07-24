import './index.css';
import '../foundation.css';

import React, { Component } from 'react';
import { render } from 'react-dom';
import alertify from 'alertify.js';

import {
  form,
  from,
  FeedbackFormSubmit,
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

function validateUsernameAsync(username) {
  return Promise.resolve().then(() => username.length > 3);
}

@form(from({
  username: {
    'Username is required': Boolean,
    'Username must longer than 3 characters (async)': validateUsernameAsync,
  },
  password: {
    'Password is required': Boolean,
  },
}))
class MyForm extends Component {
  handleSubmit(e) {
    e.preventDefault();
    alertify.success('Yay, it submitted');
  }

  render() {
    const { username, password } = this.props.fields;

    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <LabeledInput text="Username" id="username" {...username} />
        <LabeledInput text="Password" id="password" {...password} />
        <FeedbackFormSubmit
          className="button"
          value="I will reveal errors!"
          onInvalid={() => alertify.error('Please fix errors!')}
        />
      </form>
    );
  }
}

function App() {
  return (
    <div>
      <div className="panel callout">
        <MyForm />
      </div>
      <small></small>
    </div>
  );
}

render(<App />, document.getElementById('container'));

import './index.css';
import './foundation.css';

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
import { mation } from 'react-mation';
import { presets } from 'mation';

alertify.logPosition('top right');

class AnimatedInput extends Component {
  render() {
    const { text, error, ...rest } = this.props;

    return (
      <div>
        <label htmlFor={rest.id}>{text}</label>
        <input placeholder={text} style={{zIndex: 2, position: 'relative'}} type="text" {...rest} />
        <AnimatedUiHint>{error}</AnimatedUiHint>
      </div>
    );
  }
}

const hintOffset = 50;

@mation(presets.wobbly)
class AnimatedUiHint extends Component {
  render() {
    const { spring, children } = this.props;
    const mationval = spring(children ? 0 : -hintOffset)

    return (
      <span className="ui-hint" style={{zIndex: 1, position: 'relative', top: mationval, opacity: (mationval + hintOffset) / hintOffset}}>{children}</span>
    );
  }
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
    'Passwords must match': (value, {password}) => value === password,
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
        <label htmlFor="check-b" style={{position: 'relative', zIndex: 2}}>
          <input type="checkbox" id="check-b" name="check-b" style={{position: 'relative', zIndex: 2}} {...checkbox}/>
          Checkbox Just For Fun
          <AnimatedUiHint>{checkbox.error}</AnimatedUiHint>
        </label>
        <AnimatedInput text="Username" id="username" {...username} />
        <AnimatedInput text="Email" id="email" {...email} />
        <AnimatedInput type="password" text="Password" id="password" {...password} />
        <AnimatedInput type="password" text="Confirm Password" id="confirmPassword" {...confirmPassword} />
        <DisabledFormSubmit className="button" value="I am enabled when valid!"/>
        <FeedbackFormSubmit className="button" value="I will reveal errors!" onInvalid={() => alertify.error('Please fix errors!')}/>
        <ResetFormButton className="alert button"/>
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
    this.setState({value, typedValue: undefined});
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({typedValue: value});

    try {
      const objValue = JSON.parse(value);
      this.setState({value: objValue});
    } catch (error) {
      // do nothing
    }
  }

  render() {
    const { value, typedValue } = this.state;
    return (
      <div>
        <div className="panel callout">
          <MyForm onChange={v=> this.setValue(v)} value={value}/>
        </div>
        <small>Try editing this</small>
        <TextArea useCacheForDOMMeasurements value={typedValue || JSON.stringify(value, null, ' ')} onChange={e => this.handleChange(e)}/>
      </div>
    );
  }
}

render(<App/>, document.getElementById('container'));

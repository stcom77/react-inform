import React, { Component, PropTypes } from 'react';

export default class ResetFormButton extends Component {
  static propTypes = {
    children: PropTypes.string,
  }

  static contextTypes = {
    form: PropTypes.object.isRequired,
  }

  handleClick(e) {
    e.preventDefault();
    this.context.form.onValues({});
  }

  render() {
    return <button {...this.props} onClick={e => this.handleClick(e)}>{this.props.children || 'Reset'}</button>;
  }
}

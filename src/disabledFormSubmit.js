import React, { Component, PropTypes } from 'react';

export default class DisabledFormSubmit extends Component {
  static contextTypes = {
    form: PropTypes.object,
  }

  render() {
    return <input type="submit" disabled={!this.context.form.isValid()} {...this.props}/>;
  }
}

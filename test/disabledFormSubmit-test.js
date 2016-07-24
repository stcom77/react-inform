import { expect } from 'chai';
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';

import DisabledFormSubmit from '../src/disabledFormSubmit';

describe('DisabledFormSubmit', () => {
  let context;
  const extraProps = {
    foo: 'bar',
  };
  let output;
  let render;

  beforeEach(() => {
    const renderer = createRenderer();
    render = () => {
      renderer.render(
        <DisabledFormSubmit {...extraProps} />,
        context
      );
      output = renderer.getRenderOutput();
    };
  });

  describe('when the form is valid', () => {
    beforeEach(() => {
      context = {
        form: {
          isValid: () => true,
        },
      };
      render();
    });

    it('renders an input', () => {
      expect(output.type).to.equal('input');
    });

    it('passes extra props through', () => {
      expect(output.props.foo).to.equal('bar');
    });

    it('is enabled', () => {
      expect(output.props.disabled).to.equal(false);
    });
  });

  describe('when the form is invalid', () => {
    beforeEach(() => {
      context = {
        form: {
          isValid: () => false,
        },
      };
      render();
    });

    it('renders an input', () => {
      expect(output.type).to.equal('input');
    });

    it('passes extra props through', () => {
      expect(output.props.foo).to.equal('bar');
    });

    it('is disabled', () => {
      expect(output.props.disabled).to.equal(true);
    });
  });
});


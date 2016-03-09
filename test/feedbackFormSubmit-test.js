import expect from 'expect';
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { spy } from 'sinon';

import FeedbackFormSubmit from '../src/feedbackFormSubmit';

describe('FeedbackFormSubmit', () => {
  let context;
  const extraProps = {
    foo: 'bar',
    onClick: spy(),
    onInvalid: spy(),
  };
  let output;
  let render;

  beforeEach(() => {
    const renderer = createRenderer();
    render = () => {
      renderer.render(
        <FeedbackFormSubmit
          {...extraProps} />,
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
          forceValidate: spy(),
        },
      };
      render();
    });

    it('renders an input', () => {
      expect(output.type).toEqual('input');
    });

    it('passes extra props through', () => {
      expect(output.props.foo).toEqual('bar');
    });

    describe('when clicked', () => {
      let event;
      beforeEach(() => {
        event = {
          preventDefault: spy(),
        };
        output.props.onClick(event);
      });

      it('does not call call preventDefault', () => {
        expect(event.preventDefault.called).toEqual(false);
      });

      it('does not call call forceValidate', () => {
        expect(context.form.forceValidate.called).toEqual(false);
      });

      it('calls the passed onClick handled', () => {
        expect(extraProps.onClick.calledWith(event)).toEqual(true);
      });

      it('does not call the passed onInvalid handled', () => {
        expect(extraProps.onInvalid.called).toEqual(false);
      });
    });
  });

  describe('when the form is invalid', () => {
    beforeEach(() => {
      context = {
        form: {
          isValid: () => false,
          forceValidate: spy(),
        },
      };
      render();
    });

    it('renders an input', () => {
      expect(output.type).toEqual('input');
    });

    it('passes extra props through', () => {
      expect(output.props.foo).toEqual('bar');
    });

    describe('when clicked', () => {
      let event;
      beforeEach(() => {
        event = {
          preventDefault: spy(),
        };
        output.props.onClick(event);
      });

      it('calls preventDefault', () => {
        expect(event.preventDefault.called).toEqual(true);
      });

      it('calls forceValidate', () => {
        expect(context.form.forceValidate.called).toEqual(true);
      });

      it('calls the passed onClick handled', () => {
        expect(extraProps.onClick.calledWith(event)).toEqual(true);
      });

      it('calls the passed onInvalid handled', () => {
        expect(extraProps.onInvalid.calledWith(event)).toEqual(true);
      });
    });
  });
});


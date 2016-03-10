import expect from 'expect';
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { spy } from 'sinon';

import ResetFormButton from '../src/resetFormButton';

describe('ResetFormButton', () => {
  let context;
  let extraProps;
  let output;
  let render;

  beforeEach(() => {
    context = {
      form: {},
    };
    extraProps = {
      foo: 'bar',
    };
    const renderer = createRenderer();
    render = () => {
      renderer.render(
        <ResetFormButton
          {...extraProps} />,
          context
      );
      output = renderer.getRenderOutput();
    };
  });

  describe('when a child is passed', () => {
    beforeEach(() => {
      extraProps = {...extraProps, children: 'Test'};
      render();
    });

    it('renders a button', () => {
      expect(output.type).toEqual('button');
    });

    it('its children is the passed child', () => {
      expect(output.props.children).toEqual('Test');
    });
  });

  describe('when no child is passed', () => {
    beforeEach(() => {
      render();
    });

    it('renders a button', () => {
      expect(output.type).toEqual('button');
    });

    it('its child is the text "Reset"', () => {
      expect(output.props.children).toEqual('Reset');
    });
  });

  describe('when the button is clicked', () => {
    let event;
    beforeEach(() => {
      context = {
        form: {
          onValues: spy(),
        },
      };
      render();
      event = {
        preventDefault: spy(),
      };
      output.props.onClick(event);
    });

    it('calls preventDefault', () => {
      expect(event.preventDefault.called).toEqual(true);
    });

    it('calls the forms onValues with an empty array', () => {
      expect(context.form.onValues.calledWith({})).toEqual(true);
    });
  });
});


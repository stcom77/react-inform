import { expect } from 'chai';
import React from 'react';
import { spy } from 'sinon';
import { mount } from 'enzyme';

import ResetFormButton from '../src/resetFormButton';

describe('ResetFormButton', () => {
  let context;
  let props;
  const render = () => mount(<ResetFormButton {...props} />, { context });

  beforeEach(() => {
    props = {
      value: 'bar',
    };
    context = { form: {} };
  });

  describe('when a child is passed', () => {
    beforeEach(() => {
      props = { ...props, children: 'Test' };
    });

    it('renders a button', () => {
      expect(render().find('button').name()).to.equal('button');
    });

    it('its children is the passed child', () => {
      expect(render().text()).to.equal('Test');
    });
  });

  describe('when no child is passed', () => {
    it('renders a button', () => {
      expect(render().find('button').name()).to.equal('button');
    });

    it('its child is the text "Reset"', () => {
      expect(render().text()).to.equal('Reset');
    });
  });

  describe('when the button is clicked', () => {
    const clicked = () => {
      const comp = render();
      comp.simulate('click');
      return comp;
    };

    beforeEach(() => {
      context = {
        form: {
          onValues: spy(),
        },
      };
    });

    it('calls the forms onValues with an empty array', () => {
      clicked();
      expect(context.form.onValues.calledWith({})).to.equal(true);
    });
  });
});


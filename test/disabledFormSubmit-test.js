import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';

import DisabledFormSubmit from '../src/disabledFormSubmit';

describe('DisabledFormSubmit', () => {
  let props;
  let context;
  const render = () => mount(<DisabledFormSubmit {...props} />, { context });

  beforeEach(() => {
    props = {
      foo: 'bar',
    };
  });

  describe('when the form is valid', () => {
    beforeEach(() => {
      context = {
        form: {
          isValid: () => true,
        },
      };
    });

    it('renders an input', () => {
      expect(render().find('input').name()).to.equal('input');
    });

    it('passes extra props through', () => {
      expect(render().find('input').props().foo).to.equal('bar');
    });

    it('is enabled', () => {
      expect(render().find('input').props().disabled).to.equal(false);
    });
  });

  describe('when the form is invalid', () => {
    beforeEach(() => {
      context = {
        form: {
          isValid: () => false,
        },
      };
    });

    it('renders an input', () => {
      expect(render().find('input').name()).to.equal('input');
    });

    it('passes extra props through', () => {
      expect(render().find('input').props().foo).to.equal('bar');
    });

    it('is disabled', () => {
      expect(render().find('input').props().disabled).to.equal(true);
    });
  });
});


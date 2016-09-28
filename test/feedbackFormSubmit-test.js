import { expect } from 'chai';
import React from 'react';
import { spy } from 'sinon';
import { mount } from 'enzyme';

import FeedbackFormSubmit from '../src/feedbackFormSubmit';

describe('FeedbackFormSubmit', () => {
  let context;
  let props;
  const render = () => mount(<FeedbackFormSubmit {...props} />, { context });

  beforeEach(() => {
    props = {
      value: 'bar',
      onClick: spy(),
      onInvalid: spy(),
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
    });

    it('renders an input', () => {
      expect(render().find('input').name()).to.equal('input');
    });

    it('passes extra props through', () => {
      expect(render().find('input').props().value).to.equal('bar');
    });

    describe('when clicked', () => {
      const clicked = () => {
        const comp = render();
        comp.simulate('click');
        return comp;
      };

      it('does not call call forceValidate', () => {
        clicked();
        expect(context.form.forceValidate.called).to.equal(false);
      });

      it('calls the passed onClick handled', () => {
        clicked();
        expect(props.onClick.called).to.equal(true);
      });

      it('does not call the passed onInvalid handled', () => {
        clicked();
        expect(props.onInvalid.called).to.equal(false);
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
    });

    it('renders an input', () => {
      expect(render().find('input').name()).to.equal('input');
    });

    it('passes extra props through', () => {
      expect(render().find('input').props().value).to.equal('bar');
    });

    describe('when clicked', () => {
      const clicked = () => {
        const comp = render();
        comp.simulate('click');
        return comp;
      };

      it('calls forceValidate', () => {
        clicked();
        expect(context.form.forceValidate.called).to.equal(true);
      });

      it('calls the passed onClick handled', () => {
        clicked();
        expect(props.onClick.called).to.equal(true);
      });

      it('calls the passed onInvalid handled', () => {
        clicked();
        expect(props.onInvalid.called).to.equal(true);
      });
    });
  });
});


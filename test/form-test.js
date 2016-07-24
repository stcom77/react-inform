import { expect } from 'chai';
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { spy } from 'sinon';

import form from '../src/form';

const fields = ['field'];
const validate = ({ field }) => {
  const errors = {};
  if (!field) errors.field = 'REQUIRED';
  else if (field === 'INVALID') errors.field = 'FIELD INVALID';
  return errors;
};

function MyForm() {
}


describe('form', () => {
  let props;
  let render;
  let update;
  let renderer;
  let output;
  let instance;
  let WrappedForm;

  beforeEach(() => {
    WrappedForm = form({ fields, validate })(MyForm);
    props = { foo: 'bar' };
    update = () => {
      renderer.render(<WrappedForm {...props} />);
      output = renderer.getRenderOutput();
      // eslint-disable-next-line no-underscore-dangle
      instance = renderer._instance._instance;
    };
    render = () => {
      renderer = createRenderer();
      update();
    };
  });

  describe('when rendered', () => {
    beforeEach(() => {
      render();
    });

    it('renders the underlying class', () => {
      expect(output.type).to.equal(MyForm);
    });

    it('passes extra props through', () => {
      expect(output.props.foo).to.equal('bar');
    });

    it('does not pass errors before change / blur', () => {
      expect(output.props.fields.field.error).to.equal(undefined);
    });
  });

  describe('fields', () => {
    describe('onChange', () => {
      describe('when there is not a value prop', () => {
        beforeEach(() => {
          render();
          output.props.fields.field.onChange('newValue');
          update();
        });

        it('changes the value prop', () => {
          expect(output.props.fields.field.value).to.equal('newValue');
        });
      });

      describe('when there is a value prop', () => {
        beforeEach(() => {
          props = {
            value: {
              field: 'staticValue',
            },
          };
          render();
          output.props.fields.field.onChange('newValue');
          update();
        });

        it('does not change the value prop', () => {
          expect(output.props.fields.field.value).to.equal('staticValue');
        });
      });

      describe('when changed to a boolean value', () => {
        beforeEach(() => {
          render();
          output.props.fields.field.onChange(true);
          update();
        });

        it('passes the checked property', () => {
          expect(output.props.fields.field.checked).to.equal(true);
        });

        describe('when changed to a string later', () => {
          beforeEach(() => {
            render();
            output.props.fields.field.onChange('anything');
            update();
          });

          it('removes the checked property', () => {
            expect(output.props.fields.field.checked).to.equal(undefined);
          });
        });
      });
    });

    describe('asyncValidation', () => {
      describe('when the value is invalid', () => {
        beforeEach(() =>
          new Promise(resolve => {
            function asyncValidate(values) {
              const errors = validate(values);
              return Promise.resolve(errors).then(err => {
                process.nextTick(() => {
                  update();
                  resolve();
                });
                return err;
              });
            }
            WrappedForm = form({ fields, validate: asyncValidate })(MyForm);
            render();
            output.props.fields.field.onBlur();
          })
        );

        it('passes down the error property', () => {
          expect(output.props.fields.field.error).to.equal('REQUIRED');
        });
      });
    });

    describe('onBlur', () => {
      describe('when the value is invalid', () => {
        beforeEach(() => {
          render();
          output.props.fields.field.onBlur();
          update();
        });

        it('passes down the error property', () => {
          expect(output.props.fields.field.error).to.equal('REQUIRED');
        });
      });

      describe('when the value is valid', () => {
        beforeEach(() => {
          render();
          instance.setValues({ field: 'valid' });
          output.props.fields.field.onBlur();
          update();
        });

        it('passes down the error property', () => {
          expect(output.props.fields.field.error).to.equal(undefined);
        });
      });
    });
  });

  describe('form prop', () => {
    describe('isValid', () => {
      describe('when there are errors', () => {
        beforeEach(() => {
          props = {
            value: {
              field: '',
            },
          };
          render();
        });

        it('returns false', () => {
          expect(output.props.form.isValid()).to.equal(false);
        });
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          props = {
            value: {
              field: 'valid',
            },
          };
          render();
        });

        it('returns true', () => {
          expect(output.props.form.isValid()).to.equal(true);
        });
      });
    });

    describe('forceValidate', () => {
      describe('when the field is invalid', () => {
        beforeEach(() => {
          render();
          output.props.form.forceValidate();
          update();
        });

        it('returns false', () => {
          expect(output.props.fields.field.error).to.equal('REQUIRED');
        });
      });
    });

    describe('values', () => {
      beforeEach(() => {
        render();
        output.props.fields.field.onChange('test');
        update();
      });

      it('returns the values', () => {
        expect(output.props.form.values()).to.deep.equal({ field: 'test' });
      });
    });

    describe('onValues', () => {
      describe('when there is no value prop', () => {
        beforeEach(() => {
          props = {
            onChange: spy(),
          };
          render();

          output.props.form.onValues({ field: 'INVALID' });
          update();
        });

        it('calls the onChange listener', () => {
          expect(props.onChange.calledOnce).to.equal(true);
          expect(props.onChange.calledWith({ field: 'INVALID' })).to.equal(true);
        });

        it('changes the values', () => {
          expect(output.props.form.values()).to.deep.equal({ field: 'INVALID' });
        });

        it('detects invalid form state', () => {
          expect(output.props.form.isValid()).to.equal(false);
        });

        describe('when there is a value already set by onValues()', () => {
          beforeEach(() => {
            props = {
              onChange: spy(),
            };
            render();

            output.props.form.onValues({ field: 'VALID' });
            update();
            output.props.form.onValues({ field: 'INVALID' });
            update();
          });

          it('calls the onChange listener', () => {
            expect(props.onChange.calledTwice).to.equal(true);
            expect(props.onChange.firstCall.calledWith({ field: 'VALID' })).to.equal(true);
            expect(props.onChange.secondCall.calledWith({ field: 'INVALID' })).to.equal(true);
          });

          it('changes the values', () => {
            expect(output.props.form.values()).to.deep.equal({ field: 'INVALID' });
          });

          it('detects invalid form state', () => {
            expect(output.props.form.isValid()).to.equal(false);
          });
        });
      });

      describe('when there is a value prop', () => {
        beforeEach(() => {
          props = {
            value: {
              field: 'staticValue',
            },
            onChange: spy(),
          };
          render();
          output.props.form.onValues({ field: 'VALID' });
          update();
        });

        it('does not change the values', () => {
          expect(output.props.form.values()).to.deep.equal({ field: 'staticValue' });
        });

        it('calls the onChange listener', () => {
          expect(props.onChange.calledOnce).to.equal(true);
          expect(props.onChange.calledWith({ field: 'VALID' })).to.equal(true);
        });
      });
    });
  });

  describe('props from parent', () => {
    describe('onValidate', () => {
      beforeEach(() => {
        props = {
          onValidate: spy(),
        };
      });

      describe('when fields are valid', () => {
        beforeEach(() => {
          props = {
            ...props,
            value: {
              field: 'valid',
            },
          };
          render();
        });

        it('is called with true', () => {
          expect(props.onValidate.calledWith(true)).to.equal(true);
        });
      });

      describe('when fields are invalid', () => {
        beforeEach(() => {
          render();
        });

        it('is called with false', () => {
          expect(props.onValidate.calledWith(false)).to.equal(true);
        });
      });

      describe('when fields are invalid multiple times in a row', () => {
        beforeEach(() => {
          render();
          props.value = {
            field: 'INVALID',
          };
          update();
        });

        it('is called with false', () => {
          expect(props.onValidate.calledOnce).to.equal(true);
        });
      });
    });
  });
});


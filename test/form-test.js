import expect from 'expect';
import React, { Component } from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { spy } from 'sinon';

import form from '../src/form';

const fields = ['field'];
const validate = ({field}) => {
  const errors = {};
  if (!field) errors.field = 'REQUIRED';
  else if (field === 'INVALID') errors.field = 'FIELD INVALID';
  return errors;
};

class MyForm extends Component {
}

const WrappedForm = form({fields, validate})(MyForm);

describe('form', () => {
  let props;
  let render;
  let update;
  let renderer;
  let output;
  let instance;

  beforeEach(() => {
    props = {foo: 'bar'};
    update = () => {
      renderer.render(<WrappedForm {...props} />);
      output = renderer.getRenderOutput();
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
      expect(output.type).toEqual(MyForm);
    });

    it('passes extra props through', () => {
      expect(output.props.foo).toEqual('bar');
    });

    it('does not pass errors before change / blur', () => {
      expect(output.props.fields.field.error).toEqual(undefined);
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
          expect(output.props.fields.field.value).toEqual('newValue');
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
          expect(output.props.fields.field.value).toEqual('staticValue');
        });
      });

      describe('when changed to a boolean value', () => {
        beforeEach(() => {
          render();
          output.props.fields.field.onChange(true);
          update();
        });

        it('passes the checked property', () => {
          expect(output.props.fields.field.checked).toEqual(true);
        });

        describe('when changed to a string later', () => {
          beforeEach(() => {
            render();
            output.props.fields.field.onChange('anything');
            update();
          });

          it('removes the checked property', () => {
            expect(output.props.fields.field.hasOwnProperty('checked')).toEqual(false);
          });
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
          expect(output.props.fields.field.error).toEqual('REQUIRED');
        });
      });

      describe('when the value is valid', () => {
        beforeEach(() => {
          render();
          instance.values.field = 'valid';
          output.props.fields.field.onBlur();
          update();
        });

        it('passes down the error property', () => {
          expect(output.props.fields.field.error).toEqual(undefined);
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
          expect(output.props.form.isValid()).toEqual(false);
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
          expect(output.props.form.isValid()).toEqual(true);
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
          expect(output.props.fields.field.error).toEqual('REQUIRED');
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
        expect(output.props.form.values()).toEqual({field: 'test'});
      });
    });

    describe('onValues', () => {
      describe('when there is no value prop', () => {
        beforeEach(() => {
          render();
          output.props.form.onValues({field: 'newValue'});
          update();
        });

        it('changes the values', () => {
          expect(output.props.form.values()).toEqual({field: 'newValue'});
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
          output.props.form.onValues({field: 'newValue'});
          update();
        });

        it('does not change the values', () => {
          expect(output.props.form.values()).toEqual({field: 'staticValue'});
        });

        it('calls the onChange listener', () => {
          expect(props.onChange.calledWith({field: 'newValue'})).toEqual(true);
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
          expect(props.onValidate.calledWith(true)).toEqual(true);
        });
      });

      describe('when fields are invalid', () => {
        beforeEach(() => {
          render();
        });

        it('is called with false', () => {
          expect(props.onValidate.calledWith(false)).toEqual(true);
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
          expect(props.onValidate.calledOnce).toEqual(true);
        });
      });
    });
  });
});


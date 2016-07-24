import { expect } from 'chai';
import createValidate from '../src/createValidate';

describe('createValidate', () => {
  describe('when given a basic rule', () => {
    const rulesMap = {
      field: {
        'is not valid': value => value !== 'INVALID',
      },
    };
    const validate = createValidate(rulesMap);

    describe('when the field is invalid', () => {
      const object = {
        field: 'INVALID',
      };

      it('returns an error for the field', () => {
        expect(validate(object).field).to.equal('is not valid');
      });
    });

    describe('when the field is valid', () => {
      const object = {
        field: 'VALID',
      };

      it('returns no errors', () => {
        expect(validate(object)).to.deep.equal({});
      });
    });
  });

  describe('when rule is async', () => {
    const rulesMap = {
      field: {
        'is not valid': value => Promise.resolve(value !== 'INVALID'),
      },
    };
    const validate = createValidate(rulesMap);

    describe('when the field is invalid', () => {
      const object = {
        field: 'INVALID',
      };

      it('returns an error for the field', () =>
        validate(object).then(errors => {
          expect(errors.field).to.equal('is not valid');
        })
      );
    });

    describe('when the field is valid', () => {
      const object = {
        field: 'VALID',
      };

      it('returns no errors', () =>
        validate(object).then(errors => {
          expect(errors).to.deep.equal({});
        })
      );
    });
  });

  describe('when given a rule involving other fields', () => {
    const rulesMap = {
      field: {
        'is not valid': (value, { field2 }) => value === field2,
      },
    };
    const validate = createValidate(rulesMap);

    describe('when the field is invalid', () => {
      const object = {
        field: 'one',
        field2: 'two',
      };

      it('returns an error for the field', () => {
        expect(validate(object).field).to.equal('is not valid');
      });
    });

    describe('when the field is valid', () => {
      const object = {
        field: 'one',
        field2: 'one',
      };

      it('returns no errors', () => {
        expect(validate(object)).to.deep.equal({});
      });
    });
  });
});

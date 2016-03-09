import expect from 'expect';

import from from '../src/from';

describe('from', () => {
  const ruleMap = { a: {}, b: {} };

  describe('when passed a rule map with fields', () => {
    it('creates the fields property', () => {
      expect(from(ruleMap).fields).toEqual(['a', 'b']);
    });
  });

  describe('when passed a rule map with validations', () => {
    const output = 'VALIDATE OUTPUT';

    beforeEach(() => {
      from.__Rewire__('createValidate', () => {
        return output;
      });
    });

    afterEach(() => from.__ResetDependency__('createValidate'));

    it('creates a validate property', () => {
      expect(from(ruleMap).validate).toEqual(output);
    });
  });
});

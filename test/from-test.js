import { expect } from 'chai';

import from from '../src/from';

describe('from', () => {
  const ruleMap = { a: {}, b: {} };

  describe('when passed a rule map with fields', () => {
    it('creates the fields property', () => {
      expect(from(ruleMap).fields).to.deep.equal(['a', 'b']);
    });
  });

  describe('when passed a rule map with validations', () => {
    const output = 'VALIDATE OUTPUT';

    beforeEach(() => {
      // eslint-disable-next-line no-underscore-dangle
      from.__Rewire__('createValidate', () => output);
    });

    // eslint-disable-next-line no-underscore-dangle
    afterEach(() => from.__ResetDependency__('createValidate'));

    it('creates a validate property', () => {
      expect(from(ruleMap).validate).to.equal(output);
    });
  });
});

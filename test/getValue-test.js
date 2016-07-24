import { expect } from 'chai';

import getValue from '../src/getValue';

describe('getValue', () => {
  describe('when the event is not a browser event', () => {
    describe('when the event has a value property', () => {
      const event = {
        value: 'event value',
      };

      it('returns the event\'s value', () => {
        expect(getValue(event)).to.equal('event value');
      });
    });

    describe('when the event does not have a value property', () => {
      const event = 'event value';

      it('returns the event\'s value', () => {
        expect(getValue(event)).to.equal('event value');
      });
    });
  });

  describe('when the event is a browser event', () => {
    const eventStarter = { stopPropagation: true, preventDefault: true };

    describe('when the event is a checkbox event', () => {
      const event = { ...eventStarter, target: { type: 'checkbox', checked: true } };

      it('returns the checked property', () => {
        expect(getValue(event)).to.equal(true);
      });
    });

    describe('when the event is a file event', () => {
      const event = {
        ...eventStarter,
        target: { type: 'file' },
        dataTransfer: { files: 'event value' },
      };

      it('returns the checked property', () => {
        expect(getValue(event)).to.equal('event value');
      });
    });

    describe('when the event is a select-multiple event', () => {
      const event = {
        ...eventStarter,
        target: {
          type: 'select-multiple',
          options: [
            { value: 'event', selected: true },
            { value: 'bad', selected: false },
            { value: 'value', selected: true },
          ],
        },
      };

      it('returns the selected options', () => {
        expect(getValue(event)).to.deep.equal(['event', 'value']);
      });
    });

    describe('when the event is not of these types', () => {
      const event = {
        ...eventStarter,
        target: { value: 'event value' },
      };

      it('returns the value property', () => {
        expect(getValue(event)).to.equal('event value');
      });
    });
  });
});

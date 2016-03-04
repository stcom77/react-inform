import createValidate from './createValidate';

export default function from(rules) {
  return {
    fields: Object.keys(rules),
    validate: createValidate(rules),
  };
}

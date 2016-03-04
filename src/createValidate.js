export default function createValidate(rulesMap) {
  return values => {
    const errors = {};
    Object.keys(rulesMap).forEach(key => {
      const rules = rulesMap[key];
      const value = values[key];

      for (const message in rules) {
        if (rules.hasOwnProperty(message)) {
          const rule = rules[message];
          if (!rule(value, values)) {
            errors[key] = message;
            break;
          }
        }
      }
    });
    return errors;
  };
}

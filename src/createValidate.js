const hasThen = obj => !!obj && obj.then instanceof Function;

function gen(obj, index = 0, keys = Object.keys(obj)) {
  return {
    keys,
    index,
    key: keys[index],
    value: obj[keys[index]],
    next: () => gen(obj, index + 1, keys),
    done: index >= keys.length,
  };
}

function validateField(value, values, rule) {
  if (rule.done) return undefined;
  const result = rule.value(value, values);

  if (hasThen(result)) {
    return result.then(res => {
      if (!res) return rule.key;
      return validateField(value, values, rule.next());
    });
  } else if (!result) return rule.key;
  return validateField(value, values, rule.next());
}


export default function createValidate(rulesMap) {
  return values => {
    const errors = {};
    const promises = [];
    Object.keys(rulesMap).forEach(key => {
      const rules = rulesMap[key];
      const value = values[key];
      const result = validateField(value, values, gen(rules));

      if (hasThen(result)) {
        promises.push(result.then(v => {
          if (v !== undefined) {
            errors[key] = v;
          }
        }));
      } else if (result !== undefined) errors[key] = result;
    });
    if (promises.length === 0) return errors;
    return Promise.all(promises).then(() => errors);
  };
}

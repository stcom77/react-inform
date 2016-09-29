[![Circle CI](https://circleci.com/gh/theadam/react-inform.svg?style=shield)](https://circleci.com/gh/theadam/react-inform)
# react-inform

Forms are not currently fun to work with in React.  There are a lot of form libraries out there, but a lot of them have issues making them a pain to work with.  These issues include:

* You have to use provided input / form components rather than whatever components you want.
* The provided inputs can have bugs and inconsistencies with the built-in components.
* The forms cannot be controlled from outside of the library's components and user input.
* You are forced into using refs to call methods on components.
* Validations are not straightforward, and you cannot validate across fields (like having two different inputs that should have the same value).

`react-inform` is a form library for React that avoids all of these issues.

## Demos

[Simple Form](http://theadam.github.io/react-inform/examples/basic-example/)

[Simple Form With Animations Using mation](http://theadam.github.io/react-inform/examples/mation-example/)

[Form with Async validation](http://theadam.github.io/react-inform/examples/async-example/)

[Dynamic Fields](http://theadam.github.io/react-inform/examples/dynamic-fields/)

[Integration with react-intl v2](https://jsfiddle.net/theadam/d0hypvtz/21/)

## Installation

`npm install --save react-inform`

## Guide

Creating a [simple validating form](https://jsfiddle.net/theadam/Lc3nkx7g/5/embedded/result%2Cjs%2Ccss%2Chtml%2Cresources/) is easy with `react-inform`.

`react-inform` provides a simple decorator.  To that decorator you provide a list of fields in the form, and an optional validate function.  The `validate` function takes in an object where the keys are fieldnames and the values are the values of the fields, and it should return an object where the keys are fieldnames and the values are error strings.

We can configure a simple form that has the fields `username`, `password`, and `confirmPassword`.  This form will just validate that the `username` and `password` exist and that `confirmPassword` matches the password.  First just create the fields and validate function.  There is a helper function to aid in creating these validate functions, but for now, we will write one out by hand to get the hang of it.

```jsx
const fields = ['username', 'password', 'confirmPassword'];

const validate = values => {
  const { username, password, confirmPassword } = values;
  const errors = {};

  if (!username) errors.username = 'Username is required!';
  if (!password) errors.password = 'Password is required!';
  if (confirmPassword !== password) errors.confirmPassword = 'Passwords must match!';

  return errors;
}
```

Now that you have the fields and validate function, you can just use the form decorator:

```jsx
import { form } from 'react-inform';

@form({
  fields,
  validate
})
class MyForm extends Component {
...
```

Or you can use form as a function.

```jsx
class MyForm extends Component {
  ...
}

MyForm = form({
  fields,
  validate
})(MyForm);
```

The form function wraps your react component passing a `form` and `fields` property.  The `fields` property can be "plugged into" regular inputs in your render function.  The fields also willl have errors if your validate function returned any!

```jsx
<input type="text" placeholder="Username" {...username.props} />
<span>{username.error}</span>
<input type="password" placeholder="Password" {...password.props} />
<span>{password.error}</span>
<input type="password" placeholder="Confirm Password" {...confirmPassword.props} />
<span>{confirmPassword.error}</span>
```

Simple!  Your form now validates, and keeps track of its state without all the boilerplate!  The complete working example can be seen [here!](https://jsfiddle.net/theadam/Lc3nkx7g/5/embedded/result%2Cjs%2Ccss%2Chtml%2Cresources/)

## Api

### form({ fields, [validate] })

Creates a function used to wrap a react component.  Accepts an object that contains the keys `fields` and optionally `validate`.  `fields` is an array of fieldnames. `validate` is a function used to validate the field values.

The validate function should accept a map of fieldnames to values, and return a map of fieldnames to error strings (or a Promise that resolves to a map of fieldnames to error strings).

#### Accepted properties

* `value`: to control the data in the form from the parent of a form.
* `onChange`: to react to changes to the form in the parent of a form.
* `onValidate`: to react to changes in the validation state of the form.  The callback will be passed a boolean that is `true` when the form becomes valid.
* `fields`: Can be used instead of the `field` key in the decorator to control the list of fields in the form
* `validate`: Can be used instead of the `validate` key in the decorator to control the validate function

#### Properties passed to wrapped components

##### form

Form contains some utility functions to affect the wrapping form.  These include:

* `isValid()`: returns true if all of the fields are valid
* `forceValidate()`: Causes all of the fields to get passed their error properties.  Usually errors are only passed after the field has been "touched" (either after onBlur or onChange).
* `values()`: returns the current value of all the form fields as a map.
* `onValues(values)`: forcefully sets all of the values in the form to the passed values.

##### fields

`fields` is a map of the fields you passed in.  Each field has a value, onChange, and onBlur property so that they can be passed into regular input components and have them be controlled with `react-inform`.  If there is an error message on a field, the field will also have an error property.

All of the props that should be passed to your rendered input component (value, onChange, and onBlur) are also available using the `props` property.  For example:

```jsx
const { fieldName } = this.props.fields;
...
<input type="text" {...fieldName.props} />
```

This keeps react from complaining about unknown props being passed to input components.  See [this link](https://gist.github.com/jimfb/d99e0678e9da715ccf6454961ef04d1b) for more details.

### createValidate(ruleMap)

A helper to create `validate` functions from maps of rules.  Rule functions can return Promises that resolve to booleans to support async validations.

This is an example rule map that ensures that username exists, password exists, and confirmPassword matches password.  Notice the keys to the rules are the error messages that will appear when the field is invalid.

```jsx
const exists = v => Boolean(v);

const ruleMap = {
  username: {
    'Username must exist': exists
  },
  password: {
    'Password must exist': exists
  },
  confirmPassword: {
    'Passwords must match': (value, values) => value === values.password
  }
};
```

### from(rulesMap)

Creates an object that can be passed directly to the form function / decorator using a ruleMap.  All fields must be represented in the ruleMap.  Fields without validations should have empty objects as their values in the rule map.

`@form(from(rulesMap))`

### ResetFormButton

A Component which can be used inside a React Component wrapped with `react-inform`.  When clicked it will reset the form so that it contains no values.

### DisabledFormSubmit

A Component which can be used inside a React Component wrapped with `react-inform`.  It will remain disabled until all of the fields in the form are valid.  Once its enabled, clicking it will submit the form.

### FeedbackFormSubmit

A Component which can be used inside a React Component wrapped with `react-inform`.  When clicked, if the form has invalid fields, it will force those fields' errors to be passed as props.  If the form is valid, it will submit the form.

## License

MIT

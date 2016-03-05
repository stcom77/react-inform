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

## Guide

Creating a [simple validating form](https://jsfiddle.net/theadam/Lc3nkx7g/3/embedded/result%2Cjs%2Ccss%2Chtml%2Cresources/) is easy with `react-inform`.

`react-inform` provides a simple decorator.  To that decorator you provide a list of fields in the form, and an optional validate function.  The `validate` function takes in an object where the keys are fieldnames and the values are the values of the fields, and it should return an object where the keys are fieldnames and the values are error strings.

We can configure a simple form that has the fields `username`, `password`, and `confirmPassword`.  This form will just validate that the `username` and `password` exist and that `confirmPassword` matches the password.  First just create the fields and validate function.

```js
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

```js
import { form } from 'react-inform';

@form({
  fields,
  validate
})
class MyForm extends Component {
...
```

Or you can use form as a function.

```js
class MyForm extends Component {
  ...
}

MyForm = form({
  fields,
  validate
})(MyForm);
```

The form function wraps your react component passing a `form` and `fields` property.  The `fields` property can be "plugged into" regular inputs in your render function.  The fields also willl have errors if your validate function returned any!

```js
<input type="text" placeholder="Username" {...username}/>
<span>{username.error}</span>
<input type="password" placeholder="Password" {...password}/>
<span>{password.error}</span>
<input type="password" placeholder="Confirm Password" {...confirmPassword}/>
<span>{confirmPassword.error}</span>
```

Simple!  Your form now validates, and keeps track of its state without all the boilerplate!  The complete working example can be seen [here!](https://jsfiddle.net/theadam/Lc3nkx7g/3/embedded/result%2Cjs%2Ccss%2Chtml%2Cresources/)

## Api

### form({ fields, [validate] })

Creates a function used to wrap a react component.  Accepts an object that contains the keys `fields` and optionally `validate`.  `fields` is an array of fieldnames. `validate` is a function used to validate the field values.

The validate function should accept a map of fieldnames to values, and return a map of fieldnames to error strings.

#### Accepted properties

* `formData`: to control the data in the form from the parent of a form.
* `onChange`: to react to changes to the form in the parent of a form.

#### Properties passed to wrapped components

##### form

Form contains some utility functions to affect the wrapping form.  These include:

* `isValid()`: returns trus if all of the fields are valid
* `forceValidate()`: Causes all of the fields to get passed their error properties.  Usually errors are only passed after the field has been "touched" (either after onBlur or onChange).
* `value()`: returns the current value of all the form fields as a map.
* `onValues(values)`: forcefully sets all of the values in the form to the passed values.

##### fields

`fields` is a map of the fields you passed in.  Each field has a value, onChange, onFocus, and onBlur property so that they can be passed into regular input components and have them be controlled with `react-inform`.  If there is an error message on a field, the field will also have an error property.

### createValidate(ruleMap)

A helper to create `validate` functions from maps of rules.

This is an example rule map that ensures that username exists, password exists, and confirmPassword matches password.  Notice the keys to the rules are the error messages that will appear when the field is invalid.

```js
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

A Component which can be used inside a React Component wrapped with `react-inform`.  When clicked, if the form has invalid fields, it will force those fields' errors to be passed as props.  If the form is valid, it will submit theform.


# Ember Validation

This library provides validation functionality for ember and non-ember objects.


## Getting Ember Validation

[Get one from here](https://github.com/Dani723/builds/tree/master/ember-validation)

or

[Build it yourself](#how-to-build)

## Example

```js
App.User = Em.Object.extend(Ember.Validation.ValidatorSupport, {

  validator: Ember.Validation.map(function() {
    this.property("name").required().minLength(4);
    this.property("email", "E-Mail").required().mail();
    this.property("age").required().integer().min(18).message("You have to be %@2 to join");
    this.property("zodiac").minLength(4);
  })
});

var user = App.User.create({
    name: 'Mike',
    email: 'mike@foo.bar',
    age: 20
});

var result = user.validate();
if(result.get('isValid')) {
    ...
} else {
    ...
}
```

## Usage


### The ObjectValidator

The ObjectValidator is the heart of Ember Validation and can be created with Ember.Validation.map(...);

```js
var validator = Ember.Validation.map(function() {
    ...
});
```

To add validation rules for specific properties, call the property() method of the callback's context.
These rules can be chained together. The built-in rules are listed below (see [Built in rules](#built-in-rules)).
It is also possible to define own rules (see [Custom rules](#custom-rules)).

```js
var validator = Ember.Validation.map(function() {
    this.property("name").required().minLength(4);
});
```

For the error messages the first character of the property name is capitalized. It is also possible to set the
name via the second argument.

```js
var validator = Ember.Validation.map(function() {
    this.property("name").required().minLength(4);          // error message: Name is required
    this.property("email", "E-Mail").required().mail();     // error message: E-Mail is required
});
```

In this example we ensure that a name with at least 4 characters and a valid mail address is set.
Call the validate() method of the validator to start the validation process.

```js
var validator = Ember.Validation.map(function() {
    this.property("name").required().minLength(4);
    this.property("email", "E-Mail").required().mail();
});

var user = {
    name: 'Mike',
    email: 'mike@foo.bar'
};

var result = validator.validate(user);
```

The validate() method returns a ValidationResult-Object which is explained later.

### The ValidatorSupport Mixin

The Ember.Validation.ValidatorSupport Mixin adds validation functionality to ember objects

```js
App.User = Em.Object.extend(Ember.Validation.ValidatorSupport, { ... });
```

The ValidatorSupport Mixin requires a 'validator' property representing an instance of Ember.Validation.ObjectValidator.

```js
App.User = Ember.Object.extend({

    validator: Ember.Validation.map(function() {
       this.property("name").required().minLength(4);
       this.property("email", "E-Mail").required().mail();
    }),

    ...
});

var user = {
    name: 'Mike',
    email: 'mike@foo.bar'
};

var result = user.validate();
```

To check if a validation already took place, use the 'validated' property.

```js
var isValidated = user.get('isValidated');
```

### The validation results

The result of each validation is represented by an ValidationResult-Object, which is returned by the validate() method
and also stored in the validationResult-property of the validated object when the ValidatorSupport Mixin is used.

The most important properties for sure are 'isValid' and 'hasError' which simply can be true or false.

```js
var isValid = result.get('isValid');
var hasError = result.get('hasError');
```
or
```js
var isValid = user.get('validationResult.isValid');
var hasError = user.get('validationResult.hasError');
```

As the usage of these properties is pretty common, they are also provided directly by the validated object

```js
var isValid = user.get('isValid');
var hasError = user.get('hasError');
```

An array with a list of all occurred errors can be obtained via the 'errors' property.

```js
var errors = result.get('errors');
```
or
```js
var errors = user.get('validationResult.errors');
```

To get the result of a specific property just use its name as a key

```js
var isValid = result.get('name.isValid');
var error = result.get('name.error');
```
or
```js
var isValid = user.get('validationResult.name.isValid');
var error = user.get('validationResult.name.error');
```

## Built in rules

* required() - checks if there is a value
* number() - checks if value is a numeric
* integer() - checks if value is an integer
* min(5) -  checks if value is greater than or equal to 5
* max(10) -  checks if value is less than or equal to 10
* range(5, 10) -  checks if value is greater than or equal to 5 and less than or equal to 10
* string() - checks if value is a string
* mail() - checks if value is a valid mail address
* minLength(5) -  checks if value has at least 5 characters
* maxLength(10) -  checks if value has at most 10 characters
* length(5, 10) -  checks if value has at least 5 characters and at most 10 characters
* equals('foo') - checks if value equals 'foo'
* match(/myregex/) - checks if value matches the regular expression
* noMatch(/myregex/) - checks if value doesn't match the regular expression

It is also possible to use functions as a value. When the property is validated the function is called and the return
value is used for validation.

```js
var territory = 'US'; // can change
...
this.property("age").required().integer().min(function(){
  if(territory === 'US') {
    return 21;
  } else {
    return 18;
  }
});
```

## Error messages

The default error messages can be overridden.
To do so, call the message() method after the corresponding rule.

```js
this.property("email", "E-Mail")
        .required().message('A mail address is required')
        .mail().message('Mail address not valid');
```

A global message for all rules of a property can be set as follows

```js
this.property("email", "E-Mail").message('A valid mail address is required')
        .required()
        .mail();
```


## The ValidatorViewSupport Mixin

This mixin binds to any object with the ValidatorSupport Mixin.
It tries to acquire the validation object and property by examining the valueBinding. It is also possible to manually set
the 'validationProperty' and 'validationObject' properties.

On each validation event the 'validationResult' of the view is automatically updated.

An implementation which sets the class of the view to 'error' and writes the error message in the 'data-error' attribute
can be done as follows:

```js
App.ValidatorTextField = Ember.TextField.extend(Ember.Validation.ValidatorViewSupport, {

  classNameBindings:['validationResult.hasError:error:'],
  attributeBindings:['data-error'],

  'data-error': function(){
    return this,get('validationResult.error')
  }.property('validationResult'),

  focusOut : function(event) {
    this._super();
    this.validate();
  }
});
```

Please take a look at the example for further information on usage.

## Custom rules

### The custom() rule

A quick way to implement any custom rule is to make use of the custom() rule.

```js
this.property("name").required().custom(function(value){
    return value === value.toUpperCase();
}).message("String must be upper case");
```

### Adding a chainable custom rule

Every custom rule must extend from Ember.Validation.BaseRule.
The validate() method must be overridden. Its also possible to define a error message.
The placeholder for the property name is %@1. The parameter placeholders are %@2, %@3, ...

```js
Ember.Validation.CaseRule = Ember.Validation.BaseRule.extend({
    message:"String in @1 must be @2 case",
    validate: function(value, case) {
        if(case==='upper') {
            return value === value.toUpperCase();
        } else {
            return value === value.toLowerCase();
        }
    }
});
```

Call the registerRule() method to make a custom rule available for chaining:

```js
Ember.Validation.registerRule("case", Ember.Validation.CaseRule);
```

Now you can use your custom rule the same way as the built in rules.

```js
this.property("name").required().case('lower');
```

## How to build

You need to have node/npm and grunt installed to build Ember Validation.

Grunt should be installed globally

```bash
npm install -g grunt-cli
```

Clone a copy of the Ember Validation git repo

```bash
git clone git://github.com/Dani723/ember-validation.git
```

Now enter the directory and install the node dependencies

```bash
cd ember-validation && npm install
```

start 'grunt' to get a compressed and uncompressed version of Ember Validation,

```bash
grunt
```

Both versions of Ember Validation will be put in the 'dist' directory

### License

Licensed under MIT license
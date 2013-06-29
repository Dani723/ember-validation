var get = Ember.get, set = Ember.set, toType = Ember.Validation.toType;

/**
 The ValueValidator stores a bunch of validators.
 the first validation error aborts the validation process and return the result
 @class Ember.Validation.ValueValidator
 */
Ember.Validation.ValueValidator = Ember.Object.extend({

  rules: null,

  init: function() {
    this._super();
    set(this, 'rules', []);
  },

  /**
   adds a validator
   @method addValidator
   @param rule {SubClass of BaseRule} ruke to add
   */
  addRule: function(rule) {
    get(this, 'rules').push(rule);
  },

  /**
   validates the value with the validators
   the first validation error aborts the validation process and return the result
   @method validate
   @param value {Object} the value to validate
   @param obj {String} context of the validators
   @return {Ember.Validation.Result}
   */
  validate: function(value, obj) {

    var result = Ember.Validation.Result.create();

    var rules = get(this, 'rules');

    for (var i=0; i<rules.length; i++) {

      //todo find better way
      set(rules[i], 'context', obj);

      var valid = rules[i].validate(value, obj);
      if(!valid  || rules[i].override) {
        if(!valid) {
          var error = get(rules[i], 'error');
          result.setError(error);
        }
        break;
      }
    }

    return result;
  }
});
var get = Ember.get, set = Ember.set;

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

    var vresult = Ember.Validation.Result.create();
    var rules = get(this, 'rules');

    for (var i=0; i<rules.length; i++) {
      var result = rules[i]._validate(value, obj);
      if(!result.isValid) {
        if(!result.isValid) {
          vresult.setError(result.error);
        }
        break;
      }
    }
    return vresult;
  }
});
var get = Ember.get;

Ember.Validation.registerRule = function(method, ruleClass) {

  if(!ruleClass) {
    var ruleName = method.charAt(0).toUpperCase() + method.slice(1) + 'Rule';

    ruleClass = Ember.Validation[ruleName];
    if(!ruleClass) {
      throw new Error("Rule for method " + method + " not found");
    }
  }

  if(!Ember.Validation.BaseRule.detect(ruleClass)) {
    throw new Error("Rule for method " + method + " must extend from Ember.Validation.BaseRule");
  }

  // add a method to the chaining class
  var extChain= {};
  extChain[method] = function() {
    get(this, 'chain').push( {
      ruleClass:ruleClass,
      parameters: Array.prototype.slice.call(arguments, 0),
      message:null
    });
    return this;
  };
  Ember.Validation.Chaining.reopen(extChain);
};

// method mapping for included rules
var includedRules = {
  number:Ember.Validation.NumberRule,
  integer:Ember.Validation.IntegerRule,
  min:Ember.Validation.NumberMinRule,
  max:Ember.Validation.NumberMaxRule,
  range:Ember.Validation.NumberRangeRule,
  custom:Ember.Validation.CustomRule,
  noMatch:Ember.Validation.NoMatchRule,
  match:Ember.Validation.MatchRule,
  string:Ember.Validation.StringRule,
  mail:Ember.Validation.MailRule,
  length:Ember.Validation.TextLengthRule,
  minLength:Ember.Validation.TextMinLengthRule,
  maxLength:Ember.Validation.TextMaxLengthRule,
  equals:Ember.Validation.EqualsRule
};

// register included rules
for(var methodName in includedRules) {
  if(includedRules.hasOwnProperty(methodName)) {
    Ember.Validation.registerRule(methodName, includedRules[methodName]);
  }
}




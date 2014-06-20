var get = Ember.get, set = Ember.set, toType = Ember.Validation.toType, humanize = Ember.Validation.humanize;

/**
 The Chaining object helps to create a ValueValidator in a single statement

 @class Ember.Validation.Chaining
 */
Ember.Validation.Chaining = Ember.Object.extend({

  propertyName: null,
  isRequired:false,
  requiredErrorMessage:null,
  errorMessage:null,

  chain:null,

  init: function() {
    this._super();
    set(this, 'chain', []);
  },

  /**
   * sets the property as required
   *
   * @method required
   * @param {boolean} isRequired Whether or not this field is required. If a function is passed in then it 
   * will be run every time the field is validated (which allows it to be dependant on other properties of
   * the object)
   */
  required: function(isRequired) {
    if (Ember.isNone(isRequired)) {
      isRequired = true;
    }
    set(this, 'isRequired', isRequired);
    return this;
  },

  /**
   * sets the error message of the last validator in the chain
   *
   * @method message
   * @param {String} msg the message. Use %@1 for the property name and %@2, %@3, ... for the parameters
   */
  message: function(msg) {
    var v = get(this, 'chain').slice(-1)[0];
    // add message to last validator
    if(v) {
      v.message = msg;
    } else {
      // if there is no validator, check if required has been set
      var isRequired = get(this, 'isRequired');
      if (Ember.Validation.toType(isRequired) === 'function') {
        isRequired = isRequired();
      }
      if(isRequired){
        // required is the last validator
        set(this, 'requiredErrorMessage', msg);
      } else {
        // no last validator => set globally
        set(this, 'errorMessage', msg);
      }
    }
    return this;
  },

  /**
   * creates a ValueValidator out of the chain
   *
   * @method createValueValidator
   * @returns {String} msg the message. Use %@1 for the property name and %@2, %@3, ... for the parameters
   */
  createValueValidator: function() {

    var validator = Ember.Validation.ValueValidator.create();

    var propertyName = get(this, 'propertyName');
    var message = get(this, 'errorMessage');
    var requiredMessage = get(this, 'requiredErrorMessage');
    var isRequired = get(this, 'isRequired');
    if (Ember.Validation.toType(isRequired) === 'function') {
      isRequired = isRequired;
    } else {
      isRequired = !!isRequired;
    }

    var req = Ember.Validation.RequiredRule.create({
      propertyName:propertyName,
      parameters:[isRequired]
    });

    if(toType(requiredMessage) === 'string') {
      set(req, 'message', requiredMessage);
    } else if(toType(message) === 'string') {
      set(req, 'message', message);
    }

    validator.addRule(req);

    var chain = get(this, 'chain');
    for(var i=0;i<chain.length;i++) {

      var chainlink = chain[i];

      var rule = chainlink.ruleClass.create({
        propertyName:propertyName
      });

      if(chainlink.parameters && chainlink.parameters.length>0) {
        set(rule, 'parameters', chainlink.parameters);
      }

      if(toType(chainlink.message)==='string') {
        set(rule, 'message', chainlink.message);
      } else if(toType(message)==='string') {
        set(rule, 'message', message);
      }

      validator.addRule(rule);
    }

    return validator;
  },

  /**
   * alias to createValueValidator
   *
   * @method done
   */
  done: function() {
    return this.createValueValidator();
  }

});

/**
 @class Ember.Validation.ChainingContext
 */
Ember.Validation.ChainingContext = Ember.Object.extend({

  items:null,

  init: function() {
    this._super();
    set(this, 'items', {});
  },

  /**
   begins the chaining of a property validator
   @method property
   @return {Ember.Validation.Chain}
   */
  property: function(property, propertyName) {
    var chain = Ember.Validation.Chaining.create({
      propertyName: propertyName || humanize(property)
    });
    get(this, 'items')[property] = chain;
    return chain;
  },

  nested: function(property, validator) {
    if(!Ember.Validation.ObjectValidator.detect(validator)) {
      validator = validator.proto().validator;
    }
    if(Ember.Validation.ObjectValidator.detect(validator)) {
      get(this, 'items')[property] = validator;
    } else {
      //todo: warn
    }
  },

  /**
   create a ObjectValidator out of the ChainingContext
   @method createModelValidator
   @return {Object} ModelValidator
   */
  createObjectValidator: function() {

    var oValidator = Ember.Validation.ObjectValidator.create();

    var items = get(this, 'items');
    for(var property in items) {
      if(items.hasOwnProperty(property)) {
        var item = items[property];
        // when its still a chain, create the ValueValidator
        if(Ember.Validation.Chaining.detectInstance(item)) {
          item = item.createValueValidator();
        }

        if(Ember.Validation.ValueValidator.detectInstance(item) ||
          Ember.Validation.ObjectValidator.detectInstance(item)){
          oValidator.setPropertyValidator(property, item);
        }
      }
    }

    return oValidator;
  }
});

/*
 function Ember.Validation.createValidator
 param {String} propertyName optional
 return {Object} Validator chain object
 */
Ember.Validation.createValueValidator = function(propertyName){
  return Ember.Validation.Chain.create({
    propertyName: propertyName
  });
};

/*
 function createObjectValidator
 param {Function}
 return {Object} ObjectValidator
 */
Ember.Validation.createObjectValidator = function(cb){
  var chain = Ember.Validation.ChainingContext.create();
  cb.call(chain);
  return chain.createObjectValidator();
};

/*
 function Ember.Validation.map
 param {Function}
 return {Object} ObjectValidator
 */
Ember.Validation.map = Ember.Validation.createObjectValidator;
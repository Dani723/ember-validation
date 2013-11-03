var get = Ember.get, set = Ember.set, toType = Ember.Validation.toType;

/**
 Validation result of a property

 @class Ember.Validation.Result
 */
Ember.Validation.Result = Ember.Object.extend({

  error:null,

  setError: function(message) {
    set(this, 'error', message);
  },

  /**
   property {boolean}
   */
  hasError: Ember.computed(function() {
    return toType(get(this, 'error'))==='string';
  }).property('error'),

  /**
   property {boolean}
   */
  isValid: Ember.computed.not('hasError')

});

/**
 Validation result of an object
 *
 @class Ember.Validation.ValidationResult
 */
Ember.Validation.ValidationResult = Ember.Object.extend({

  results:null,

  init: function() {
    this._super();
    set(this, 'results', Ember.Map.create());
  },

  clear: function() {
    var results = get(this, 'results');
    results.forEach(function(property, result ) {
      if(Ember.Validation.ValidationResult.detectInstance(result)){
        result.clear();
      } else if(Ember.Validation.Result.detectInstance(result)){
        result.set('error', null);
      }
    });
    this.notifyPropertyChange('results');
  },

  setPropertyResult: function(property, presult) {
    var results = get(this, 'results');
    results.set(property, presult);
    this.notifyPropertyChange('results');
  },

  /**
   @property {boolean}
   */
  hasError: Ember.computed(function() {
    return !!get(this, 'errorLength');
  }).property('results'),

  /**
   @property {boolean}
   */
  isValid: Ember.computed.not('hasError'),

  /**
   @property {array}
   */
  properties: Ember.computed(function() {
    var retVal = Ember.A();
    get(this, 'results').forEach(function(property, result ) {
      retVal.pushObject(property);
    });
    return retVal;
  }).property('results'),

  /**
   @property {array}
   */
  errorProperties: Ember.computed(function() {
    var retVal = Ember.A();
    get(this, 'results').forEach(function(property, result ) {
      if(get(result, 'hasError')) {
        retVal.pushObject(property);
      }
    });
    return retVal;
  }).property('results'),

  /**
   @property {string}
   */
  error: Ember.computed(function() {
    if(get(this, 'hasError')) {
      return get(this, 'errors')[0];
    } else {
      return null;
    }
  }).property('results'),

  /**
   @property {array}
   */
  errors: Ember.computed(function() {
    var retVal = Ember.A();
    get(this, 'results').forEach(function(property, result) {
      if(get(result, 'hasError')) {

        if(Ember.Validation.ValidationResult.detectInstance(result)){
          // merge arrays
          retVal.pushObjects(get(result, 'errors'));
        } else if(Ember.Validation.Result.detectInstance(result)){
          retVal.pushObject(get(result, 'error'));
        }
      }
    });
    return retVal;
  }).property('results'),

  /**
   @property {number}
   */
  length: Ember.computed(function() {
    var length=0;
    get(this, 'results').forEach(function(property, result) {
      length++;
    });
    return length;
  }).property('results'),

  /**
   @property {number}
   */
  errorLength: Ember.computed(function() {
    var length=0;
    get(this, 'results').forEach(function(property, result) {
      if(get(result, 'hasError')) {
        length++;
      }
    });
    return length;
  }).property('results'),

  merge: function(oresult) {
    var that = this;
    get(oresult, 'results').forEach(function(property, result){
      that.setPropertyResult(property, result);
    });
  },

  /**
   @private
   */
  unknownProperty: function(property) {
    return get(this, 'results').get(property) || Ember.Validation.Result.create();
  }
});
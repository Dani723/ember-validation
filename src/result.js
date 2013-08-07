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
      results.set(property, Ember.Validation.Result.create());
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
        retVal.pushObject(get(result, 'error'));
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

  property: function(property) {
    var results = get(this, 'results');
    return results.get(property);
  },

  /**
   @private
   */
  unknownProperty: function(property) {
    return this.property(property) || this._findMatchingProperty(property);
  },

  // Searches for possible matching chained property and returns
  // an helper object  for deeper investigation
  _findMatchingProperty: function(root) {

    var results = get(this, 'results');

    var hasMatchingProperty = function(property){
      var match = false;
      results.forEach(function(p, result){
        if(p.indexOf(property+'.')===0) {
          match = true;
        }
      });
      return match;
    };

    if(hasMatchingProperty(root)) {
      return Ember.Object.create({
        parentProperty:root,

        unknownProperty: function(property) {

          property = get(this, 'parentProperty') + '.' + property;

          if(results.has(property)) {
            return results.get(property);
          } else {
            if(hasMatchingProperty(property)) {
              set(this, 'parentProperty', property);
              return this;
            } else {
              return undefined;
            }
          }
        }
      });
    } else {
      return undefined;
    }
  }
});



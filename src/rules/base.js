var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt, msgs = Ember.Validation.defaultMessages;
/**
Base class for rules.
@class Ember.Validation.BaseRule
*/
Ember.Validation.BaseRule = Ember.Object.extend({

  propertyName: null,
  message: msgs.invalid,
  override: false,
  context:null,
  _parameters:null,

  validate: function(value, obj) {
    throw new Error("BaseValidators validate() must be overwritten");
  },

  error: Ember.computed(function() {
    return fmt(get(this, 'message'), [get(this, 'propertyName')].concat(get(this, 'parameters')));
  }).property('propertyName', 'message', '_parameters.@each').volatile(), // non cacheable due to function values

  parameters: Ember.computed(function(key, value) {
    // getter
    if (arguments.length === 1) {
      var retVal = [];
      var pars = get(this, 'rawParameters');
      for(var i=0;i<pars.length; i++) {
        retVal.push(this._getParameter(pars[i]));
      }
      return retVal;
    } else {
      //setter
      set(this, '_parameters', value);
      return value;
    }
  }).property('_parameters').volatile(), // non cacheable due to function values,

  parameter: Ember.computed(function(key, value) {
    // getter
    if (arguments.length === 1) {
      var pars = get(this, 'rawParameters');
      return get(pars, 'length') > 0 ? this._getParameter(pars[0]) : null;
    } else {
      //setter
      set(this, '_parameters', [value]);
      return value;
    }
  }).property('_parameters').volatile(), // non cacheable due to function values,

  rawParameters: Ember.computed(function() {
    var retVal = [];
    var pars = get(this, '_parameters');
    if(pars!==null) {
      for(var i=0;i<pars.length; i++) {
        retVal.push(pars[i]);
      }
    }
    return retVal;
  }).property('_parameters').volatile(), // non cacheable due to function values,

  rawParameter: Ember.computed(function() {
    var pars = get(this, 'rawParameters');
    return get(pars, 'length') > 0 ? pars[0] : null;
  }).property('_parameters').volatile(), // non cacheable due to function values,

  _getParameter: function(par) {
    if(typeof par === "function") {
      var ctx = get(this, 'context');
      return par.call(ctx);
    } else {
      return par;
    }
  }

});

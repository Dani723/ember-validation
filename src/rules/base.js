var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;
/**
Base class for rules.
@class Ember.Validation.BaseRule
*/
Ember.Validation.BaseRule = Ember.Object.extend({

  propertyName: null,
  message: msgs.invalid,
  parameters:null,

  _validate: function(value, context) {

    var result = {
      isValid:true,
      error:"",
      override:false
    };

    var parameters = this.getParameters(context);
    result.isValid = this.validate.apply(this, [value].concat(parameters));
    if(!result.isValid) {
      result.error = this.getError(parameters);
    }
    result.override = this.override.apply(this, [value, result.isValid].concat(parameters));

    return result;
  },

  validate: function(value, args) {
    throw new Error("BaseRule validate() must be overwritten");
  },

  override: function(value, isValid, args) {
    return false;
  },

  getError: function(parameters) {
    return fmt(get(this, 'message'), [get(this, 'propertyName')].concat(parameters));
  },

  getParameters: function(context) {
    var retVal = [];
    var pars = get(this, 'parameters');
    if(!pars && toType(pars) !== 'array') {
      return [];
    }
    for(var i=0;i<pars.length; i++) {
      retVal.push(this._processParameter(pars[i], context));
    }
    return retVal;
  },

  _processParameter: function(par, context) {
    if(toType(par)=== "function") {
      return par.call(context);
    } else {
      return par;
    }
  }

});

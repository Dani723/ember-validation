var get = Ember.get, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;

Ember.Validation.RequiredRule = Ember.Validation.BaseRule.extend({

  message: msgs.required,

  validate: function(value, required) {
    return Ember.isEmpty(value) ? !required : true;
  },

  override: function(value, isValid, required) {
    return Ember.isEmpty(value) && !required;
  }
});

Ember.Validation.EqualsRule = Ember.Validation.BaseRule.extend({

  message: msgs.equals,

  validate: function(value, value2) {
    return value === value2;
  }
});

Ember.Validation.CustomRule = Ember.Validation.BaseRule.extend({

  _validate: function(value, context) {

    var result = {
      isValid:true,
      error:"",
      override:false
    };

    var parameters = get(this, 'parameters');
    var callback = parameters.length>0 ? parameters[0] : null;

    if(toType(callback)!=="function") {
      throw new Error("CustomRule parameter must be function");
    }

    result.isValid = callback.call(context, value);
    if(!result.isValid) {
      result.error = this.getError([]);
    }

    return result;
  }
});


var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;

Ember.Validation.RequiredRule = Ember.Validation.BaseRule.extend({

  message: msgs.required,
  override: false,

  validate: function(value, required) {
    return !value ? !required : true;
  },

  override: function(value, isValid, required) {
    return !value && !required;
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

    var callback = get(this, 'parameters')[0];
    if(typeof callback !== "function") {
      throw new Error("CustomRule parameter must be function");
    }

    result.isValid = callback.call(context, value);
    if(!result.isValid) {
      result.error = this.getError([]);
    }

    return result;
  }
});


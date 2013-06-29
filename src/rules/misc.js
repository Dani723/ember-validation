var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;

Ember.Validation.RequiredRule = Ember.Validation.BaseRule.extend({

  message: msgs.required,
  override: false,

  validate: function(value, obj) {
    var required = get(this, 'parameter');

    set(this, 'override', !value && !required);
    return !value ? !required : true;
  }

});

Ember.Validation.EqualsRule = Ember.Validation.BaseRule.extend({

  message: msgs.equals,

  validate: function(value, obj) {
    return value == get(this, 'parameter');
  }
});

Ember.Validation.CustomRule = Ember.Validation.BaseRule.extend({

  init: function() {
    this._super();

    var callback = get(this, 'rawParameter');
    if(typeof callback !== "function") {
      throw new Error("CustomRule parameter must be function");
    }
  },

  validate: function(value, obj) {
    var callback = get(this, 'rawParameter');
    return callback.call(obj, value);
  }
});


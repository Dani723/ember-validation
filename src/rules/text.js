var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;

Ember.Validation.StringRule = Ember.Validation.BaseRule.extend({

  message: msgs.string,

  validate: function(value, obj) {
    return toType(value)!=='string';
  }
});

Ember.Validation.TextMinLengthRule = Ember.Validation.BaseRule.extend({

  message: msgs.minLength,

  validate: function(value, obj) {

    if(toType(value)!=='string') {
      return false;
    }

    var min = get(this, 'parameter') || 0;
    var length = get(value, 'length') || 0;

    return length >= min;
  }

});

Ember.Validation.TextMaxLengthRule = Ember.Validation.BaseRule.extend({

  message: msgs.maxLength,

  validate: function(value, obj) {

    if(toType(value)!=='string') {
      return false;
    }

    var max = get(this, 'parameter') || 0;
    var length = get(value, 'length') || 0;

    return length <= max;
  }
});

Ember.Validation.TextLengthRule = Ember.Validation.BaseRule.extend({

  message: msgs.textLength,

  validate: function(value, obj) {

    if(toType(value)!=='string') {
      return false;
    }

    var parameters = get(this, 'parameters');
    var min = parameters[0];
    var max = parameters[1];
    var length = get(value, 'length') || 0;

    return length >= min && length <= max;
  }
});
var get = Ember.get, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;

Ember.Validation.StringRule = Ember.Validation.BaseRule.extend({

  message: msgs.string,

  validate: function(value) {
    return toType(value)!=='string';
  }
});

Ember.Validation.TextMinLengthRule = Ember.Validation.BaseRule.extend({

  message: msgs.minLength,

  validate: function(value, min) {

    if(toType(value)!=='string') {
      return false;
    }

    var length = get(value, 'length') || 0;

    return length >= min;
  }

});

Ember.Validation.TextMaxLengthRule = Ember.Validation.BaseRule.extend({

  message: msgs.maxLength,

  validate: function(value, max) {

    if(toType(value)!=='string') {
      return false;
    }

    var length = get(value, 'length') || 0;

    return length <= max;
  }
});

Ember.Validation.TextLengthRule = Ember.Validation.BaseRule.extend({

  message: msgs.textLength,

  validate: function(value, min, max) {

    if(toType(value)!=='string') {
      return false;
    }

    var length = get(value, 'length') || 0;

    return length >= min && length <= max;
  }
});
var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;

Ember.Validation.NumberRule = Ember.Validation.BaseRule.extend({

  message: msgs.number,

  validate: function(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }

});

Ember.Validation.IntegerRule = Ember.Validation.NumberRule.extend({

  message: msgs.integer,

  validate: function(value) {

    if(!this._super(value)) {
      return false;
    }

    var v = parseFloat(value);
    return toType(v)==='number' && v % 1 === 0;
  }
});

Ember.Validation.NumberMinRule = Ember.Validation.NumberRule.extend({

  message: msgs.min,

  validate: function(value, min) {

    if(!this._super(value)) {
      return false;
    }

    return (parseFloat(value) >= min);
  }

});

Ember.Validation.NumberMaxRule = Ember.Validation.NumberRule.extend({

  message: msgs.max,

  validate: function(value, max) {

    if(!this._super(value)) {
      return false;
    }

    return (parseFloat(value) <= max);
  }
});

Ember.Validation.NumberRangeRule = Ember.Validation.NumberRule.extend({

  message: msgs.range,

  validate: function(value, min, max) {

    if(!this._super(value)) {
      return false;
    }

    return parseFloat(value) >= min && parseFloat(value) <= max;
  }
});
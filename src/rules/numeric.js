var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;

Ember.Validation.NumberRule = Ember.Validation.BaseRule.extend({

  message: msgs.number,

  validate: function(value, obj) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }

});

Ember.Validation.IntegerRule = Ember.Validation.NumberRule.extend({

  message: msgs.integer,

  validate: function(value, obj) {

    if(!this._super(value, obj)) {
      return false;
    }

    var v = parseFloat(value);
    return typeof v === 'number' && v % 1 === 0;
  }
});

Ember.Validation.NumberMinRule = Ember.Validation.NumberRule.extend({

  message: msgs.min,

  validate: function(value, obj) {

    if(!this._super(value, obj)) {
      return false;
    }

    var min = get(this, 'parameter') || 0;

    return (parseFloat(value) >= min);
  }

});

Ember.Validation.NumberMaxRule = Ember.Validation.NumberRule.extend({

  message: msgs.max,

  validate: function(value, obj) {

    if(!this._super(value))
      return false;

    var max = get(this, 'parameter') || 0;

    return (parseFloat(value) <= max);
  }
});

Ember.Validation.NumberRangeRule = Ember.Validation.NumberRule.extend({

  message: msgs.range,

  validate: function(value, obj) {

    if(!this._super(value))
      return false;

    var parameters = get(this, 'parameters');
    var min = parseFloat(parameters[0]);
    var max = parseFloat(parameters[1]);

    return parseFloat(value) >= min && parseFloat(value) <= max;
  }
});
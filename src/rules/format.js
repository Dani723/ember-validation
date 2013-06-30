var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt, toType = Ember.Validation.toType, msgs = Ember.Validation.defaultMessages;

Ember.Validation.MatchRule = Ember.Validation.BaseRule.extend({

  validate: function(value, regex) {
    if(toType(value)!=='string') {
      return false;
    }
    return regex.test(value);
  }
});

Ember.Validation.NoMatchRule = Ember.Validation.MatchRule.extend({

  validate: function(value, regex) {
    return !this._super(value, regex);
  }

});

Ember.Validation.MailRule = Ember.Validation.MatchRule.extend({

  parameters: [/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
  message: msgs.mail

});
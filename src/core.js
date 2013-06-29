if(typeof Ember === 'undefined') {
  throw new Error("Ember not found");
}

Ember.Validation = Ember.Namespace.create();

if ('undefined' === typeof EV) {
  EV = Ember.Validation;

  if ('undefined' !== typeof window) {
    window.EV = Ember.Validation;
  }
}

Ember.Validation.toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
};
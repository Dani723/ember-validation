(function(){

  var get = Ember.get, set = Ember.set;

  module("Custom rules", {
    setup: function() {

      Ember.Validation.Test3Rule = Ember.Validation.MatchRule.extend({
        message:"Test3Rule error message",
        validate: function(value, obj) {
          return value==='test';
        }
      });

    },
    teardown: function() {
      delete Ember.Validation.Test3Rule;
    }
  });


  test('Custom 1', function() {

    throws(
      function() {
        Ember.Validation.registerRule("test1");
      },
      "register unknown validator"
    );

    throws(
      function() {
        Ember.Validation.registerRule("test1", {});
      },
      "register non RuleBase rule"
    );

    Ember.Validation.registerRule("test3");

    var chain = Ember.Validation.Chaining.create({
      propertyName: "name"
    });

    var validator = chain.test3().done();

    var result = validator.validate('test');
    strictEqual(get(result, 'isValid'), true, "custom rule isValid");

    result = validator.validate('foo');
    strictEqual(get(result, 'isValid'), false, "custom rule !isValid");
    strictEqual(get(result, 'error'), 'Test3Rule error message', "custom validator error message");

  });
})();
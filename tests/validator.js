(function(){

  var get = Ember.get, set = Ember.set;


  var validator1, validator2, validator3;

  module("Validator", {
    setup: function() {

      var rr1 = Ember.Validation.RequiredRule.create({
        propertyName:"Name",
        parameters:[true]
      });

      var rr2 = Ember.Validation.RequiredRule.create({
        propertyName:"Age",
        parameters:[true]
      });

      var lr1 = Ember.Validation.TextLengthRule.create({
        propertyName:"Name",
        parameters:[5,6]
      });

      validator1 = Ember.Validation.ValueValidator.create({});
      validator1.addRule(rr1);
      validator2 = Ember.Validation.ValueValidator.create({});
      validator2.addRule(rr1);
      validator2.addRule(lr1);
      validator3 = Ember.Validation.ValueValidator.create({});
      validator3.addRule(rr2);
    },

    teardown: function() {
      validator1 = null;
      validator2 = null;
      validator3 = null;
    }
  });


  test('ValueValidator validation', function() {


    strictEqual(get(validator1.validate(""), 'isValid'), false, "validator require override");
    strictEqual(get(validator1.validate("test"), 'isValid'), true, "validator test");

    strictEqual(get(validator2.validate(""), 'isValid'), false, "validator \"\"");
    strictEqual(get(validator2.validate("test"), 'isValid'), false, "validator test");
    strictEqual(get(validator2.validate("test"), 'error'), "Name must be between 5 and 6 characters", "validator error test");
    strictEqual(get(validator2.validate("test1"), 'isValid'), true, "validator test1");
    strictEqual(get(validator2.validate("test12"), 'isValid'), true, "validator test12");
    strictEqual(get(validator2.validate("test123"), 'isValid'), false, "validator test123");
  });

  test('ObjectValidator validation', function() {

    var o = {
      name:"test",
      age:10
    }

    var oValidator = Ember.Validation.ObjectValidator.create();
    oValidator.setPropertyValidator("name", validator2);
    oValidator.setPropertyValidator("age", validator3);

    strictEqual(get(oValidator.validate(o), 'isValid'), false, "validator \"\"");
    strictEqual(get(oValidator.validate(o), 'name.error'), "Name must be between 5 and 6 characters", "validator \"\"");
    strictEqual(get(oValidator.validate(o), 'age.error'), null, "validator \"\"");
    o.name = "tester";
    strictEqual(get(oValidator.validate(o), 'isValid'), true, "validator \"\"");

  });

})();
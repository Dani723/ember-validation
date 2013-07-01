(function(){

  var get = Ember.get, set = Ember.set;


  var oValidator;

  module("Validator mixins", {
    setup: function() {

      oValidator = Ember.Validation.map(function(){
        this.property('name').required().length(5,6);
        this.property('age').required();
      })
    },

    teardown: function() {
      oValidator = null;
    }
  });

  test('ValidatorSupport', function() {

    var o = Ember.Object.extend(Ember.Validation.ValidatorSupport, {
      validator: oValidator,

      name:"test",
      age:""
    }).create();


    var result1 = o.validate(true);
    strictEqual(get(result1, 'hasError'), true, "object callback");

    o.name = "tester";
    o.age = "20";

    var result2 = o.validate(true);
    strictEqual(get(result2, 'hasError'), false, "object callback");

  });

  test('ValidatorSupport callbacks', function() {
    expect(5);

    var o = Ember.Object.extend(Ember.Validation.ValidatorSupport, {
      validator: oValidator,

      name:"test",
      age:""
    }).create();

    o.subscribeValidation("", this, function(result){
      strictEqual(get(result, 'hasError'), true, "object callback");
    });
    o.subscribeValidation("name", this, function(result){
      strictEqual(get(result, 'hasError'), true, "name callback");
    });

    var func = function(result){
      strictEqual(get(result, 'hasError'), true, "age callback");
    };

    o.subscribeValidation("age", this, func);

    o.validate();

    o.unsubscribeValidation("age", this, func);

    o.validate(true);
  });

})();
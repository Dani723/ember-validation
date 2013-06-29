(function(){

  var get = Ember.get, set = Ember.set;

  var chainingCtx;

  module("Chaining", {
    setup: function() {
      chainingCtx = Ember.Validation.ChainingContext.create();

    },
    teardown: function() {
      chainingCtx = null;
    }
  });


  test('Chain', function() {

    var chaining = Ember.Validation.Chaining.create({
      propertyName: "name"
    });

    strictEqual(get(chaining, 'isRequired'), false, "!required");
    chaining.required().min(5);
    strictEqual(get(chaining, 'isRequired'), true, "required");
    strictEqual(get(chaining, 'chain.length'), 1, "validators length");

    chaining.message("test");

    strictEqual(get(chaining, 'chain')[0].message, "test", "message");

    var chaining2 = Ember.Validation.Chaining.create({
      propertyName: "name"
    });

    chaining2.message("test").required().message("test2").max(5).message("test3");

    strictEqual(get(chaining2, 'errorMessage'), "test", "message");
    strictEqual(get(chaining2, 'requiredErrorMessage'), "test2", "required message");
    strictEqual(get(chaining2, 'chain')[0].message, "test3", "validator message");
  });

  test('Chain -> Validator', function() {
    var chaining = Ember.Validation.Chaining.create({
      propertyName: "Name"
    });

    var validator = chaining.required().minLength(5).done();

    strictEqual(get(validator.validate("test"), 'hasError'), true, "validator test");
    strictEqual(get(validator.validate("tester"), 'hasError'), false, "validator tester");

  });


  test('ChainingContext', function() {

    chainingCtx.property("name", "Name").message("test").required().message("test2").length(1,50).message("test3");
    chainingCtx.property("age").required().integer().min(20);

    strictEqual(get(chainingCtx, 'chains.name.chain.length'), 1, "chainingCtx name chain length");
    strictEqual(get(chainingCtx, 'chains.age.chain.length'), 2, "chainingCtx age chain length");
  });

  test('ChainingContext -> ObjectValidator', function() {

    chainingCtx.property("p1", "P1").message("test").required().message("test2").length(1,50).mail().message("test3");
    chainingCtx.property("p2").required().message("test2").length(1,50).mail().message("test3");

    var oValidator = chainingCtx.createObjectValidator();

    var p1validator = oValidator.getPropertyValidator('p1');
    var p2validator = oValidator.getPropertyValidator('p2');

    strictEqual(get(p1validator, 'rules.length'), 3, "validators.length");

    var p1r0 = get(p1validator, 'rules')[0];
    var p1r1 = get(p1validator, 'rules')[1];
    var p1r2 = get(p1validator, 'rules')[2];

    strictEqual(get(p1r0, 'message'),"test2",  "name rule message 1");
    strictEqual(get(p1r1, 'message'),"test",  "name rule message 2");
    strictEqual(get(p1r2, 'message'),"test3",  "name rule message 3");

    var p2r0 = get(p2validator, 'rules')[0];
    var p2r1 = get(p2validator, 'rules')[1];
    var p2r2 = get(p2validator, 'rules')[2];

    strictEqual(get(p2r0, 'message'),"test2",  "age rule message 1");
    strictEqual(get(p2r1, 'message'),"%@1 must be between %@2 and %@3 characters",  "age rule message 2");
    strictEqual(get(p2r2, 'message'),"test3",  "age rule message 3");

    var o = {
      p1:"test@test.com",
      p2:"test@test.com"
    }

    var result = oValidator.validate(o, true);

    strictEqual(get(result, 'errors.length'),0,  "oValidator errors.length");

    set(o, 'p1', "test");
    set(o, 'p2', "test");

    result = oValidator.validate(o, true);
    strictEqual(get(result, 'errors.length'),2,  "oValidator errors.length");
  });

})();
(function(){

  var get = Ember.get, set = Ember.set;


  module("Rules", {
    setup: function() {
    },
    teardown: function() {
    }
  });


  test('BaseRule', function() {
    var rule = Ember.Validation.BaseRule.create();
    strictEqual(get(rule, 'error'), '(null) is invalid', 'error');
    deepEqual(get(rule, 'parameters'), [], 'parameters');
    strictEqual(get(rule, 'parameter'), null, 'parameter');
    throws(rule.validate, "validate() throws exception");
  });

  test('RequiredRule', function() {
    var rule = Ember.Validation.RequiredRule.create({parameter:false});

    strictEqual(rule.validate(""), true, "not required \"\"");
    strictEqual(get(rule, "override"), true, "not required: \"\" - override");
    strictEqual(rule.validate("test"), true, "not required: test");
    strictEqual(rule.validate(1), true, "not required: 1");
    strictEqual(get(rule, "override"), false, "not required: 1 - override");
    strictEqual(rule.validate(1), true, "not required: 0");
    strictEqual(get(rule, "override"), false, "not required: 0 - override");

  });


  test('EqualsRule', function() {
    var s = "testxy";

    var rule1 = Ember.Validation.EqualsRule.create({parameter:"test"});
    var rule2 = Ember.Validation.EqualsRule.create({parameter:function(){return s}});

    strictEqual(rule1.validate("test"), true, "test===test");
    strictEqual(rule2.validate("x"), false, "test===x");

    strictEqual(rule2.validate(s), true, "var===function");

  });

  test('CustomRule', function() {
    expect(4);

    var rule = Ember.Validation.CustomRule.create({parameter:function(value){
      strictEqual(typeof value, "string", "CustomRule callback");
      return value==="test"
    }});

    strictEqual(rule.validate("test"), true, "test===test");
    strictEqual(rule.validate("x"), false, "test===x");

  });

  test('TextLengthRule', function() {
    var rule1 = Ember.Validation.TextMinLengthRule.create({parameter:5});
    var rule2 = Ember.Validation.TextMaxLengthRule.create({parameter:5});
    var rule3 = Ember.Validation.TextLengthRule.create({parameters:[5,6]});

    strictEqual(rule1.validate("test"), false, "min 5: test");
    strictEqual(rule1.validate("test1"), true, "min 5: test1");
    strictEqual(rule1.validate("test12"), true, "min 5: test12");

    strictEqual(rule2.validate("test"), true, "max 5: test");
    strictEqual(rule2.validate("test1"), true, "max 5: test1");
    strictEqual(rule2.validate("test12"), false, "max 5: test12");

    strictEqual(rule3.validate("test"), false, "lgth 5-6: test");
    strictEqual(rule3.validate("test1"), true, "lgth 5-6: test1");
    strictEqual(rule3.validate("test12"), true, "lgth 5-6: test12");
    strictEqual(rule3.validate("test123"), false, "lgth 5-6: test123");

  });

  test('RegexRule', function() {
    var rule1 = Ember.Validation.MatchRule.create({parameter:/^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/});
    var rule2 = Ember.Validation.NoMatchRule.create({parameter:/[A-Z]/});
    var rule3 = Ember.Validation.MailRule.create();

    strictEqual(rule1.validate("1234"), false, "zip: 1234");
    strictEqual(rule1.validate("12345"), true, "zip: 12345");

    strictEqual(rule2.validate("dSaDsa"), false, "nocapital: dSaDsa");
    strictEqual(rule2.validate("dsadsa"), true, "nocapital: dsadsa");

    strictEqual(rule3.validate("test@test.com"), true, "mail: test@test.com");
    strictEqual(rule3.validate("test.test@test.com"), true, "mail: test.test@test.com");
    strictEqual(rule3.validate("testtest.com"), false, "mail: testtest.com");
    strictEqual(rule3.validate("test@test.c"), false, "mail: test@test.c");
    strictEqual(rule3.validate("test@testcom"), false, "mail: test@testcom");
    strictEqual(rule3.validate("@testcom"), false, "mail: @testcom");
    strictEqual(rule3.validate("testcom"), false, "mail: testcom");
    strictEqual(rule3.validate("@test.com"), false, "mail: @test.com");
  });

  test('NumberRule', function() {
    var rule1 = Ember.Validation.NumberRule.create();
    var rule2 = Ember.Validation.IntegerRule.create();
    var rule3 = Ember.Validation.NumberMinRule.create({parameter:5});
    var rule4 = Ember.Validation.NumberMaxRule.create({parameter:5});
    var rule5 = Ember.Validation.NumberRangeRule.create({parameters:[5,6]});

    strictEqual(rule1.validate("1"), true, "number: 1");
    strictEqual(rule1.validate("1.5"), true, "number: 1.5");
    strictEqual(rule1.validate("1,5"), false, "!number: 1,5");
    strictEqual(rule1.validate("a1"), false, "!number: a1");
    strictEqual(rule1.validate(""), false, "!number: \"\"");
    strictEqual(rule1.validate(Number.NaN), false, "!number: NaN");

    strictEqual(rule2.validate("1"), true, "integer: 1");
    strictEqual(rule2.validate("1.5"), false, "!integer: 1.5");
    strictEqual(rule2.validate("1,5"), false, "!integer: 1,5");
    strictEqual(rule2.validate("test"), false, "!integer: test");
    strictEqual(rule2.validate(""), false, "!integer: \"\"");

    strictEqual(rule3.validate(4), false, "min: 4");
    strictEqual(rule3.validate(5), true, "min: 5");
    strictEqual(rule3.validate(6), true, "min: 6");

    strictEqual(rule4.validate(4), true, "max: 4");
    strictEqual(rule4.validate(5), true, "max: 5");
    strictEqual(rule4.validate(6), false, "max: 6");

    strictEqual(rule5.validate(4), false, "range 5-6: 4");
    strictEqual(rule5.validate(4.99999), false, "range 5-6: 4.99999");
    strictEqual(rule5.validate(5), true, "range 5-6: 5");
    strictEqual(rule5.validate(6), true, "range 5-6: 6");
    strictEqual(rule5.validate(7.00001), false, "range 5-6: 7.00001");


  });




})();
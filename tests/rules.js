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
    strictEqual(rule.getError(), '(null) is invalid', 'error');
    deepEqual(rule.getParameters(), [], 'parameters');
    throws(rule.validate, "validate() throws exception");
  });

  test('RequiredRule', function() {
    var rule1 = Ember.Validation.RequiredRule.create({parameters:[false]});
    var rule2 = Ember.Validation.RequiredRule.create({parameters:[true]});
    var rule3 = Ember.Validation.RequiredRule.create({parameters:[function() { return false; }]});
    var rule4 = Ember.Validation.RequiredRule.create({parameters:[function() { return true; }]});

    var result1 = rule1._validate("");
    var result2 = rule1._validate("test");

    strictEqual(result1.isValid, true, "not required \"\" - isValid");
    strictEqual(result1.override, true, "not required: \"\" - override");
    strictEqual(result2.isValid, true, "not required: test - isValid");
    strictEqual(result2.override, false, "not required: test - override");

    var result3 = rule2._validate("");
    var result4 = rule2._validate("test");

    strictEqual(result3.isValid, false, "required \"\" - isValid");
    strictEqual(result3.override, false, "required: \"\" - override");
    strictEqual(result3.error, "(null) is required", "required: \"\" - error");
    strictEqual(result4.isValid, true, "required: test - isValid");
    strictEqual(result4.override, false, "required: test - override");

    var result5 = rule3._validate("");
    var result6 = rule3._validate("test");

    strictEqual(result5.isValid, true, "not required (func) \"\" - isValid");
    strictEqual(result5.override, true, "not required (func): \"\" - override");
    strictEqual(result6.isValid, true, "not required (func): test - isValid");
    strictEqual(result6.override, false, "not required (func): test - override");

    var result7 = rule4._validate("");
    var result8 = rule4._validate("test");

    strictEqual(result7.isValid, false, "required (func) \"\" - isValid");
    strictEqual(result7.override, false, "required (func): \"\" - override");
    strictEqual(result7.error, "(null) is required", "required (func): \"\" - error");
    strictEqual(result8.isValid, true, "required (func): test - isValid");
    strictEqual(result8.override, false, "required (func): test - override");

  });


  test('EqualsRule', function() {
    var s = "testxy";

    var rule = Ember.Validation.EqualsRule.create({parameters:["test"]});

    var result1 = rule._validate("test");
    var result2 = rule._validate("foo");

    strictEqual(result1.isValid, true, "test===test \"\" - isValid");
    strictEqual(result1.override, false, "test===test: \"\" - override");
    strictEqual(result2.isValid, false, "test===foo \"\" - isValid");
    strictEqual(result2.override, false, "test===foo: \"\" - override");
    strictEqual(result2.error, "(null) must be equal to test", "required: \"\" - error");

  });

  test('EqualsRule - callback parameter', function() {
    var obj = {name:"test"};
    var rule = Ember.Validation.EqualsRule.create({parameters:[function(){return this.name}]});

    var result1 = rule._validate("test", obj);
    var result2 = rule._validate("foo", obj);

    strictEqual(result1.isValid, true, "test===test \"\" - isValid");
    strictEqual(result1.override, false, "test===test: \"\" - override");
    strictEqual(result2.isValid, false, "test===foo \"\" - isValid");
    strictEqual(result2.override, false, "test===foo: \"\" - override");
    strictEqual(result2.error, "(null) must be equal to test", "required: \"\" - error");

  });

  test('CustomRule', function() {
    expect(2);

    var obj = {name:"test"};

    var rule = Ember.Validation.CustomRule.create({parameters:[function(value){
      strictEqual(typeof value, "string", "CustomRule callback");
      return value===this.name
    }]});

    var result1 = rule._validate("test", obj);

    strictEqual(result1.isValid, true, "test===test");
  });

  test('TextLengthRule', function() {
    var rule1 = Ember.Validation.TextMinLengthRule.create({parameters:[5]});

    strictEqual(rule1._validate("test").isValid, false, "min 5: test - isValid");
    strictEqual(rule1._validate("test1").isValid, true, "min 5: test1 - isValid");
    strictEqual(rule1._validate("test12").isValid, true, "min 5: test12 - isValid");

    var rule2 = Ember.Validation.TextMaxLengthRule.create({parameters:[5]});

    strictEqual(rule2._validate("test").isValid, true, "max 5: test - isValid");
    strictEqual(rule2._validate("test1").isValid, true, "max 5: test1 - isValid");
    strictEqual(rule2._validate("test12").isValid, false, "max 5: test12 - isValid");

    var rule3 = Ember.Validation.TextLengthRule.create({parameters:[5,6]});

    strictEqual(rule3._validate("test").isValid, false, "max 5: test - isValid");
    strictEqual(rule3._validate("test1").isValid, true, "max 5: test1 - isValid");
    strictEqual(rule3._validate("test12").isValid, true, "max 5: test12 - isValid");
    strictEqual(rule3._validate("test123").isValid, false, "max 5: test123 - isValid");
  });

  test('RegexRule', function() {
    var rule1 = Ember.Validation.MatchRule.create({parameters:[/^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/]});

    strictEqual(rule1._validate("1234").isValid, false, "zip: 1234");
    strictEqual(rule1._validate("12345").isValid, true, "zip: 12345");

    var rule2 = Ember.Validation.NoMatchRule.create({parameters:[/[A-Z]/]});

    strictEqual(rule2._validate("dSaDsa").isValid, false, "nocapital: dSaDsa");
    strictEqual(rule2._validate("dsadsa").isValid, true, "nocapital: dsadsa");

    var rule3 = Ember.Validation.MailRule.create();

    strictEqual(rule3._validate("test@test.com").isValid, true, "mail: test@test.com");
    strictEqual(rule3._validate("test.test@test.com").isValid, true, "mail: test.test@test.com");
    strictEqual(rule3._validate("testtest.com").isValid, false, "mail: testtest.com");
    strictEqual(rule3._validate("test@test.c").isValid, false, "mail: test@test.c");
    strictEqual(rule3._validate("test@testcom").isValid, false, "mail: test@testcom");
    strictEqual(rule3._validate("@testcom").isValid, false, "mail: @testcom");
    strictEqual(rule3._validate("testcom").isValid, false, "mail: testcom");
    strictEqual(rule3._validate("@test.com").isValid, false, "mail: @test.com");
  });

  test('NumberRule', function() {
    var rule1 = Ember.Validation.NumberRule.create();
    var rule2 = Ember.Validation.IntegerRule.create();
    var rule3 = Ember.Validation.NumberMinRule.create({parameters:[5]});
    var rule4 = Ember.Validation.NumberMaxRule.create({parameters:[5]});
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

    strictEqual(rule3._validate(4).isValid, false, "min: 4");
    strictEqual(rule3._validate(5).isValid, true, "min: 5");
    strictEqual(rule3._validate(6).isValid, true, "min: 6");

    strictEqual(rule4._validate(4).isValid, true, "max: 4");
    strictEqual(rule4._validate(5).isValid, true, "max: 5");
    strictEqual(rule4._validate(6).isValid, false, "max: 6");

    strictEqual(rule5._validate(4).isValid, false, "range 5-6: 4");
    strictEqual(rule5._validate(4.99999).isValid, false, "range 5-6: 4.99999");
    strictEqual(rule5._validate(5).isValid, true, "range 5-6: 5");
    strictEqual(rule5._validate(6).isValid, true, "range 5-6: 6");
    strictEqual(rule5._validate(6.00001).isValid, false, "range 5-6: 6.00001");
  });
})();
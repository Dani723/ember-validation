(function(){

  var get = Ember.get, set = Ember.set;

  var result1, result2, oresult;

  module("Results", {
    setup: function() {
      result1 = Ember.Validation.Result.create();
      result2 = Ember.Validation.Result.create();
      oresult = Ember.Validation.ValidationResult.create();
    },
    teardown: function() {
      delete result1;
      delete result2;
      delete oresult;
    }
  });


  test('Result', function() {
    strictEqual(get(result1, 'isValid'), true, 'without error: isValid');
    strictEqual(get(result1, 'hasError'), false, 'without error: hasError');
    strictEqual(get(result1, 'error'), null, 'without error: error is null');

    result1.setError("TestErrorMessage");

    strictEqual(get(result1, 'isValid'), false, 'with error: isValid');
    strictEqual(get(result1, 'hasError'), true, 'with error: hasError');
    strictEqual(get(result1, 'error'), "TestErrorMessage", 'with error: error is errormsg');

  });

  test('ValidationResult', function() {


    strictEqual(get(oresult, 'isValid'), true, 'without error: isValid');
    strictEqual(get(oresult, 'hasError'), false, 'without error: hasError');
    deepEqual(get(oresult, 'errors'), [], 'without error: errors');
    deepEqual(get(oresult, 'properties'), [], 'without error: properties');
    strictEqual(get(oresult, 'length'), 0, 'without error: length');

    result1.setError("TestErrorMessage");
    oresult.setPropertyResult("name", result1);
    oresult.setPropertyResult("age", result2);

    strictEqual(get(oresult, 'isValid'), false, 'with error: isValid');
    strictEqual(get(oresult, 'hasError'), true, 'with error: hasError');
    deepEqual(get(oresult, 'errors'), ["TestErrorMessage"], 'with error: errors');
    deepEqual(get(oresult, 'properties'), ["name", "age"], 'with error: properties');
    deepEqual(get(oresult, 'errorProperties'), ["name"], 'with error: errorProperties');
    strictEqual(get(oresult, 'length'), 2, 'with error: length');
    strictEqual(get(oresult, 'errorLength'), 1, 'with error: errorLength');

    strictEqual(get(oresult, 'name.hasError'), true, 'with error: name.hasError');
    strictEqual(get(oresult, 'name.error'), "TestErrorMessage", 'with error: name.error');

    strictEqual(get(oresult, 'age.hasError'), false, 'with error: age.hasError');
    strictEqual(get(oresult, 'age.error'), null, 'with error: age.error');

    strictEqual(get(oresult, 'test.hasError'), undefined, 'undefined property: test.hasError');
    strictEqual(get(oresult, 'test.error'), undefined, 'undefined property: test.error');

  });

  test('ValidationResult - chained properties', function() {


    result1.setError("TestErrorMessage");
    result2.setError("TestErrorMessage2");

    oresult.setPropertyResult("obj.name", result1);
    oresult.setPropertyResult("obj.test.name", result2);

    strictEqual(get(oresult, 'isValid'), false, 'with error: isValid');
    strictEqual(get(oresult, 'hasError'), true, 'with error: hasError');
    deepEqual(get(oresult, 'errors'), ["TestErrorMessage", "TestErrorMessage2"], 'with error: errors');
    deepEqual(get(oresult, 'properties'), ["obj.name", "obj.test.name"], 'with error: properties');
    deepEqual(get(oresult, 'errorProperties'), ["obj.name", "obj.test.name"], 'with error: errorProperties');
    strictEqual(get(oresult, 'length'), 2, 'with error: length');
    strictEqual(get(oresult, 'errorLength'), 2, 'with error: errorLength');

    strictEqual(get(oresult.property('obj.name'), 'hasError'), true, 'with error: name.hasError');
    strictEqual(get(oresult.property('obj.name'), 'error'), "TestErrorMessage", 'with error: name.error');

    strictEqual(get(oresult, 'obj.name.hasError'), true, 'with error: obj.name.hasError');
    strictEqual(get(oresult, 'obj.name.error'), "TestErrorMessage", 'obj.name.error');

    strictEqual(get(oresult, 'obj.test.name.hasError'), true, 'with error: obj.test.name.hasError');
    strictEqual(get(oresult, 'obj.test.name.error'), "TestErrorMessage2", 'with error: obj.test.name.error');

    strictEqual(get(oresult, 'obj.test.age.hasError'), undefined, 'undefined property: obj.test.age.hasError');
    strictEqual(get(oresult, 'obj.test.age.error'), undefined, 'undefined property: obj.test.age.error');

    strictEqual(get(oresult, 'obj.test.name.age.hasError'), undefined, 'undefined property: obj.test.name.age.hasError');
    strictEqual(get(oresult, 'obj.test.name.age.error'), undefined, 'undefined property: obj.test.name.age.error');

    strictEqual(get(oresult, 'obj.hasError'), undefined, 'undefined property: obj.hasError');
    strictEqual(get(oresult, 'obj.error'), undefined, 'undefined property: obj.error');

  });

})();
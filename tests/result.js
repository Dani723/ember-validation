(function(){

  var get = Ember.get, set = Ember.set;

  var result1, result2, result3, oresult, oresult2;

  module("Results", {
    setup: function() {
      result1 = Ember.Validation.Result.create();
      result2 = Ember.Validation.Result.create();
      result3 = Ember.Validation.Result.create();
      oresult = Ember.Validation.ValidationResult.create();
      oresult2 = Ember.Validation.ValidationResult.create();
    },
    teardown: function() {
      delete result1;
      delete result2;
      delete result3;
      delete oresult;
      delete oresult2;
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

    oresult.setPropertyResult("name", result1);
    oresult.setPropertyResult("age", result2);
    result1.setError("TestErrorMessage");

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

    strictEqual(get(oresult, 'test.hasError'), false, 'with error: test.hasError');
    strictEqual(get(oresult, 'test.error'), null, 'with error: test.error');
  });

  test('ValidationResult - nested results', function() {

    result3.setError("TestErrorMessage2");
    oresult2.setPropertyResult("name", result3);

    result1.setError("TestErrorMessage1");
    oresult.setPropertyResult("name", result1);
    oresult.setPropertyResult("age", result2);
    oresult.setPropertyResult("company", oresult2);

    strictEqual(get(oresult, 'isValid'), false, 'with error: isValid');
    strictEqual(get(oresult, 'hasError'), true, 'with error: hasError');
    deepEqual(get(oresult, 'errors'), ["TestErrorMessage1", "TestErrorMessage2"], 'with error: errors');
    deepEqual(get(oresult, 'properties'), ["name", "age", "company"], 'with error: properties');
    deepEqual(get(oresult, 'errorProperties'), ["name", "company"], 'with error: errorProperties');
    strictEqual(get(oresult, 'length'), 3, 'with error: length');
    strictEqual(get(oresult, 'errorLength'), 2, 'with error: errorLength');

    strictEqual(get(oresult, 'name.hasError'), true, 'with error: name.hasError');
    strictEqual(get(oresult, 'name.error'), "TestErrorMessage1", 'with error: name.error');

    strictEqual(get(oresult, 'company.hasError'), true, 'with error: company.hasError');
    strictEqual(get(oresult, 'company.error'), "TestErrorMessage2", 'with error: company.error');

    strictEqual(get(oresult, 'company.name.hasError'), true, 'with error: company.name.hasError');
    strictEqual(get(oresult, 'company.name.error'), "TestErrorMessage2", 'with error: company.name.error');

    strictEqual(get(oresult, 'age.hasError'), false, 'with error: age.hasError');
    strictEqual(get(oresult, 'age.error'), null, 'with error: age.error');
  });

})();
var get = Ember.get, set = Ember.set, toType = Ember.Validation.toType;

/**
 This mixin tries to obtain the validation object via the value binding and provides validation methods

 @class Ember.Validation.ValidatorViewSupport
 @extends Ember.Mixin
 */
Ember.Validation.ValidatorViewSupport = Ember.Mixin.create({

  validationObject:null,
  validationProperty:null,

  willValidate:Ember.K,
  didValidate:Ember.K,

  init: function() {
    this._super();

    var validationObject = get(this, 'validationObject');
    var validationProperty = get(this, 'validationProperty');

    if(toType(validationObject) !== 'object' && toType(validationProperty) === 'string') {
      validationObject = null;
    }

    if(toType(validationProperty) !== 'string') {
      validationProperty = null;
    }

    // when there is no validation target set, try it with valueBinding
    if(!validationObject) {
      var binding = get(this, 'valueBinding');
      if(binding) {
        var target = binding._from;
        // if there is a binding, determine the object and property
        if(target) {

          var idx = target.lastIndexOf('.');

          if (idx !== -1) {
            validationProperty = target.substr(idx + 1);
            validationObject = get(this, target.substr(0, idx));
          } else {
            validationProperty = target;
            validationObject = get(this, 'context');
          }
        }
      }
    }

    // check if validationobject has validatorsupport mixin
    if(validationObject && toType(validationObject.validate)==='function' && validationProperty) {
      set(this, 'validationProperty', validationProperty);
      set(this, 'validationObject', validationObject);
    } else {
      set(this, 'validationProperty', null);
      set(this, 'validationObject', null);
      Ember.warn('ValidatorViewSupport needs either a validationObject/validationProperty or a valueBinding which binds toward a ValidatorSupport mixin');
    }

  },

  /**
   validates related property on the validation object
   This does not trigger any events on the validation object
   @method validate
   @return {Ember.Validation.Result} Returns the validation result
   */
  validate: function() {
    var validationObject = get(this, 'validationObject');
    var validationProperty = get(this, 'validationProperty');
    if(validationObject) {
      // pass it to the ValidatorSupport object
      var result = validationObject.validateProperty(validationProperty);
      this.doValidate(result);
      return result;
    }
    return null;
  },

  /**
   validates related property on the validation object without setting the result
   *
   * @method prevalidate
   * @return {Ember.Validation.Result} returns the validation result
   */
  prevalidate: function() {
    // just pass it to the ValidatorSupport object
    var validationObject = get(this, 'validationObject');
    var validationProperty = get(this, 'validationProperty');
    if(validationObject) {
      return validationObject.validateProperty(validationProperty);
    }
  },

  didInsertElement: function() {
    this._super();

    var validationObject = get(this, 'validationObject');
    var validationProperty = get(this, 'validationProperty');

    // when the view is inserted, subscribe to validation events
    if(validationObject) {
      validationObject.subscribeValidation(validationProperty, this, get(this, 'doValidate'));
    }
  },

  willDestroyElement: function() {
    this._super();

    var validationObject = get(this, 'validationObject');
    var validationProperty = get(this, 'validationProperty');

    // when the view will be destroyed, unsubscribe to validation events
    if(validationObject) {
      validationObject.unsubscribeValidation(validationProperty, this, get(this, 'doValidate'));
    }
  },

  doValidate: function(result) {
    var willRes = this.willValidate();
    if(toType(willRes)==='boolean' && !willRes) {
      return;
    }
    set(this, 'validationResult', result);
    this.didValidate(result);
  }


});
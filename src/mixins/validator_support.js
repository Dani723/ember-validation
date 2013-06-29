var get = Ember.get, set = Ember.set;

/**
This mixin adds validation support to ember objects.
The validation property must be an ObjectValidator. It is shared within all instances of this class.

 Example:

    App.User = Ember.Object.extend(Ember.Validation.ValidatorSupport, {

      validation: Ember.Validation.map(function() {
        this.property("name", "Username").required().minLength(4);
        this.property("age").required().integer().min(18).message("You have to be %@2 to join");
      }),

      name:null,
      age:null
    });

@class Ember.Validation.ValidatorSupport
@extends Ember.Mixin
*/
Ember.Validation.ValidatorSupport = Ember.Mixin.create(Ember.Evented, {

  isValidated:false,
  validator: null,
  didValidate:Ember.K,

  init: function() {
    this._super();

    // gets the objectvalidator for this class
    var validator = get(this, 'validator');
    if(!validator) {
      throw new Error("Add validation property when using the ValidatorSupport mixin");
    } else {
      if(!Ember.Validation.ObjectValidator.detect(validator.constructor)){
        throw new Error("validation property must be a subclass of ObjectValidator");
      }
    }

    this.set('validationResult', Ember.Validation.ValidationResult.create());
  },

  /**
  @method hasPropertyValidator
  @param option {String} property
  @return {Boolean}
  */
  hasPropertyValidator: function(property) {
    return get(this, 'validator').hasPropertyValidator(property);
  },

  /**
   Returns the validation result as a boolean
   @property isValid
   @type Boolean
  */
  isValid: function() {
    return get(this, 'validationResult.isValid');
  }.property().volatile(),

  hasError: Ember.computed.not('isValid'),

  /**
   validates the object by passing it to the ModelValidator
   Events are triggered

   option can be
   - nothing : validates all properties
   - false : validates until first error
   - true : same as nothing
   - property : validates specific property
   - array of properties : validates specific properties
  @method validate
  @param option {Object} see class description
  @return {Ember.Validation.ValidationResult} Returns the validation result
  */
  validate: function(option) {
    var vresult = get(this, 'validator').validate(this, option);
    var validationResult = get(this, 'validationResult');
    validationResult.merge(vresult);

    this.notifyPropertyChange('validationResult');
    this.triggerValidation(vresult);
    this.set('isValidated', true);

    return vresult;
  },

  /**
   validates the object by passing it to the ModelValidator
   Events are not triggered

   option can be
   - nothing : validates all properties
   - false : validates until first error
   - true : same as nothing
   - property : validates specific property
   - array of properties : validates specific properties
   @method validate
   @param option {Object} see class description
   @return {Ember.Validation.ValidationResult} Returns the validation result
   */
  prevalidate: function(option) {
    return get(this, 'validator').validate(this, option);
  },

  /**
   validates a single property of the object by passing it to the ModelValidator
   @method validateProperty
   @param property {String} the property to validate
   @return {Ember.Validation.Result} Returns the validation result
   */
  validateProperty: function(property) {
    return get(this, 'validator').validateProperty(this, property);
  },

  /**
   clears the object of any occurred validation
   @method clearValidation
   */
  clearValidation: function() {
    var validationResult = get(this, 'validationResult');
    validationResult.clear();

    this.notifyPropertyChange('validationResult');
    this.triggerValidation(validationResult);
    this.set('isValidated', false);
  },

  triggerValidation: function(vResult) {
    var thiz = this;

    get(vResult, 'results').forEach(function(property, result){
      thiz.trigger('v_event' + property, result, thiz);
    });

    thiz.trigger('v_event', vResult, thiz);
  },

  /**
   Subscribes a function to the validation event which is triggered  after an object or property has been validated.

   @method subscribeValidation
   @param property {String} optional*
   @param context {Object} the context of the callback
   @param func {Function} callback function
   */
  subscribeValidation: function(property, context, func) {
    if(typeof property === 'object') {
      func = context;
      context = property;
      property = '';
    } else if(typeof property === 'function') {
      func = property;
      context = null;
      property = '';
    }

    this.on('v_event' + property, context, func);
  },

  /**
   Unsubscribes a function to the validation event

   @method unsubscribeValidation
   @param property {String} optional*
   @param context {Object} the context of the callback
   @param func {Function} callback function
   */
  unsubscribeValidation: function(property, context, func) {
    if(typeof property === 'object') {
      func = context;
      context = property;
      property = '';
    } else if(typeof property === 'function') {
      func = property;
      context = null;
      property = '';
    }

    this.off('v_event' + property, context, func);
  }
});
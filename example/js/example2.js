App.Example2Controller = App.ExampleController.extend();

App.Example2ValidatorTextField = Ember.TextField.extend(Ember.Validation.ValidatorViewSupport, {

  classNameBindings:['validationResult.hasError:error:'],
  attributeBindings:['data-error'],

  'data-error': function(){
    return this,get('validationResult.error')
  }.property('validationResult'),

  focusOut : function(event) {
    this._super();
    this.validate();
  }
});

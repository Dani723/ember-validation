App.Example4Controller = App.ExampleController.extend();

App.Example4ValidatorTextField = Ember.TextField.extend(Ember.Validation.ValidatorViewSupport, {

  classNameBindings:['validationResult.hasError:error:'],

  focusOut : function(event) {
    this._super();
    this.validate();
  }
});

App.Example4ControlGroup = Ember.View.extend(Ember.Validation.ValidatorViewSupport, {
  classNames:['control-group'],
  classNameBindings:['validationResult.hasError:error:']
});

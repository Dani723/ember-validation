App.Example3Controller = App.ExampleController.extend();

App.Example3ValidatorTextField = Ember.TextField.extend(Ember.Validation.ValidatorViewSupport, {

  classNameBindings:['validationResult.hasError:error:'],

  focused:false,

  focusOut : function(event) {
    this._super();
    this.set('focused', true);
    this.validate();
  },

  valueChanged: function() {
    var that = this;
    if(this.get('focused')){
      Ember.run.next(function(){
        that.validate();
      });
    }
  }.observes('value'),

  didValidate: function() {
    this.set('focused', true);
  }
});

App.Example3RepeatPasswordTextField = Ember.TextField.extend({

  classNameBindings:['parentView.inputPassword.validationResult.hasError:error:'],

  focused:false,

  focusOut : function(event) {
    this._super();
    this.set('focused', true);
    this.get("parentView.inputPassword").validate();
  },

  valueChanged: function() {
    if(this.get('focused')){
      var that = this;
      Ember.run.next(function(){
        that.get("parentView.inputPassword").validate();
      });
    }
  }.observes('value')


});
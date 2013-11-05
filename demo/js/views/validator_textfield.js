App.ValidatorTextField = Ember.TextField.extend(Ember.Validation.ValidatorViewSupport, {

  classNameBindings:['validationResult.hasError:error:'],

  wasFocused:false,

  focusOut : function(event) {
    this._super();
    this.set('wasFocused', true);
    this.validate();
  },

  valueChanged: function() {
    var that = this;
    if(this.get('wasFocused')){
      Ember.run.next(function(){
        var result = that.validate();
      });
    }
  }.observes('value'),

  didValidate: function() {
    this.set('wasFocused', true);
  }
});
App.RepeatPasswordTextFieldComponent = Ember.TextField.extend({

  classNameBindings:['parentView.inputPassword.validationResult.hasError:error:'],

  wasFocused:false,

  focusOut : function(event) {
    this._super();
    this.set('wasFocused', true);
    this.get("parentView.inputPassword").validate();
  },

  valueChanged: function() {
    if(this.get('wasFocused')){
      var that = this;
      Ember.run.next(function(){
        that.get("parentView.inputPassword").validate();
      });
    }
  }.observes('value')
});
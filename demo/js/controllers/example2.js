App.Example2Controller = Ember.ObjectController.extend({
  
  actions: {
    clear: function() {
      var user = this.get('model');
      user.clearValidation();
    },

    validate: function() {
      this.get('model').validate();
    }
  }
});
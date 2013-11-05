App.Example2Controller = Ember.Controller.extend({
  user:null,
  result:null,

  actions: {
    clear: function() {
      var user = this.get('user');
      user.clearValidation();
    },

    validate: function() {
      this.get('user').validate();
    }
  }
});
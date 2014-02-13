App.ExampleRoute = Ember.Route.extend({

  model: function() {
    return this.store.createRecord('user');
  },

  setupController: function(controller, model) {
    controller.set('user', model);
  }
});

App.Example1Route = App.ExampleRoute.extend();
App.Example2Route = App.ExampleRoute.extend();
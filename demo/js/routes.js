App.ExampleRoute = Ember.Route.extend({

  model: function() {
    return App.User.create();
  },

  setupController: function(controller, model) {
    controller.set('user', model);
  }
});

App.Example1Route = App.ExampleRoute.extend();
App.Example2Route = App.ExampleRoute.extend();
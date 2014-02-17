App.ExampleRoute = Ember.Route.extend({

  model: function() {
    return this.store.createRecord('user');
  }
});

App.Example1Route = App.ExampleRoute.extend();
App.Example2Route = App.ExampleRoute.extend();
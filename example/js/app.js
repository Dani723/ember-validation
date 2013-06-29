App = window.App = Em.Application.create({
  VERSION: '0.1',

  HomeView:  Em.View.extend({
    templateName:  'example1'
  }),
  Home2View:  Em.View.extend({
    templateName:  'example2'
  }),
  Home3View:  Em.View.extend({
    templateName:  'example3'
  }),
  Home4View:  Em.View.extend({
    templateName:  'example4'
  })
});

App.Router.map(function() {
  this.resource("example1", { path: "/" });
  this.resource("example2", { path: "/example2" });
  this.resource("example3", { path: "/example3" });
  this.resource("example4", { path: "/example4" });
});

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
App.Example3Route = App.ExampleRoute.extend();
App.Example4Route = App.ExampleRoute.extend();


// models

//App.teritory = 'US';
App.teritory = 'EU';

App.User = Em.Object.extend(Ember.Validation.ValidatorSupport, {

  validator: Ember.Validation.map(function() {
    this.property("name").required().minLength(4);

    this.property("email", "E-Mail").required().mail();

    this.property("age").required().integer().min(function(){
      if(App.teritory === 'US') {
        return 21;
      } else {
        return 18;
      }
    }).message("You have to be %@2 to join");

    this.property("zodiac").minLength(4);

    this.property("password")
      .required()
      .minLength(6)
      .maxLength(20)
      .match(/((?=.*\d)(?=.*[a-z])(?=.*[*@#$%]))/)
        .message("Password must contain 1 digit and 1 special character *@#$%")
      .equals(function(){
        return this.get('password2')
      })
        .message("Passwords must be equal");
  }),

  name:null,
  email:null,
  age:null,
  zodiac:null,
  password:null,
  password2:null
});

//controllers

App.ExampleController = Em.Controller.extend({

  user:null,
  result:null,

  clear: function() {
    this.get('user').clearValidation();
  },

  validate: function() {
    this.get('user').validate();
  }
});
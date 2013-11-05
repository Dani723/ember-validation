App = window.App = Em.Application.create({
  VERSION: '0.1',

  loadTemplate: function(name) {
    return $.get('templates/' + name + '.hbs').then(function(src) {
      Ember.TEMPLATES[name] = Ember.Handlebars.compile(src);
    });
  }
});

App.Router.map(function() {
  this.resource("example1", { path: "/" });
  this.resource("example2", { path: "/example2" });
});

App.initializer({
  name: "templates",

  initialize: function(container, application) {

    application.deferReadiness();

    var promises = [];
    promises.push(application.loadTemplate('application'));
    promises.push(application.loadTemplate('example1'));
    promises.push(application.loadTemplate('example2'));

    Ember.RSVP.all(promises).then(function() {
      application.advanceReadiness();
    })
  }
});
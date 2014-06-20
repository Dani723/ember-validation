var territory = 'EU';

App.User = DS.Model.extend(Ember.Validation.ValidatorSupport, {

  validator: Ember.Validation.map(function() {
    this.property("name").required().minLength(4);

    this.property("email", "E-Mail").required().mail();

    this.property("age").required().integer().min(function(){
      if(territory === 'US') {
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

    this.property("secretNinjaWord", "Secret ninja word")
      .required(function(value) {
        console.log('Is secretNinjaWord required?', this.get('isNinja'));
        return this.get('isNinja');
      })
      .custom(function(value) {
        return !this.get('isNinja') || value === 'NINJA!';
      }).message('The secret ninja word must be "NINJA!"');
  }),

  name: DS.attr('string'),
  email: DS.attr('string'),
  age: DS.attr('number'),
  zodiac: DS.attr('string'),
  password: DS.attr('string'),
  password2: DS.attr('string'),
  isNinja: DS.attr('boolean'),
  secretNinjaWord: DS.attr('string')
});
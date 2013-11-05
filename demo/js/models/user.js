var territory = 'EU';

App.User = Em.Object.extend(Ember.Validation.ValidatorSupport, {

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
  }),

  name:null,
  email:null,
  age:null,
  zodiac:null,
  password:null,
  password2:null
});
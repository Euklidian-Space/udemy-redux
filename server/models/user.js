const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//define our iuser model

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

//On save hook, encrypt pw
// userSchema.pre('save', (next) => {
//   const user = this; //gives access to user model
//   console.log(user);
// });

// do not use an arrow function for .pre callback.
// it throws off the 'this' context

userSchema.pre('save', function (next) {
  const user = this; //gives access to user model

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);

      //overwrite plain text password with encrypted pw
      user.password = hash;
      next(); //continue with saving the record
    });
  })
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  })
}

//create the model class
const ModelClass = mongoose.model('user', userSchema);

//export the model

module.exports = ModelClass;

const config = require("../../config");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
  city: String,
  state: String,
})

var UserSchema = new Schema(
  {
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
    userId: String,
    prefix: {type: String, default: config.prefix.USER},
    firstName: String,
    lastName: String,
    address: AddressSchema,
  },
  { timestamps: true, versionKey: false }
);

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, 8);
};

// Check if the password is valid by comparing with the stored hash.
UserSchema.methods.validatePassword = function(password) {
  isValid = bcrypt.compareSync(password, this.password);
  return isValid
};

UserSchema.methods.generateLoginToken = function() {
  var user_data = {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    address: this.address
   
  }
  const jwt = config.issueJWT(user_data)
  return jwt
}

UserSchema.methods.getUserData = function() {
  var user_data = {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    address: this.address
  }
  return user_data
}

// Make sure the email has not been used.
UserSchema.path('phone').validate({
  isAsync: true,
  validator: function(phone, callback) {
    const User = mongoose.model(config.tables.USER);
    // Check only when it is a new pilot or when the phone has been modified.
    if (this.isNew || this.isModified('phone')) {
      User.find({ phone: phone }).exec(function(err, users) {
        callback(!err && users.length === 0);
      });
    } else {
      callback(true);
    }
  },
  message: 'This mobile No already exists. Please try to log in instead.',
});

UserSchema.pre('save', function(next) {
  // Make sure the password is hashed before being stored.
  if (this.isModified('password')) {
    this.password = this.generateHash(this.password);
  }
  next();
});

var User = module.exports.UserModal = mongoose.model(
  config.tables.USER, 
  UserSchema, 
  config.tables.USER
);

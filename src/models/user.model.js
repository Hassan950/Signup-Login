const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const userSchema = mongoose.Schema(
  {
    displayName: {
      type: String,
      required: [true, 'Please Enter your displayName!'],
      trim: true
    },
    username: {
      type: String,
      required: [true, 'Please Enter your username!'],
      unique: [true, 'This username is used!'],
      minlength: [5, 'Username is very short!'],
      maxlength: [30, 'Username is very long!'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please Enter your email!'],
      unique: [true, 'This email is used!'],
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email!'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please enter your password!'],
      minlength: [8, 'Password is very short!'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password!'],
      minlength: [8, 'Please confirm your password!'],
      select: false,
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same'
      }
    }
  }
);


userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 8);

  this.passwordConfirm = undefined; //we do not want password confirm to be saved in the database
  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;

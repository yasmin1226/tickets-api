const mongoose = require("mongoose");

const validator = require("validator");
const bycrpt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },
  email: {
    type: String,
    unique: true,

    required: [true, "please enter your email"],
    lowerCase: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },

  role: {
    type: String,
    enum: ["admin", "customer-service", "customer"], //
    default: "customer",
  },

  password: {
    type: String,
    required: [true, "please enter password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      //on create or save
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same..",
    },
  },
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
});

//instance method
//return true if password is the same
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycrpt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

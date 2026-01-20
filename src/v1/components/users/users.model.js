const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../../../utils/bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await hashPassword(this.password);
});


userSchema.methods.comparePassword = function (plainPassword) {
  return comparePassword(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    default: "family",
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  familyMembers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Elderly" },
      relationship: { type: String },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;

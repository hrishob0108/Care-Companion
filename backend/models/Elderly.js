const mongoose = require("mongoose");

const elderlySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "elderly" },
  healthData: {
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        schedule: [
          {
            timeOfDay: {
              type: String,
              enum: ["Morning", "Afternoon", "Evening", "Night"],
              required: true,
            },
            time: { type: String, required: true },
          },
        ],
        duration: {
          type: String,
          enum: ["7 days", "14 days", "30 days", "Ongoing"],
          required: true,
        },
      },
    ],
    allergies: { type: [String], required: false },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
});

const Elderly = mongoose.model("Elderly", elderlySchema);

module.exports = Elderly;

const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const schemaSchedule = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia al modelo de usuarios
  },
  date: {
    type: Date,
  },
  entryTime: {
    type: Date,
  },
  exitTime: {
    type: Date,
  },
});

module.exports = model("Schedule", schemaSchedule);

const { Schema, model } = require('mongoose');

const scheduleSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  entryTime: { type: Date },
  exitTime: { type: Date },
});


const UserSchema = new Schema({
  name: { type: String , required: false},
  username: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String  , required: true},
  role: { type: String, enum : ['ADMIN','EMPLEADO'], default: 'EMPLEADO' , required: false},
  schedule: { type: [scheduleSchema], required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {
  timestamps: true
});


module.exports = model('User', UserSchema);
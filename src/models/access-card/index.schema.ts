import mongoose from 'mongoose';

const accessCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  jmbg: {
    type: Number,
    unique : true,
    required : true,
    index: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique : true,
    required : true,
    index: true
  },
  type: {
    type: Number,
    required : true,
    enum: [0, 1, 2, 3, 4]
  },
  childName: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  diagnose: {
    type: String
  },
  dateOfDiagnose: {
    type: Date
  }
}, {timestamps: true});
export default accessCardSchema;

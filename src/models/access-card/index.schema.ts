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
    dropDups: true
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
    dropDups: true
  },
  type: {
    type: Number,
    required : true,
    enum: [0, 1, 2, 3, 4]
  },
  childName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  diagnose: {
    type: String,
    required: true
  },
  dateOfDiagnose: {
    type: Date,
    required: true
  }
});
export default accessCardSchema;

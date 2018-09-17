import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: String
}, {timestamps: true});

const accessCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  jmbg: {
    type: Number,
    required : true,
    index: true
  },
  address: {
    type: String,
    required: true
  },
  phone: String,
  email: {
    type: String,
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
  },
  notes: [noteSchema]
}, {timestamps: true});
export default accessCardSchema;

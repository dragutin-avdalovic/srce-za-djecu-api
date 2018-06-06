import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: String
}, {timestamps: true});

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: Number,
    required : true,
    enum: [0, 1, 2]
  },
  cause: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    requireds: true
  },
  notes: [noteSchema]
}, {timestamps: true});
export default donationSchema;

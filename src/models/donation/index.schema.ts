import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
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
  }
});
export default donationSchema;

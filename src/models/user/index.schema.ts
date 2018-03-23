import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
    required: true
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
export default userSchema;

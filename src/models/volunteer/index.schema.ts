import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  },
  phone: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  volunteeredBefore: {
    type: Boolean,
    required: true
  },
  numberOfHours: {
    type: Number,
    required: true
  },
  jobsToVolunteer: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  }
});
export default volunteerSchema;

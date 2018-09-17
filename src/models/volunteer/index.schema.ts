import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: String
}, {timestamps: true});

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
    required : true,
    index: true
  },
  phone: String,
  qualification: {
    type: String,
    required: true
  },
  profession: {
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
  },
  notes: [noteSchema]
}, {timestamps: true});
export default volunteerSchema;

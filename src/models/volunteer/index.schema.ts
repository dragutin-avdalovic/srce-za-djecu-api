import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  address: String,
  email: String,
  phone: String,
  qualification: String,
  position: String,
  volunteeredBefore: Boolean,
  numberOfHours: Number,
  healthState: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6, 7]
  }
});
export default volunteerSchema;

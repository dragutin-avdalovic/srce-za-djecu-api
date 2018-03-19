import mongoose from 'mongoose';

const accessCardSchema = new mongoose.Schema({
  name: String,
  jmbg: Number,
  address: String,
  phone: String,
  email: String,
  type: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },
  childName: String,
  dateOfBirth: Date,
  diagnose: String,
  dateOfDiagnose: Date
});
export default accessCardSchema;

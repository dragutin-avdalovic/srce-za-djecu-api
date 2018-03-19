import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  city: String,
  address: String,
  company: String,
  date: String,
  type: String,
  cause: String,
  amount: Number
});
export default userSchema;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String
});
export default userSchema;

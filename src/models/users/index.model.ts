import mongoose from 'mongoose';
import userSchema from './index.schema';

const User = mongoose.model('User', userSchema);
export default User;

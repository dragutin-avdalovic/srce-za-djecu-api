import mongoose from 'mongoose';
import volunteerSchema from './index.schema';

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
export default Volunteer;

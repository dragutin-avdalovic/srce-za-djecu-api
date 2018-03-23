import mongoose from 'mongoose';
import donationSchema from './index.schema';

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;

import mongoose from 'mongoose';
import accessCardSchema from './index.schema';

const AccessCard = mongoose.model('AccessCard', accessCardSchema);
export default AccessCard;

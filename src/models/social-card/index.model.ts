import mongoose from 'mongoose';
import socialCardSchema from './index.schema';

const SocialCard = mongoose.model('SocialCard', socialCardSchema);
export default SocialCard;

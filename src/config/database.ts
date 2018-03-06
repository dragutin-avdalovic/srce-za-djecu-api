import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/srce-za-djecu');

const db = mongoose.connection;
export default db;

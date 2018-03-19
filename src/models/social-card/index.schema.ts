import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  name: String,
  jmbg: Number,
  dateOfBirth: Date,
  placeOfBirth: String,
  municipality: String,
  city: String,
  address: String,
  postNumber: String,
  goingToSchool: Boolean,
  diagnosed: Boolean,
  diagnose: String,
  dateOfDiagnose: Date,
  note: String,
  healthState: {
    type: Number,
    enum: [1, 2, 3, 4]
  }
});

const parentSchema = new mongoose.Schema({
  name: String,
  jmbg: Number,
  citizenId: String,
  issuedBy: String,
  municipality: String,
  city: String,
  address: String,
  postNumber: String,
  tel: String,
  mob: String,
  working: Boolean,
  position: String,
  qualifications: String,
  nameOfEmployer: String
});

const familyMemberSchema = new mongoose.Schema({
  name: String,
  jmbg: Number,
  relationToChild: String
});

const familySchema = new mongoose.Schema({
  unmarried: Boolean,
  married: Boolean,
  divorced: Boolean,
  widow: Boolean,
  other: Boolean,
  familyMembers: [familyMemberSchema],
  chronicalDecease: Boolean,
  disability: Boolean,
  specialNeeds: Boolean,
  familyRelations: {
    type: Number,
    enum: [1, 2, 3]
  }
  // TODO continue filling form
});

const socialCardSchema = new mongoose.Schema({
  child: childSchema,
  mother: parentSchema,
  father: parentSchema,
  family: familySchema
});
export default socialCardSchema;

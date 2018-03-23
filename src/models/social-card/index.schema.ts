import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  name: String,
  jmbg: {
    type: Number,
    required: true
  },
  dateOfBirth: Date,
  placeOfBirth: String,
  municipality: String,
  city: String,
  address: String,
  postNumber: String,
  goingToSchool: Boolean,
  goingToKindergarden: Boolean,
  diagnosed: Boolean,
  diagnose: String,
  dateOfDiagnose: Date,
  note: String,
  healthState: {
    type: Number,
    enum: [0, 1, 2, 3]
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
}, { _id: false });

const familySchema = new mongoose.Schema({
  meritalStatus: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5]
  },
  familyMembers: [familyMemberSchema],
  chronicalDecease: Boolean,
  chronicalDeceaseText: String,
  disability: Boolean,
  disabilityText: String,
  specialNeeds: Boolean,
  familyRelations: {
    type: Number,
    enum: [0, 1, 2]
  },
  incomeBySalary: Boolean,
  incomeBySalaryText: String,
  familyPension: Boolean,
  familyPensionText: String,
  unemploymentBenefit: Boolean,
  unemploymentBenefitText: String,
  disabilityCompensation: Boolean,
  disabilityCompensationText: String,
  compensationForTheSocialProtectionSystem: Boolean,
  compensationForTheSocialProtectionSystemText: String,
  otherIncome: Boolean,
  otherIncomeText: String,
  familyResidence: {
    type: Number,
    enum: [0, 1, 2]
  },
  housingConditions: {
    type: Number,
    enum: [0, 1, 2]
  },
  residentialBuilding: {
    type: Number,
    enum: [0, 1, 2]
  }
});

const socialCardSchema = new mongoose.Schema({
  child: childSchema,
  mother: parentSchema,
  father: parentSchema,
  family: familySchema
});
export default socialCardSchema;

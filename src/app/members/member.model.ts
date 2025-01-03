import { Schema, model } from 'mongoose';
import { TAddress, TMember, TName, TNomini } from './member.interface';

const nameSchema = new Schema<TName>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const addressSchema = new Schema<TAddress>({
  streetAddress: { type: String, required: false },
  area: { type: String, required: true },
  city: { type: String, required: true },
  postCode: { type: String, required: true },
  // newly added
  postOffice: { type: String, required: true },
  // newly added
  district: { type: String, required: true },
  division: { type: String, required: true },
  country: { type: String, default: 'Bangladesh' },
});

const nominiSchema = new Schema<TNomini>({
  name: { type: nameSchema, required: true },
  nominiImg: { type: String, required: true },
  //newly added
  relation: { type: String, required: true },
  //newly added
  email: { type: String, required: true, unique: true },
  nominiPresentAddress: { type: addressSchema, required: true },
  nominiPermanentAddress: { type: addressSchema, required: true },
  
  mob: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^\d+$/.test(value), // Only digits allowed
      message: 'Mobile number should contain only digits.',
    },
    unique: true,
  },
  mobAlt: {
    type: String,
    validate: {
      validator: (value: string) => /^\d+$/.test(value), // Only digits allowed
      message: 'Alternate mobile number should contain only digits.',
    },
  },
  nominiNID: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^\d+$/.test(value), // Only digits allowed
      message: 'NID should contain only digits.',
    },
    unique: true,
  },
});

const memberSchema = new Schema<TMember>({
  id: { type: String, required: true ,unique:true},
  memberImg: { type: String, required: true },
  name: { type: nameSchema, required: true },
  // new some added down
  age:{type:Number, required: true},
  occupation:{ type: String, required: true },
  fathersName:{ type: String, required: true },
  mothersName:{ type: String, required: true },
  wifesName:{ type: String, required: false },
  emergencyNumber:{
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^\d+$/.test(value), // Only digits allowed
      message: 'Mobile number should contain only digits.',
    },
    unique: true,
  },
  // new some added up
  user: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: 'User',
    required: true,
  },
  mob: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^\d+$/.test(value), // Only digits allowed
      message: 'Mobile number should contain only digits.',
    },
    unique: true,
  },
  mobAlt: {
    type: String,
    validate: {
      validator: (value: string) => /^\d+$/.test(value), // Only digits allowed
      message: 'Alternate mobile number should contain only digits.',
    },
  },
  memberNID: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^\d+$/.test(value), // Only digits allowed
      message: 'NID should contain only digits.',
    },
    unique: true,
  },
  membersNomini: { type: nominiSchema, required: true },
  memberPermanentAddress: { type: addressSchema, required: true },
  memberPresentAddress: { type: addressSchema, required: true },
  acccuiredShareDetail:{type:Schema.Types.ObjectId,unique:true,ref:"ShareDetail",required:true},
  installmentList: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: 'Installment',
    required: true,
  },
  isDelited:{type:Boolean, default:false}
});


memberSchema.pre('save', async function (next) {
  // console.log("yoo")
  try{
    const result = await memberModel.findOne({
      $or: [
        { id: this.id },
        { mob: this.mob },
        { memberNID: this.memberNID },
        { 'membersNomini.mob': this.membersNomini.mob },
        { 'membersNomini.nominiNID': this.membersNomini.nominiNID },
      ]
    });
  
    // console.log("result", result)
  
    if(result)
    {
      throw new Error("This user already Exists")
    }
    next()
  }
  catch(err)
  {
    throw Error("somethinng went wrong in member model")
  }

  
});

const memberModel = model<TMember>('Member', memberSchema);



// fail safe for indexing
// async function ensureIndexes() {
//   await memberModel.collection.createIndex({ email: 1 }, { unique: true });
//   await memberModel.collection.createIndex({ mob: 1 }, { unique: true });
//   await memberModel.collection.createIndex({ memberNID: 1 }, { unique: true });
//   await memberModel.collection.createIndex({ user: 1 }, { unique: true });
//   await memberModel.collection.createIndex({ installmentList: 1 }, { unique: true });
//   console.log('Indexes ensured for unique fields');
// }

// ensureIndexes().catch((err) => console.error('Error ensuring indexes:', err));

export default memberModel;

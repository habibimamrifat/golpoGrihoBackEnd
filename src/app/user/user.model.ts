import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from "bcrypt"
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
    },
    email:{
      type:String,
      unique:true,
      required:true,
    },
    password: {
      type: String,
      required: true,
      select:0
    },
    needPasswoedChange: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'precident', 'vicePrecident'],
      default:'member'
    },
    status: {
      type: String,
      enum: ['activeMember', 'blockedMember'],
      default:"activeMember"
    },
    requestState: {
      type: String,
      enum: ['approved', 'waiting', 'canceled'],
      default: 'waiting',
    },
    isLoggedIn:{
      type:Boolean,
      default:false
    },
    isDelited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// hashing password
userSchema.pre('save', async function (next) {
  // console.log("pre saving",this)
  const user = this
  user.password =await bcrypt.hash(user.password, Number(config.Bcrypt_SaltRound))
  next()

});

// make password empty while responce
userSchema.post("save",async function(doc, next){
  doc.password = " "
  next()
})


export const UserModel = model<TUser>('User', userSchema);

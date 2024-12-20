import { Types } from 'mongoose';
import { TUser } from '../user/user.interface';


export type TName = {
  firstName: string;
  lastName: string;
};

export type TAddress = {
  streetAddress?: string;
  area: string;
  city: string;
  postCode: string;
  // newly added
  postOffice:string;
  // newly added
  district: string;
  division: string;
  country: string;
};

export type TNomini = {
  name: TName;
  // neew added
  relation:string;
  // neew added
  nominiImg: string;
  email: string;
  mob: string;
  mobAlt?: string;
  nominiNID: string;
  nominiPresentAddress: TAddress;
  nominiPermanentAddress: TAddress;
};

export type TMember = {
  id?: string;
  memberImg: string;
  name: TName;
  // new some added down
  age:number;
  occupation:string;
  fathersName:string;
  mothersName:string;
  wifesName?:string;
  emergencyNumber:string;
  // new some added up
  user: Types.ObjectId | TUser;
  mob: string;
  mobAlt?: string;
  memberNID: string;
  membersNomini: TNomini;
  memberPermanentAddress: TAddress;
  memberPresentAddress: TAddress;
  acccuiredShareDetail:Types.ObjectId;
  installmentList: Types.ObjectId;
  isDelited:boolean
};

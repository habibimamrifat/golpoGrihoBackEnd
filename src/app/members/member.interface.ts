import { Types } from 'mongoose';
import { TUser } from '../user/user.interface';


export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TAddress = {
  streetAddress?: string;
  area: string;
  city: string;
  postCode: string;
  district: string;
  division: string;
  country: string;
};

export type TNomini = {
  name: TName;
  nominiImg: string;
  email: string;
  mob: string;
  mobAlt?: string;
  nominyImg: string;
  nominiNID: string;
  nominiPresentAddress: TAddress;
  nominiPermanentAddress: TAddress;
};

export type TMember = {
  id?: string;
  memberImg: string;
  name: TName;
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

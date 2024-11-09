import { Date } from 'mongoose';

export type TMonth =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TInstallment = {
  year: string;
  month: TMonth;
  depositAmount: number;
  status: 'waiting' | 'declined' | 'approved';
  installmentDate?: Date;
};

export type TInstallmentList = {
  id: string;
  totalDeposit: number;
  depositList: TInstallment[];
};

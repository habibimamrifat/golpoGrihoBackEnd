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


export type TDeposit = {
  year: string;
  month: TMonth;
  depositAmount:number
  status:"waiting"|"declined"|"approved";
};

export type TDepositList = {
  id: string;
  totalDeposit: number;
  depositList: TDeposit[];
};
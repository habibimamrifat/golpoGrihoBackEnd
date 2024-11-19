export type TIvestmentCycleIput = {
  _id:string
  cycleInput:{
    cycleDetail: string;
  cycleType: "investmentReturn"|"reInvest";
  ammount: number;
  proofImg:string;
  }
};

export type TIvestOrExpennces = {
  motiveName: string;
  expenceImg?: string;
  ExpencesType: 'investment' | 'expence';
  ammountSpent: number;
  profitGenareted:number;
  madeLoss:number;
  isDiscontinued:boolean;
  investmentCycle?: TIvestmentCycleIput[];
};

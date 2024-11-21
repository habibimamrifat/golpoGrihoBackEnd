export type TIvestmentCycleIput = {
  id:string;
  cycleDetail: string;
  cycleType: "investmentReturn"|"reInvest";
  amount: number;
  proofImg:string;
};

export type TContributionDetail = {
  id: string; 
  accuriedShare: number; 
  contribution: number; 
  contributionType: string; 
};

export type TIvestOrExpennces = {
  id:string;
  motiveName: string;
  expenceImg?: string;
  ExpencesType: 'investment' | 'expence';
  ammountSpent: number;
  profitGenareted:number;
  madeLoss:number;
  isDiscontinued:boolean;
  investmentCycle: TIvestmentCycleIput[];
  contributionList:TContributionDetail[];
};

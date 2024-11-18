export type TIvestmentCycleIput = {
  cyclename: string;
  cycleType: 'reinvest' | 'profit' | 'loss';
  ammount: number;
  proofImg:string;
};

export type TIvestOrExpennces = {
  motiveName: string;
  expenceImg?: string;
  ExpencesType: 'investment' | 'expence';
  ammountSpent: number;
  profitGenareted:number;
  madeLoss:number;
  investmentCycle?: TIvestmentCycleIput[];
};

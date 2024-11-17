export type TIvestmentCycleIput = {
  cyclename: string;
  cycleType: 'reinvest' | 'profit' | 'loss';
  ammount: number;
  proofImg:string;
};

export type TIvestOrExpennces = {
  motiveName: string;
  ExpencesType: 'investment' | 'expence';
  ammountSpent: number;
  ammoutGenareted?:number;
  expenceImg?: string;
  investmentCycle?: TIvestmentCycleIput[];
};

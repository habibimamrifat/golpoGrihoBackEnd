export type TShareDetail={
    id:string;
    numberOfShareWonedPersonally:number;
    numberOfPersonalIstallmet:number;
    totalPersonalIstallmetAmmout:number;
    grossPersonalBalance:number;
    totalPersonalprofit:number;
    state:"In Profitable"|"In Loss"|"Nutral"
    inDebt:boolean
    debtAmmount:Number
    isDelited:boolean
}
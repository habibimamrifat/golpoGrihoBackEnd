export type TShareDetail={
    id:string;
    numberOfShareWonedPersonally:number;
    numberOfPersonalIstallmet:number;
    totalPersonalIstallmetAmmout:number;
    grossPersonalBalance:number;
    totalPersonalprofit:number;
    state:"Profitable"|"In Loss"|"Nutral"
    isDelited:boolean
}
import { model, Schema } from "mongoose";
import { TBaner } from "./banner.inteerface";


const banerSchema = new Schema<TBaner>({
totalMember:{type:Number,default:0},
totalNumberOfShare:{type:Number,default:0},
valueOfEachShare:{type:Number,default:1000},
totalNumberOfInvestment:{type:Number,default:0},
totalDepositedAmmount:{type:Number,default:0},
grossTotalBalance:{type:Number,default:0}
})

export const BannerMOdel = model("Bannner", banerSchema)
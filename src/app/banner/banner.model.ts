import { model, Schema } from "mongoose";
import { TBaner } from "./banner.inteerface";


const banerSchema = new Schema<TBaner>({
totalDepositedAmmount:{type:Number,default:0},
totalMember:{type:Number,default:0},
currentTotalBalance:{type:Number,default:0}
})

export const BannerMOdel = model("Bannner", banerSchema)
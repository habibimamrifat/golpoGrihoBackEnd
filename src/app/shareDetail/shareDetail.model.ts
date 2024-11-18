import { model, Schema } from "mongoose";
import { TShareDetail } from "./shareDetail.iterface";

const ShareDetailSchema = new Schema<TShareDetail>({
    id: { type: String, required: true },
    numberOfShareWonedPersonally: { type: Number, required: true, default:1},
    numberOfPersonalIstallmet: { type: Number, required: true, default:0 },
    totalPersonalIstallmetAmmout: { type: Number, required: true, default:0 },
    grossPersonalBalance: { type: Number, required: true, default:0 },
    totalPersonalprofit: { type: Number, required: true, default:0 },
    state:{
      type:String,
      enum:["Profitable","In Loss","Nutral"],
      default:"Nutral"
    },
    isDelited:{
      type:Boolean,
      default:false
    }
  });
  
  // Create and export the Mongoose model
 export const ShareDetailModel = model<TShareDetail>(
    'ShareDetail',
    ShareDetailSchema
  );
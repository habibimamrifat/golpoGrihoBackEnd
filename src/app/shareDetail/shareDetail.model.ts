import { model, Schema } from "mongoose";
import { TShareDetail } from "./shareDetail.iterface";

const ShareDetailSchema = new Schema<TShareDetail>({
    id: { type: String, required: true },
    numberOfShare: { type: Number, required: true, default:1},
    valueOfEachShare: { type: Number, required: true, default:1000 },
    numberOfIstallmet: { type: Number, required: true, default:0 },
    totalIstallmetAmmout: { type: Number, required: true, default:0 },
    grossBalance: { type: Number, required: true, default:0 },
    totalprofit: { type: Number, required: true, default:0 },
  });
  
  // Create and export the Mongoose model
 export const ShareDetailModel = model<TShareDetail>(
    'ShareDetail',
    ShareDetailSchema
  );
import { z } from "zod";

const AcceptRequestValidator = z.object({
    body:z.object({
        id: z.string(),
    requestState: z.enum(["approved", "canceled"]),
    })
});
const MakePrecidentOrVp = z.object({
    body:z.object({
        id: z.string(),
    role: z.enum(["President","Vice president"]),
    })
    
});

const updateShareCount=z.object({
    body:z.object({
        memberId:z.string(),
        numberOfShares:z.number()
    })
   
})

export const adminInputValidator = {
    AcceptRequestValidator,MakePrecidentOrVp,updateShareCount
}
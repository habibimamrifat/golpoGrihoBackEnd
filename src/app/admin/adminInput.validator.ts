import { z } from "zod";

const AcceptRequestValidator = z.object({
    id: z.string(),
    requestState: z.enum(["approved", "canceled"]),
});
const MakePrecidentOrVp = z.object({
    id: z.string(),
    role: z.enum(["precident","vicePrecident"]),
});

const updateShareCount=z.object({
    memberId:z.string(),
    numberOfShares:z.number()
})

export const adminInputValidator = {
    AcceptRequestValidator,MakePrecidentOrVp,updateShareCount
}
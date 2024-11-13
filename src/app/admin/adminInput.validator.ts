import { z } from "zod";

const AcceptRequestValidator = z.object({
    id: z.string(),
    requestState: z.enum(["approved", "canceled"]),
});
const MakePrecidentOrVp = z.object({
    id: z.string(),
    role: z.enum(["precident","vicePrecident"]),
});

export const adminInputValidator = {
    AcceptRequestValidator,MakePrecidentOrVp
}
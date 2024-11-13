import { z } from "zod";

const AcceptRequestValidator = z.object({
    id: z.string(),
    requestState: z.enum(["approved", "canceled"]),
});

export const adminInputValidator = {
    AcceptRequestValidator
}
import z from "zod"
export const sendEmailValidation = z.object({
    body: z.object({
        sendTo: z.union([
            z.literal("all"),                // Exact string "all"
            z.string(),                      // A single email as a string
            z.array(z.string()),             // An array of email strings
        ]),
        subject: z.string().min(1, "Subject is required."),
        message: z.string().min(1, "Message is required."),
    }),
});
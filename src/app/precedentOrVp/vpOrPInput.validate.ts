import { z } from "zod";

const acceptOrDenyVpOrpSchema = z.object({
  id: z.string(),
  installmentStatus: z.object({
    status: z.enum(["approved", "denied"]),
    _id: z.string()
  }),
});

export default acceptOrDenyVpOrpSchema;
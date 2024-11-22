import { z } from "zod";

const acceptOrDenyVpOrpSchema = z.object({
  membrId: z.string(),
  installmentStatus: z.object({
    status: z.enum(["approved", "denied"]),
    installmentList_id: z.string()
  }),
});

export default acceptOrDenyVpOrpSchema;
import { removeTrailingSlash } from "@/lib/utils";
import { z } from "zod";

export const productDetailsSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  url: z.string().url().min(1, "Required").transform(removeTrailingSlash),
});

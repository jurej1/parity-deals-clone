import { removeTrailingSlash } from "@/lib/utils";
import { z } from "zod";

export const productDetailsSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  url: z.string().url().min(1, "Required").transform(removeTrailingSlash),
});

export const productCountryDiscountsSchema = z.object({
  groups: z.array(
    z
      .object({
        countryGroupId: z.string().min(1, "Required"),
        discountPercentage: z
          .number()
          .max(100)
          .min(1)
          .or(z.nan())
          .transform((n) => (isNaN(n) ? undefined : n))
          .optional(),
        coupon: z.string().optional(),
      })
      .refine(
        (value) => {
          const hasCoupone = value.coupon != null && value.coupon.length > 0;
          const hasDiscount = value.discountPercentage != null;
          return !(hasCoupone && !hasDiscount);
        },
        {
          path: ["root"],
          message: "A discount is required if a coupon code is provided",
        }
      )
  ),
});

export const productCustomizationSchema = z.object({
  classPrefix: z.string().optional(),
  backgroundColor: z.string().min(1, "Required"),
  textColor: z.string().min(1, "Required"),
  fontSize: z.string().min(1, "Required"),
  locationMessage: z.string().min(1, "Required"),
  bannerContainer: z.string().min(1, "Required"),
  isSticky: z.boolean(),
});

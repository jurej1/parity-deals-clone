"use server";

import {
  productCountryDiscountsSchema,
  productDetailsSchema,
} from "@/schemas/product";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createProduct as createProductDb,
  deleteProduct as deleteProductDb,
  updateProduct as updateProductDb,
  updateCountryDiscounts as updateCountryDiscountsDb,
} from "../db/products";
import { redirect } from "next/navigation";

export async function createProduct(
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  // validates all the data
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return {
      error: true,
      message: "There was an error creating your product.",
    };
  }

  // create the product inside of the DB folder
  const { id } = await createProductDb({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);
  const errorMsg = "There was an error updating your product.";

  if (!success || userId === null) {
    return {
      error: true,
      message: errorMsg,
    };
  }

  const isSuccess = await updateProductDb(data, { id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Product details updated" : errorMsg,
  };
}

export async function deleteProduct(id: string) {
  const { userId } = await auth();
  const errorMessage = "There was an error deleting your product";
  if (userId == null) {
    return { error: true, mesasge: errorMessage };
  }

  // No error -> delete product
  const isSuccess = await deleteProductDb(id, userId);

  return {
    error: !isSuccess,
    message: isSuccess ? "Successfully deleted your product" : errorMessage,
  };
}

export async function updateCountryDiscounts(
  id: string,
  unsafeData: z.infer<typeof productCountryDiscountsSchema>
) {
  const { userId } = await auth();
  const { success, data } = productCountryDiscountsSchema.safeParse(unsafeData);
  const errorMsg = "There was an error saving your country discounts.";

  if (!success || userId == null) {
    return {
      error: true,
      message: errorMsg,
    };
  }
  const insert: {
    countryGroupId: string;
    productId: string;
    coupon: string;
    discountPercentage: number;
  }[] = [];
  const deleteIds: { countryGroupId: string }[] = [];

  data.groups.forEach((group) => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discountPercentage != null &&
      group.discountPercentage > 0
    ) {
      insert.push({
        countryGroupId: group.countryGroupId,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage / 100,
        productId: id,
      });
    } else {
      deleteIds.push({ countryGroupId: group.countryGroupId });
    }
  });

  await updateCountryDiscountsDb(deleteIds, insert, { productId: id, userId });

  return { error: false, message: "Country discounts saved" };
}

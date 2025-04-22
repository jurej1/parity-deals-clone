"use server";

import { productDetailsSchema } from "@/schemas/product";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createProduct as createProductDb,
  deleteProduct as deleteProductDb,
  updateProduct as updateProductDb,
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

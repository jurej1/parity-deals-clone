import { db } from "@/drizzle/db";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export function getProducts(userId: string, { limit }: { limit?: number }) {
  // give me all products where this user ID matches clerk_user_id
  return db.query.ProductTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });
}

export async function createProduct(data: typeof ProductTable.$inferInsert) {
  // inserting the produt and returning the product id.
  const [newProduct] = await db.insert(ProductTable).values(data).returning({
    id: ProductTable.id,
  });

  try {
    // if the product Id already exists -> do nothing
    await db
      .insert(ProductCustomizationTable)
      .values({
        productId: newProduct.id,
      })
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId,
      });
  } catch (error) {
    // deleting the product in case of error when creating customization row
    await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id));
  }

  return newProduct;
}

export async function deleteProduct(id: string, userId: string) {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));

  return rowCount > 0;
}

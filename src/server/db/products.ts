import { db } from "@/drizzle/db";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";
import {
  CACHE_TAGS,
  dbCache,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { eq, and } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export function getProducts(userId: string, { limit }: { limit?: number }) {
  // when making a get request, tag it as specific as possible
  const cacheFn = dbCache(getProductsInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  });

  return cacheFn(userId, { limit });
}

export async function createProduct(data: typeof ProductTable.$inferInsert) {
  const [newProduct] = await db.insert(ProductTable).values(data).returning({
    id: ProductTable.id,
    userId: ProductTable.clerkUserId,
  });

  try {
    await db
      .insert(ProductCustomizationTable)
      .values({
        productId: newProduct.id,
      })
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId,
      });
  } catch (error) {
    await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id));
  }

  // revalidates my cache information
  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: newProduct.userId,
    id: newProduct.id,
  });

  return newProduct;
}

export async function deleteProduct(id: string, userId: string) {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));

  if (rowCount > 0) {
    // revalidates my cache information
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: userId,
      id: id,
    });
  }

  return rowCount > 0;
}

// does the actual call for us
function getProductsInternal(userId: string, { limit }: { limit?: number }) {
  return db.query.ProductTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });
}

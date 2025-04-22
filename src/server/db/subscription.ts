import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";

export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  return await db.insert(UserSubscriptionTable).values(data);
}

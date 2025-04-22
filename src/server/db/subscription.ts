import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";

export async function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  // if user exsists do NOTHING
  return await db
    .insert(UserSubscriptionTable)
    .values(data)
    .onConflictDoNothing({
      target: UserSubscriptionTable.clerkUserId,
    });
}

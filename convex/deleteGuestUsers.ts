import { internalMutation } from "./_generated/server";

// Function to delete guest users and their associated authAccounts
export const deleteGuestUsers = internalMutation(async ({ db }) => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getMinutes() - 1);

  // Find all guest users older than 1 day
  const usersToDelete = await db
    .query("users")
    .withIndex("by_creation_time", (q) => q.lt("_creationTime", oneDayAgo.getTime()))
    .collect();

  const guestUsers = usersToDelete.filter((user) => user.isGuest);

  // Delete associated authAccounts and the user
  for (const user of guestUsers) {
    await db.delete(user._id);
    const [authAccountsToDelete, authSessionsToDelete] = await Promise.all([
      db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) => q.eq("userId", user._id).eq("provider", "password"))
        .collect(),
      db
        .query("authSessions")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect(),
    ]);

    for (const authAccount of authAccountsToDelete) {
      await db.delete(authAccount._id);
    }

    for (const authSession of authSessionsToDelete) {
      await db.delete(authSession._id);
    }
  }

  return { deleted: guestUsers.length };
});

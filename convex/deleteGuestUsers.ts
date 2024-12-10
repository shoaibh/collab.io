import { internalMutation } from "./_generated/server";

// Function to delete guest users and their associated authAccounts
export const deleteGuestUsers = internalMutation(async ({ db }) => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  // Find all guest users older than 1 day
  const usersToDelete = await db
    .query("users")
    .withIndex("by_creation_time", (q) => q.lt("_creationTime", oneDayAgo.getTime()))
    .collect();

  const guestUsers = usersToDelete.filter((user) => user.isGuest);

  console.log("Guest Users", { guestUsers });

  // Delete associated authAccounts and the user
  for (const user of guestUsers) {
    await db.delete(user._id);
    const [authAccountsToDelete, authSessionsToDelete, members, workspaces] = await Promise.all([
      db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) => q.eq("userId", user._id).eq("provider", "password"))
        .collect(),
      db
        .query("authSessions")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect(),
      db
        .query("members")
        .withIndex("by_user_id", (q) => q.eq("userId", user._id))
        .collect(),
      db
        .query("workspaces")
        .withIndex("by_user_id", (q) => q.eq("userId", user._id))
        .collect(),
    ]);

    for (const workspace of workspaces) {
      const [channels, conversations, members, messages, reactions] = await Promise.all([
        db
          .query("channels")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspace._id))
          .collect(),
        db
          .query("conversations")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspace._id))
          .collect(),
        db
          .query("members")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspace._id))
          .collect(),
        db
          .query("messages")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspace._id))
          .collect(),
        db
          .query("reactions")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspace._id))
          .collect(),
      ]);

      for (const channel of channels) {
        await db.delete(channel._id);
      }

      for (const conversation of conversations) {
        await db.delete(conversation._id);
      }
      for (const reaction of reactions) {
        await db.delete(reaction._id);
      }
      for (const member of members) {
        await db.delete(member._id);
      }
      for (const message of messages) {
        await db.delete(message._id);
      }
      await db.delete(workspace._id);
    }

    for (const member of members) {
      console.log("guest user member to be deleted", { member });
      const [conversations, reactions, messages] = await Promise.all([
        db
          .query("conversations")
          .filter((q) => q.or(q.eq(q.field("memberOneId"), member._id), q.eq(q.field("memberTwoId"), member._id)))
          .collect(),
        db
          .query("reactions")
          .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
          .collect(),
        db
          .query("messages")
          .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
          .collect(),
      ]);
      for (const conversation of conversations) {
        await db.delete(conversation._id);
      }
      for (const reaction of reactions) {
        await db.delete(reaction._id);
      }
      for (const message of messages) {
        await db.delete(message._id);
      }
      const checkMemberExist = await db.get(member._id);
      console.log("Checking if member exists", { checkMemberExist });
      if (checkMemberExist) await db.delete(member._id);
    }

    for (const authAccount of authAccountsToDelete) {
      await db.delete(authAccount._id);
    }

    for (const authSession of authSessionsToDelete) {
      await db.delete(authSession._id);
    }
  }

  return { deleted: guestUsers.length };
});

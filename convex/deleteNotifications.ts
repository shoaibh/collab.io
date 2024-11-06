import { internalMutation } from "./_generated/server";

export const deleteNotifications = internalMutation(async ({ db }) => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 2);

  const notificationsToDelete = await db
    .query("notifications")
    .withIndex("by_creation_time", (q) => q.lt("_creationTime", oneDayAgo.getTime()))
    .collect();

  for (const notifications of notificationsToDelete) {
    await db.delete(notifications._id);
  }

  return { deleted: notificationsToDelete.length };
});

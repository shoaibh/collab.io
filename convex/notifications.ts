import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUnreadNotifications = query({
  args: {
    channelId: v.optional(v.id("channels")),
    memberId: v.optional(v.id("members")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    if (args.channelId) {
      return await ctx.db
        .query("notifications")
        .withIndex("by_user_id_channel_id", (q) => q.eq("userId", userId).eq("channelId", args.channelId))
        .order("desc")
        .collect();
    } else if (args.memberId) {
      console.log("checking");
      return await ctx.db
        .query("notifications")
        .withIndex("by_user_id_sender_id", (q) => q.eq("userId", userId).eq("senderId", args.memberId))
        .order("desc")
        .collect();
    }
  },
});

export const haveReadNotification = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

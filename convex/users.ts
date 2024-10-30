import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db.get(userId);

    if (!user) return null;

    let imageSrc = undefined;

    if (user.image) {
      if (user.image.includes("https://")) {
        imageSrc = user.image;
      } else {
        imageSrc = (await ctx.storage.getUrl(user.image)) || undefined;
      }
    }

    return {
      ...user,
      image: imageSrc,
      imageStorageId: user.image,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    image: v.id("_storage"),
    removeImg: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId || userId !== args.id) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(args.id);

    if (!user) {
      throw new Error("User not found");
    }

    if (args.removeImg) {
      await ctx.storage.delete(args.image);
      await ctx.db.patch(args.id, {
        image: undefined,
      });
    } else {
      await ctx.db.patch(args.id, {
        image: args.image,
      });
    }

    return args.id;
  },
});

import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .unique();
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateThreads = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
    .collect();

  if (messages.length === 0) {
    return { count: 0, image: undefined, timestamp: 0, name: "" };
  }

  const lastMessage = messages[messages.length - 1];

  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: messages.length,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
    name: lastMessageUser?.name,
  };
};

function shouldCreateNotification(preference: "all" | "mentions" | "none", isAuthor: boolean, isMentioned: boolean): boolean {
  if (isAuthor) return false;
  if (preference === "none") return false;
  if (preference === "mentions") return isMentioned;
  return true;
}

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("user not found");
    }

    let _conversation_id = args.conversationId;

    if (!_conversation_id && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversation_id = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q.eq("channelId", args.channelId).eq("parentMessageId", args.parentMessageId).eq("conversationId", _conversation_id),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    console.log("==cjeclo");

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;

            if (!member || !user) return null;

            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThreads(ctx, message._id);
            const image = message.image ? await ctx.storage.getUrl(message.image) : undefined;

            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value).length,
              };
            });

            const mapReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReactions = acc.find((r) => r.value === reaction.value);

                if (existingReactions) {
                  existingReactions.memberIds = Array.from(new Set([...existingReactions.memberIds, reaction.memberId]));
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }
                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[],
            );

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const reactionsWithoutMemberIdProperty = mapReactions.map(({ memberId, ...rest }) => rest);

            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionsWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadName: thread.name,
              threadTimestamp: thread.timestamp,
            };
          }),
        )
      ).filter((message): message is NonNullable<typeof message> => message !== null),
    };
  },
});

export const getById = query({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const message = await ctx.db.get(args.id);

    if (!message) {
      return null;
    }

    const currentMember = await getMember(ctx, message.workspaceId, userId);

    if (!currentMember) return null;

    const member = await populateMember(ctx, message.memberId);

    if (!member) return null;

    const user = await populateUser(ctx, member.userId);

    if (!user) return null;

    const reactions = await populateReactions(ctx, message._id);

    const reactionsWithCounts = reactions.map((reaction) => {
      return {
        ...reaction,
        count: reactions.filter((r) => r.value === reaction.value).length,
      };
    });

    const mapReactions = reactionsWithCounts.reduce(
      (acc, reaction) => {
        const existingReactions = acc.find((r) => r.value === reaction.value);

        if (existingReactions) {
          existingReactions.memberIds = Array.from(new Set([...existingReactions.memberIds, reaction.memberId]));
        } else {
          acc.push({ ...reaction, memberIds: [reaction.memberId] });
        }
        return acc;
      },
      [] as (Doc<"reactions"> & {
        count: number;
        memberIds: Id<"members">[];
      })[],
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const reactionsWithoutMemberIdProperty = mapReactions.map(({ memberId, ...rest }) => rest);

    return {
      ...message,
      image: message.image ? await ctx.storage.getUrl(message.image) : undefined,
      user,
      member,
      reactions: reactionsWithoutMemberIdProperty,
    };
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) {
      throw new Error("You are not a member of this workspace");
    }

    let _conversation_id = args.conversationId;

    if (!_conversation_id && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversation_id = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      conversationId: _conversation_id,
      parentMessageId: args.parentMessageId,
    });

    if (args.channelId) {
      const users = await ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect();

      for (const user of users) {
        const shouldNotify = shouldCreateNotification("all", userId === user.userId, false);

        if (shouldNotify) {
          await ctx.db.insert("notifications", {
            userId: user.userId,
            messageId,
            channelId: args.channelId,
            type: "message",
            createdAt: Date.now(),
          });
        }
      }
    } else if (args.conversationId) {
      const conversation = await ctx.db
        .query("conversations")
        .withIndex("by_id", (q) => q.eq("_id", args.conversationId!))
        .unique();
      if (conversation) {
        const memberOne = await ctx.db
          .query("members")
          .withIndex("by_id", (q) => q.eq("_id", conversation.memberOneId))
          .unique();
        const memberTwo = await ctx.db
          .query("members")
          .withIndex("by_id", (q) => q.eq("_id", conversation.memberTwoId))
          .unique();

        if (memberOne && memberTwo) {
          await ctx.db.insert("notifications", {
            userId: userId === memberOne.userId ? memberTwo.userId : memberOne.userId,
            messageId,
            senderId: userId === memberOne.userId ? memberOne._id : memberTwo._id,
            type: "message",
            createdAt: Date.now(),
          });
        }
      }
    }

    return messageId;
  },
});

export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }

    if (message.image) {
      await ctx.storage.delete(message.image);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

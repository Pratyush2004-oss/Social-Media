import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return ctx.storage.generateUploadUrl();
  },
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image not found");
    // crete post

    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    // increment the number of posts of the user by 1
    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

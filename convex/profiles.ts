import { v } from "convex/values";
import { query } from "./_generated/server";

const publicProfileValidator = v.object({
  _id: v.id("profiles"),
  userId: v.id("users"),
  name: v.string(),
  email: v.string(),
  headline: v.string(),
  summary: v.string(),
  skills: v.array(v.string()),
  yearsOfExperience: v.number(),
  location: v.string(),
  desiredRoles: v.array(v.string()),
  openToRemote: v.boolean(),
  experience: v.array(
    v.object({
      company: v.string(),
      role: v.string(),
      startYear: v.number(),
      endYear: v.optional(v.number()),
      description: v.string(),
    }),
  ),
  education: v.array(
    v.object({
      school: v.string(),
      degree: v.string(),
      year: v.number(),
    }),
  ),
});

/** Load a candidate profile (joined with user info) by Clerk user id. */
export const getByClerkId = query({
  args: { clerkUserId: v.string() },
  returns: v.union(publicProfileValidator, v.null()),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
    if (!user) {
      return null;
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!profile) {
      return null;
    }
    return {
      _id: profile._id,
      userId: user._id,
      name: user.name,
      email: user.email,
      headline: profile.headline,
      summary: profile.summary,
      skills: profile.skills,
      yearsOfExperience: profile.yearsOfExperience,
      location: profile.location,
      desiredRoles: profile.desiredRoles,
      openToRemote: profile.openToRemote,
      experience: profile.experience,
      education: profile.education,
    };
  },
});

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const moderatorRouter = router({
  getSingleUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.moderator.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return user;
  }),

  getAllModerators: publicProcedure.query(async ({ ctx }) => {
    const moderators = await ctx.prisma.moderator.findMany({
      include: {
        user: true,
      },
    });
    return moderators;
  }),

  checkUser: publicProcedure.query(async ({ ctx }) => {
    const hasalredyRegistered = await ctx.prisma.moderator.findFirst({
      where: {
        userId: ctx.session?.user?.id,
      },
    });

    return hasalredyRegistered;
  }),

  registerUser: publicProcedure.mutation(async ({ ctx }) => {
    const updateModerator = await ctx.prisma.moderator.upsert({
      create: {
        userId: ctx.session?.user?.id || "",
        updatedAt: new Date(),
      },
      update: {},
      where: {
        userId: ctx.session?.user?.id || "",
      },
    });
    return updateModerator;
  }),
});

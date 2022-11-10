import { publicProcedure, router } from "../trpc";

export const registerModeratorRouter = router({
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

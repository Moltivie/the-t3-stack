import { router } from "../trpc";
import { authRouter } from "./auth";
import { usersRouter } from "./users";
import { moderatorRouter } from "./moderator";

export const appRouter = router({
  users: usersRouter,
  auth: authRouter,
  registerModerator: moderatorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

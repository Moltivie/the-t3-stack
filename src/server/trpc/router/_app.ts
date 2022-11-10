import { router } from "../trpc";
import { authRouter } from "./auth";
import { usersRouter } from "./users";
import { registerModeratorRouter } from "./register.moderator";

export const appRouter = router({
  users: usersRouter,
  auth: authRouter,
  registerModerator: registerModeratorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

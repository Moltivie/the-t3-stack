import { z } from "zod";
import { truncateString } from "../../../utils/functions";
import { publicProcedure, router } from "../trpc";

type User = {
  id: number;
  name: string;
  avatar: string;
};

type UserDetails = {
  id: number;
  parentId: number;
  country: string;
  company_name: string;
  basicInfo: User;
};

export const usersRouter = router({
  getAll: publicProcedure
    // .input(z.object({ text: z.string().nullish() }).nullish())
    .query(async () => {
      const usersData: User[] = await fetch(
        "https://635fbe57ca0fe3c21aa35cc5.mockapi.io/users"
      ).then((res) => res.json());

      return usersData;
    }),
  getDetails: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const userDetails: UserDetails[] = await fetch(
        `https://635fbe57ca0fe3c21aa35cc5.mockapi.io/users/${input.id}/details`
      ).then((res) => res.json());

      return userDetails;
    }),

  updateDetails: publicProcedure
    .input(
      z.object({
        id: z.string(),
        parentId: z.string(),
        country: z.string(),
        company_name: z.string(),
        basicInfo: z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      // Truncate the country and the username on the backend also
      input.basicInfo.name = truncateString(input.basicInfo.name, 20);
      input.country = truncateString(input.country, 20);

      // Update user basic info
      const user = await fetch(
        `https://635fbe57ca0fe3c21aa35cc5.mockapi.io/users/${input.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input.basicInfo),
        }
      );

      // Update user details
      const userDetails = await fetch(
        `https://635fbe57ca0fe3c21aa35cc5.mockapi.io/users/${input.id}/details/${input.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );

      if (user.status === 200 && userDetails.status === 200) return true;
      return false;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const userDetails = await fetch(
        `https://635fbe57ca0fe3c21aa35cc5.mockapi.io/users/${input.id}/details/${input.id}`,
        {
          method: "DELETE",
        }
      );

      const user = await fetch(
        `https://635fbe57ca0fe3c21aa35cc5.mockapi.io/users/${input.id}`,
        {
          method: "DELETE",
        }
      );

      if (user.status === 200 && userDetails.status === 200) return true;
      return false;
    }),
});

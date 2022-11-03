import { z } from "zod";
import { truncateString } from "../../../utils/functions";
import { protectedProcedure, publicProcedure, router } from "../trpc";

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

const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const usersRouter = router({
  getAll: publicProcedure.query(async () => {
    const usersData: User[] = await fetch(`${BASE_URL}/users`).then((res) =>
      res.json()
    );

    return usersData;
  }),
  getDetails: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const userDetails: UserDetails[] = await fetch(
        `${BASE_URL}/users/${input.id}/details`
      ).then((res) => res.json());

      return userDetails;
    }),

  updateDetails: protectedProcedure
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
      const user = await fetch(`${BASE_URL}/users/${input.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input.basicInfo),
      });

      // Update user details
      const userDetails = await fetch(
        `${BASE_URL}/users/${input.id}/details/${input.id}`,
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const userDetails = await fetch(
        `${BASE_URL}/users/${input.id}/details/${input.id}`,
        {
          method: "DELETE",
        }
      );

      const user = await fetch(`${BASE_URL}/users/${input.id}`, {
        method: "DELETE",
      });

      if (user.status === 200 && userDetails.status === 200) return true;
      return false;
    }),

  create: protectedProcedure.mutation(async () => {
    const createUserPromise = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const user: User = JSON.parse(await res.json());
        return { res, user };
      })
      .then((data) => data);

    const { res, user } = createUserPromise;

    const userDetails = await fetch(`${BASE_URL}/users/${user.id}/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 201 && userDetails.status === 201) return true;
    return false;
  }),
});

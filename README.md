# T3 CRUD APP

[![DeepSource](https://deepsource.io/gh/Moltivie/the-t3-stack.svg/?label=active+issues&show_trend=true&token=Xm8OI4BG1FSCgLi7j-f3PeYW)](https://deepsource.io/gh/Moltivie/the-t3-stack/?ref=repository-badge) [![Known Vulnerabilities](https://snyk.io/test/github/Moltivie/the-t3-stack/badge.svg)](https://snyk.io/test/github/Moltivie/the-t3-stack)

<br>
> For the picky ones, everything inside the repository is free to use.
> No "damage" will affect me. 😊

# What is this?

A web-app that will show a list of people and their information once the clicked user is clicked.

# Why?

I wanted to learn how to work with these tehcnologies since there are not much resources talking about the implementation of a custom CRUD app.

Let me explain, everyone landing on the page will have read only access to the data. Only **certain** logged in users will be able to create, update and delete data. By _"custom"_ I mean only those users having a certain `role` in the database. That's why on the prisma schema you will find a `role` field added on the `User` model. **Only users with a `role` higher than 1 will be able to create, update and delete data.**

# How does it work?

The app is built using the following technologies:

- [NextJS 13](https://nextjs.org/blog/next-13), [NextAuth](https://next-auth.js.org/), [tRPC](https://trpc.io/), [Prisma](https://www.prisma.io/), [PlanetScale](https://planetscale.com/) and [Tailwind CSS](https://tailwindcss.com/)

> You can benefit all these technologies from... 🥁🥁 [HERE](https://init.tips/) !

#### Credits goes to [Theo](https://twitter.com/t3dotgg) and his collaborators for the amazing work!

<br>

#### The data presented in the app is fake and is generated using [mockAPI](https://mockapi.io/) (You may find the URL endpoint somewhere 😉)

# How to use?

1.  Fork or clone the repository
2.  Run `npm install` to install all the dependencies
3.  Define your environment variables in a `*.env` file
4.  Run the following commands:

```bash
npm run build && npm run start
```

5. _(Optional) Run `npx prisma studio` and give yourself a `role` greater than 1 on the `User` table to be able to w/ data._

6. **Enjoy !** 🎉
7. Don't forget to star the repository if you liked it! 😊

# What abot the `.env` file?

#### Here is the structure of the file:

```bash
DATABASE_URL="mysql://user:password@host/database"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Since I am using GitHub's provider:
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

NEXT_PUBLIC_API_ENDPOINT="https://XXXX.mockapi.io"
NEXT_PUBLIC_NODE_ENV="development"
```

There is also an example file named `.env-example` that you can use as a template.

> **Important!** Make sure not to include the double quotes in the file.

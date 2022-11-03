import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../utils/trpc";

import { AiOutlinePlus } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";

import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const { data: dataUsers, isLoading: isLoadingUsers } =
    trpc.users.getAll.useQuery();

  // Get the mutation to create a user
  const createUserMutation = trpc.users.create.useMutation();

  const handleCreate = async () => {
    // Create a user
    const hasBeenCreated = await createUserMutation.mutateAsync();

    // If the user has been created, refresh the page
    if (hasBeenCreated) {
      router.reload();
    }
  };

  // Handle the session
  const { data: session } = useSession();

  // Handle the login button
  const handleLogin = async () => {
    await signIn("github");
  };

  // Handle the logout button
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <Head>
        <title>List Users</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full min-h-screen w-full bg-gray-800">
        <section className="mx-auto flex max-w-7xl flex-col items-center justify-center">
          <header className="grid w-full grid-cols-3 items-center justify-center py-10">
            <h1 className="col-start-2 text-center text-4xl font-bold uppercase tracking-wider text-gray-200">
              List of Users
            </h1>
            {
              // If the user is not logged in, show the login button.
              !session ? (
                <div className="flex w-full justify-end space-x-4">
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 bg-transparent p-2 font-semibold text-gray-200 transition duration-200 hover:bg-gray-200 hover:text-gray-800"
                    // skipcq: JS-0417
                    onClick={handleLogin}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="transform rounded-md border border-gray-200 bg-gray-200 p-2 font-semibold text-gray-700 transition duration-200 hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                // If the user is logged in, show the logout button
                <div className="flex w-full items-center justify-end space-x-4">
                  <Image
                    className="rounded-full border border-gray-200 transition duration-200 hover:scale-105"
                    src={session?.user?.image || "_blank"}
                    width={50}
                    height={50}
                    alt={"avatar"}
                  />
                  <h3 className="text-gray-200">{session.user?.name}</h3>
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 bg-transparent p-2 font-semibold text-gray-200 transition duration-200 hover:bg-gray-200 hover:text-gray-800"
                    // skipcq: JS-0417
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              )
            }
          </header>
          <div className="w-full p-2 lg:p-0">
            {isLoadingUsers && (
              <Image
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                src="/pulse.svg"
                alt="Loading..."
                width={200}
                height={200}
              />
            )}
            {!isLoadingUsers && (
              <ul className="grid grid-cols-3 items-center justify-center gap-4 lg:grid-cols-4">
                {dataUsers?.map((user) => (
                  <Link key={user.id} href={`/getdetails/${user.id}`}>
                    <li
                      key={user.id}
                      className="group my-2 flex w-full cursor-pointer items-center gap-5 rounded-md bg-gray-700 p-4 transition duration-100 hover:scale-105 hover:bg-gray-600"
                    >
                      <Image
                        className="transtition rounded-full border-2 border-gray-200 duration-300 group-hover:scale-125"
                        src={user.avatar}
                        width={50}
                        height={50}
                        alt={`avatar-${user.id}`}
                      />
                      <p className="w-full text-end text-2xl text-gray-200">
                        {user.name}
                      </p>
                    </li>
                  </Link>
                ))}
                {session && (session.user?.role || 1) > 1 && (
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={createUserMutation.isLoading}
                  >
                    <li
                      key="add-user"
                      className={`my-2 flex h-20 w-full border-spacing-y-32 cursor-pointer items-center justify-center gap-5 rounded-md border-2 border-dashed bg-transparent p-4 transition duration-100 hover:scale-105 hover:bg-gray-600 ${
                        createUserMutation.isLoading &&
                        "pointer-events-none opacity-30"
                      }`}
                    >
                      {createUserMutation.isLoading ? (
                        <ImSpinner2 className="animate-spin text-3xl text-gray-200" />
                      ) : (
                        <AiOutlinePlus className="text-3xl text-gray-200" />
                      )}
                    </li>
                  </button>
                )}
              </ul>
            )}
          </div>
        </section>
        <footer className="mt-10 p-4">
          <p className="flex justify-center capitalize text-gray-200">
            Made with ❤️ by Aiman El Aaqdi
          </p>
        </footer>
      </main>
    </>
  );
};

export default Home;

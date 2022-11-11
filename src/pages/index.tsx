import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Index: NextPage = () => {
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
        <title>Home</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full min-h-screen w-full bg-gray-800">
        <section className="mx-auto flex max-w-7xl flex-col items-center justify-center">
          <header className="grid w-full grid-cols-3 items-center justify-center py-10">
            <h1 className="col-start-2 text-center text-4xl font-bold uppercase tracking-wider text-gray-200">
              The Doom
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
                  {(session?.user?.role || 1) >= 2 && (
                    <Link href="/admin">
                      <button
                        type="button"
                        className="mr-3 rounded-md border bg-red-500 p-2 font-semibold text-gray-200 transition duration-200 hover:border-gray-800 hover:bg-red-200 hover:text-gray-800"
                      >
                        Admin
                      </button>
                    </Link>
                  )}
                  <Link href="/profile/me">
                    <Image
                      className="cursor-pointer rounded-full border border-gray-200 transition duration-200 hover:scale-105"
                      src={session?.user?.image || "_blank"}
                      width={50}
                      height={50}
                      alt={"avatar"}
                    />
                  </Link>
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
          <div className="grid w-full grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="w-2/3 text-left text-gray-200">
                <h1 className="text-6xl font-bold tracking-wide">
                  Candidate as a moderator
                </h1>
                <p className="mt-8 text-2xl">
                  Do you feel like you have a lot to offer to the community? Let
                  us know!
                </p>
                <div className="mt-6 flex w-full justify-start space-x-4">
                  <Link href="/candidate/moderator">
                    <button
                      type="button"
                      className="transform rounded-md border border-gray-200 bg-gray-200 py-2 px-4 text-2xl font-semibold tracking-wide text-gray-700 transition duration-100 hover:scale-105"
                    >
                      Candidate
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex h-96 flex-col items-center">
              <div className="w-2/3 text-right text-gray-200">
                <h1 className="mt-10 text-6xl font-bold tracking-wide">
                  Register as a voter
                </h1>
                <p className="mt-8 text-2xl">
                  Register as a voter to vote your favorite user!
                </p>
                <div className="mt-4 flex w-full justify-end space-x-4">
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 bg-transparent p-2 font-semibold text-gray-200 transition duration-200 hover:bg-gray-200 hover:text-gray-800"
                    // skipcq: JS-0417
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
              </div>
            </div>
          </div>
        </section>
        <footer className="absolute bottom-0 grid w-full grid-cols-3 p-4">
          <p className="col-start-2 flex justify-center capitalize text-gray-200">
            Made with ❤️ by Aiman El Aaqdi
          </p>
          <p className="mr-24 flex justify-end text-gray-200">
            Source available on
            <Link
              href="https://github.com/Moltivie/the-t3-stack"
              className="text-blue-400"
            >
              &nbsp;GitHub
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
};

export default Index;

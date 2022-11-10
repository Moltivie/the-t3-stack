import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowBack } from "react-icons/io";
import { trpc } from "../../utils/trpc";

const CandidateModerator: NextPage = () => {
  // Handle the session
  const { data: session, status } = useSession();

  // Handle the login button
  const handleLogin = async () => {
    await signIn("github");
  };

  // Handle the logout button
  const handleLogout = async () => {
    await signOut();
  };

  const mutationRegister = trpc.registerModerator.registerUser.useMutation();
  const { data: userIsRegistered, isLoading: userRegisteredisLoading } =
    trpc.registerModerator.checkUser.useQuery();

  // Handle the submit
  const handleSubmit = async () => {
    await mutationRegister.mutateAsync();
  };

  if (status === "loading") {
    return (
      <>
        <Head>
          <title>My profile</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex h-full min-h-screen w-full items-center justify-center bg-gray-800">
          <h1 className="text-7xl text-gray-200">
            <Image
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              src="/pulse.svg"
              alt="Loading..."
              width={200}
              height={200}
            />
          </h1>
        </main>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Candidate as moderator</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="h-full min-h-screen w-full bg-gray-800">
          <section className="mx-auto flex max-w-7xl flex-col items-center justify-center">
            <header className="grid w-full grid-cols-3 items-center justify-center py-10">
              <h1 className="col-start-2 text-center text-2xl font-bold uppercase tracking-wider text-gray-200">
                Candidate as Moderator
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
            <div className="flex flex-col items-center justify-center">
              {
                // If the user is not logged in, show the login button.
                !session ? (
                  <div className="flex w-full justify-end space-x-4">
                    <h1 className="mt-10 text-5xl text-gray-200">
                      To proceed you need a registered account
                    </h1>
                  </div>
                ) : !userIsRegistered ? (
                  // If the user is logged in, show the logout button
                  <div className="flex w-full items-center justify-start space-x-4">
                    <form>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex flex-col items-center space-y-2">
                          <label
                            htmlFor="email"
                            className="mt-10 mb-6 text-xl font-medium capitalize text-gray-200"
                          >
                            A bit about yourself
                          </label>
                          <textarea
                            name="message"
                            id="message"
                            className={`h-72 w-80 rounded-md border border-gray-200 bg-transparent p-2 font-semibold text-gray-200 outline-none transition duration-200 hover:bg-gray-200 hover:text-gray-800 ${
                              userIsRegistered &&
                              "pointer-events-none opacity-30"
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          className={`w-fit rounded-md border border-gray-200 bg-transparent px-4 py-3 font-semibold text-gray-200 transition duration-200 hover:bg-gray-200 hover:text-gray-800 ${
                            userIsRegistered && "pointer-events-none opacity-30"
                          }`}
                          onClick={handleSubmit}
                          disabled={
                            userRegisteredisLoading ||
                            mutationRegister.isLoading ||
                            (userIsRegistered !== undefined &&
                              userIsRegistered !== null)
                          }
                        >
                          {userRegisteredisLoading ||
                          mutationRegister.isLoading ? (
                            <ImSpinner2 className="animate-spin" />
                          ) : userIsRegistered ? (
                            "You have already applied"
                          ) : (
                            "Join the staff!"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="mt-24 flex h-full w-full flex-col items-center justify-center space-x-4 text-gray-200">
                    <h3 className="mb-10 text-4xl">
                      Your candidature's status:
                    </h3>
                    <div className="flex items-center space-x-2 rounded-md bg-transparent p-2">
                      <div
                        className={`m-1 h-2 w-2 animate-ping rounded-full ${
                          userIsRegistered.status == 1
                            ? "bg-orange-400"
                            : userIsRegistered.status == 2
                            ? "bg-green-400"
                            : "bg-red-400"
                        } `}
                      />
                      <p className="text-xl text-gray-200">
                        {userIsRegistered.status == 1
                          ? "Pending"
                          : userIsRegistered.status == 2
                          ? "Accepted"
                          : "Rejected"}
                      </p>
                    </div>
                  </div>
                )
              }

              <Link href="/">
                <button
                  type="button"
                  className=" group mt-10 flex items-center justify-center rounded-full bg-gray-400 p-5 text-xl uppercase text-gray-600 hover:bg-gray-500"
                >
                  <IoIosArrowBack className="h-10 w-10 group-hover:text-gray-200" />
                </button>
              </Link>
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
  }
};

export default CandidateModerator;

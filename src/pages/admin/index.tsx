import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowBack } from "react-icons/io";
import { trpc } from "../../utils/trpc";

const AdminIndex: NextPage = () => {
  const router = useRouter();

  // Handle the session
  const { data: session, status } = useSession();

  // Handle the logout button
  const handleLogout = async () => {
    await signOut();
  };

  const mutationRegister = trpc.registerModerator.registerUser.useMutation();
  const { data: moderators, isLoading: moderatorsisLoading } =
    trpc.registerModerator.getAllModerators.useQuery();

  if (status === "unauthenticated") {
    router.push("/");
    return <div></div>;
  } else if (status === "loading") {
    return (
      <>
        <Head>
          <title>Admin Dashboard</title>
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
          <title>Admin Dashboard</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="h-full min-h-screen w-full bg-gray-800">
          <section className="mx-auto flex max-w-7xl flex-col items-center justify-center">
            <header className="grid w-full grid-cols-3 items-center justify-center py-10">
              <h1 className="col-start-2 text-center text-2xl font-bold uppercase tracking-wider text-gray-200">
                Admin Dashboard
              </h1>
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
                <h3 className="text-gray-200">{session?.user?.name}</h3>
                <button
                  type="button"
                  className="rounded-md border border-gray-200 bg-transparent p-2 font-semibold text-gray-200 transition duration-200 hover:bg-gray-200 hover:text-gray-800"
                  // skipcq: JS-0417
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            </header>
            <div className="flex flex-col">
              <div className="">
                {!moderatorsisLoading ? (
                  <div className="flex flex-col space-y-4">
                    {moderators?.map((moderator) => (
                      <div
                        key={moderator.id}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <h3 className="text-gray-200">{moderator.id}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-gray-200">{moderator.status}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ImSpinner2 className="animate-spin text-gray-200" />
                    <h3 className="text-gray-200">Loading...</h3>
                  </div>
                )}
              </div>
              <Link href="/" className="h-fit w-fit rounded-full">
                <button
                  type="button"
                  className="group flex items-center justify-center rounded-full bg-gray-400 p-5 text-xl uppercase text-gray-600 hover:bg-gray-500"
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

export default AdminIndex;

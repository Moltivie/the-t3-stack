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

  const { data: moderators, isLoading: moderatorsisLoading } =
    trpc.registerModerator.getAllModerators.useQuery();

  const { data: singleUser, isLoading: singleUserisLoading } =
    trpc.registerModerator.getSingleUser.useQuery();

  if (status === "unauthenticated") {
    router.push("/");
    return <div></div>;
  } else if (status === "loading" || singleUserisLoading) {
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
  }

  if (
    !singleUserisLoading &&
    (singleUser?.rank || 1 >= 2) && // 1 is the rank of moderators. 2 is the rank of admins
    singleUser?.status === 2 // The user has been validated by an admin
  ) {
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
            <div className="flex w-full flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                {!moderatorsisLoading ? (
                  <>
                    {moderators?.map((moderator) => (
                      <div className="grid grid-cols-3 items-center justify-center rounded-md bg-gray-600 py-4 text-xl text-gray-200 shadow-md">
                        <div className="flex items-center justify-center space-x-5">
                          <Image
                            className="rounded-full border border-gray-200"
                            src={moderator.user.image || "_blank"}
                            width={40}
                            height={40}
                            alt={"avatar"}
                          />
                          <h3 className="text-gray-200">
                            {moderator.user.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center">
                          {moderator.user.email}
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <div
                            className={`m-1 h-2 w-2 animate-ping rounded-full ${
                              moderator.status == 1
                                ? "bg-orange-400"
                                : moderator.status == 2
                                ? "bg-green-400"
                                : "bg-red-400"
                            } `}
                          />
                          <p className="text-gray-200">
                            {moderator.status == 1
                              ? "Pending"
                              : moderator.status == 2
                              ? "Accepted"
                              : "Rejected"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ImSpinner2 className="animate-spin text-gray-200" />
                    <h3 className="text-gray-200">Loading...</h3>
                  </div>
                )}
              </div>
              <Link href="/" className="mt-10 h-fit w-fit rounded-full">
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
  } else {
    return <div>test</div>;
  }
};

export default AdminIndex;

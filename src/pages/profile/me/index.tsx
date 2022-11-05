import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { trpc } from "../../../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();

  // Handle the session
  const { data: session, status } = useSession();

  // Handle the logout button
  const handleLogout = async () => {
    await signOut();
  };

  // Modal state
  const [modal, setModal] = useState<boolean>(false);

  // Modal handlers states
  const [username, setUsername] = useState<string>("");

  // Update modal handlers states
  if (modal && username.trim() === "") {
    setUsername(session?.user?.name || "No name");
  }

  // Get the mutation to update the user details
  const mutationUpdate = trpc.users.modifyUserProfile.useMutation();

  const handleUpdate = async () => {
    // Update the user details
    const hasBeenModified = await mutationUpdate.mutateAsync({
      name: username,
    });

    // If the user details have been modified, close the modal and refresh the page
    if (hasBeenModified) {
      setModal(false);
      router.reload();
    }
  };

  // If there is no session, show the redirecting component for two seconds then redirect to homepage
  if (status === "unauthenticated") {
    setTimeout(() => {
      router.push("/");
    }, 2000);
    return (
      <>
        <Head>
          <title>Redirecting...</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="min-h-screen w-full bg-gray-800 text-gray-200">
          <section className="mx-auto flex h-screen w-full max-w-7xl flex-col items-center justify-center space-y-5">
            <header className="grid w-full grid-cols-3 items-center justify-center py-10"></header>
            <h1 className="col-start-2 text-center text-4xl font-bold uppercase tracking-wider">
              Please log in first...
            </h1>
            <h3>
              You will be redirected to the login page in a few seconds...
            </h3>
            <Image src="/pulse.svg" alt="Loading..." width={100} height={100} />
          </section>
        </main>
      </>
    );
  } else if (status === "loading") {
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
          <title>My profile</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="h-full min-h-screen w-full bg-gray-800">
          <section className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center">
            <header className="grid w-full grid-cols-3 items-center justify-center py-10">
              <h1 className="col-start-2 text-center text-4xl font-bold uppercase tracking-wider text-gray-200">
                My profile
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
                <h3 className="text-gray-200">
                  {session?.user?.name || "No name"}
                </h3>
                {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
                  <p className="text-yellow-600">
                    {session?.user?.role
                      ? "Role: " + session?.user?.role
                      : "No role"}
                  </p>
                )}
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
            <section className="mt-24 flex h-full w-full flex-col items-center text-gray-200">
              <h1 className="col-start-2 text-center text-4xl font-bold uppercase tracking-wider">
                Welcome&nbsp;
                <span className="bg-gradient-to-l from-gray-200 to-gray-600 bg-clip-text tracking-wider text-transparent">
                  {session?.user?.name}&nbsp;!
                </span>
              </h1>
              <ul className="mt-10 flex flex-col items-center justify-center">
                {
                  <li
                    key={session?.user?.id || 0}
                    className="my-2 flex w-full items-center gap-5 rounded-md bg-gray-700 p-4 transition duration-100"
                  >
                    <Image
                      className="transtition rounded-full border-2 border-gray-200 duration-300"
                      src={session?.user?.image || "_blank"}
                      width={50}
                      height={50}
                      alt={`avatar-${session?.user?.id || 0}`}
                    />
                    <p className="w-full whitespace-nowrap text-center text-2xl text-gray-200">
                      {session?.user?.name || "No name"}
                    </p>
                    <div className="h-6 border-[0.5px] border-gray-300" />
                    <p className="w-full whitespace-nowrap text-center text-xl text-gray-400">
                      {session?.user?.email || "No email"}
                    </p>
                    <div className="h-6 border-[0.5px] border-gray-300" />
                    <p className="w-full whitespace-nowrap text-center text-xl text-gray-400">
                      {session?.user?.role || "No company"}
                    </p>
                    <div className="h-6 border-[0.5px] border-gray-300" />
                    <button
                      type="button"
                      // skipcq: JS-0417
                      onClick={() => setModal(true)}
                      disabled={modal || mutationUpdate.isLoading}
                    >
                      <MdEdit className="h-10 w-10 rounded-md border border-gray-200 bg-transparent p-2 text-gray-200 hover:border-yellow-200 hover:bg-yellow-200 hover:text-gray-700" />
                    </button>
                  </li>
                }
              </ul>
              <Link href="/">
                <button
                  type="button"
                  className="group mt-5 flex items-center justify-center rounded-full bg-gray-400 p-5 text-xl uppercase text-gray-600 hover:bg-gray-500"
                >
                  <IoIosArrowBack className="h-10 w-10 group-hover:text-gray-200" />
                </button>
              </Link>
            </section>
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
        {
          // Modal
          modal && (
            <div className="fixed top-1/2 left-1/2 z-10 h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform bg-black/60">
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-fit w-96 flex-col items-center gap-y-4 rounded bg-gray-200 p-4 text-gray-600">
                  <h3 className="mt-10 text-3xl font-medium uppercase">
                    Username
                  </h3>
                  <input
                    type="text"
                    maxLength={10}
                    className="h-10 w-3/4 rounded px-2 text-xl outline-none"
                    value={username}
                    // skipcq: JS-0417
                    onChange={(e) => setUsername(e.target.value)}
                    // skipcq: JS-0417
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleUpdate();
                      }
                    }}
                  />
                  <div className="my-5 flex w-full items-center justify-center gap-x-10">
                    <button
                      type="button"
                      className="flex h-10 w-32 items-center justify-center rounded-md bg-gray-600 text-lg uppercase text-gray-200 hover:bg-gray-500"
                      // skipcq: JS-0417
                      onClick={handleUpdate}
                      disabled={mutationUpdate.isLoading}
                    >
                      {mutationUpdate.isLoading ? (
                        <ImSpinner2 className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      type="button"
                      className="h-10 w-32 rounded-md border-2 border-gray-600 text-lg uppercase text-gray-600 hover:bg-gray-600 hover:text-gray-200"
                      // skipcq: JS-0417
                      onClick={() => {
                        // Reset modal handlers states
                        setModal(false);
                        setUsername(session?.user?.name || "");
                      }}
                      disabled={mutationUpdate.isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </>
    );
  }
};

export default ProfilePage;

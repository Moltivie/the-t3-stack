import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowBack } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { trpc } from "../../utils/trpc";

export default function Index() {
  const router = useRouter();

  // Desctructure the userId from the router and parse it to be a number
  const { userId } = router.query;

  // Get the user details from the API
  const { data: dataUserDetails, isLoading: isLoadingUserDetails } =
    trpc.users.getDetails.useQuery({
      id: Number(userId),
    });

  // Modal state
  const [modal, setModal] = useState<boolean>(false);

  // Modal handlers states
  const [username, setUsername] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [companyName, setcompanyName] = useState<string>("");

  // Update modal handlers states
  if (
    modal &&
    username.trim() === "" &&
    country.trim() === "" &&
    companyName.trim() === ""
  ) {
    setUsername(dataUserDetails?.[0]?.basicInfo.name || "No name");
    setCountry(dataUserDetails?.[0]?.country || "No country");
    setcompanyName(dataUserDetails?.[0]?.company_name || "No company name");
  }

  // Get the mutation to update the user details
  const mutationUpdate = trpc.users.updateDetails.useMutation();

  const handleUpdate = async () => {
    // Update the user details
    const hasBeenModified = await mutationUpdate.mutateAsync({
      id: dataUserDetails?.[0]?.id.toString() || "0",
      country: country,
      parentId: dataUserDetails?.[0]?.parentId.toString() || "0",
      company_name: companyName,
      basicInfo: {
        name: username,
        id: dataUserDetails?.[0]?.basicInfo.id.toString() || "0",
        avatar: dataUserDetails?.[0]?.basicInfo.avatar || "_blank",
      },
    });

    // If the user details has been modified, close the modal and refresh the page
    if (hasBeenModified) {
      router.reload();
    }
  };

  // Get the mutation to delete the user
  const mutationDelete = trpc.users.delete.useMutation();

  const handleDelete = async () => {
    // Delete the user
    const hasBeenDeleted = await mutationDelete.mutateAsync({
      id: dataUserDetails?.[0]?.id.toString() || "0",
    });

    // If the user has been deleted, redirect to the home page
    if (hasBeenDeleted) {
      router.push("/");
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
        <title>User Details</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full min-h-screen w-full bg-gray-800">
        <section className="mx-auto flex max-w-7xl flex-col items-center justify-center">
          <header className="grid w-full grid-cols-3 items-center justify-center py-10">
            <h1 className="col-start-2 text-center text-4xl font-bold uppercase tracking-wider text-gray-200">
              User Details
            </h1>
            {
              // If the user is not logged in, show the login button
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
                  <h3 className="text-gray-200">
                    {session.user?.name || "No name"}
                  </h3>
                  {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
                    <p className="text-yellow-600">
                      {session.user?.role
                        ? "Role: " + session.user?.role
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
              )
            }
          </header>
          <div className="">
            {isLoadingUserDetails && (
              <Image
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                src="/pulse.svg"
                alt="Loading..."
                width={200}
                height={200}
              />
            )}

            {!isLoadingUserDetails && (
              <ul className="flex flex-col items-center justify-center">
                {
                  <li
                    key={dataUserDetails?.[0]?.id || 0}
                    className="my-2 flex w-full items-center gap-5 rounded-md bg-gray-700 p-4 transition duration-100"
                  >
                    <Image
                      className="transtition rounded-full border-2 border-gray-200 duration-300"
                      src={dataUserDetails?.[0]?.basicInfo.avatar || "_blank"}
                      width={50}
                      height={50}
                      alt={`avatar-${dataUserDetails?.[0]?.id || 0}`}
                    />
                    <p className="w-full whitespace-nowrap text-center text-2xl text-gray-200">
                      {dataUserDetails?.[0]?.basicInfo.name || "No name"}
                    </p>
                    <div className="h-6 border-[0.5px] border-gray-300" />
                    <p className="w-full whitespace-nowrap text-center text-xl text-gray-400">
                      {dataUserDetails?.[0]?.country || "No country"}
                    </p>
                    <div className="h-6 border-[0.5px] border-gray-300" />
                    <p className="w-full whitespace-nowrap text-center text-xl text-gray-400">
                      {dataUserDetails?.[0]?.company_name || "No company"}
                    </p>
                    {
                      // If the user is logged in and is has the rights, show the edit and delete buttons
                      session && (session.user?.role || 1) > 1 ? (
                        <>
                          <div className="h-6 border-[0.5px] border-gray-300" />
                          <button
                            type="button"
                            // skipcq: JS-0417
                            onClick={() => setModal(true)}
                            disabled={modal || mutationDelete.isLoading}
                          >
                            <MdEdit className="h-10 w-10 rounded-md border border-gray-200 bg-transparent p-2 text-gray-200 hover:border-yellow-200 hover:bg-yellow-200 hover:text-gray-700" />
                          </button>
                          <button
                            type="button"
                            // skipcq: JS-0417
                            onClick={handleDelete}
                            disabled={mutationDelete.isLoading}
                          >
                            {mutationDelete.isLoading ? (
                              <ImSpinner2 className="h-10 w-10 animate-spin rounded-full bg-transparent p-2 text-red-200" />
                            ) : (
                              <MdDelete className="h-10 w-10 rounded-md border border-gray-200 bg-transparent p-2 text-gray-200 hover:border-red-200 hover:bg-red-200 hover:text-gray-700" />
                            )}
                          </button>
                        </>
                      ) : null
                    }
                  </li>
                }
              </ul>
            )}
          </div>
          {!isLoadingUserDetails && (
            <Link href="/">
              <button
                type="button"
                className="group mt-5 flex items-center justify-center rounded-full bg-gray-400 p-5 text-xl uppercase text-gray-600 hover:bg-gray-500"
              >
                <IoIosArrowBack className="h-10 w-10 group-hover:text-gray-200" />
              </button>
            </Link>
          )}
        </section>
        <footer className="absolute bottom-0 w-full p-4">
          <p className="flex justify-center capitalize text-gray-200">
            Made with ❤️ by Aiman El Aaqdi
          </p>
        </footer>
      </main>
      {
        // Modal
        modal && session && (session.user?.role || 1) > 1 && (
          <div className="fixed top-1/2 left-1/2 z-10 h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform bg-black/60">
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex h-fit w-96 flex-col items-center gap-y-4 rounded bg-gray-200 p-4 text-gray-600">
                <h3 className="mt-10 text-3xl font-medium uppercase">
                  Username
                </h3>
                <input
                  type="text"
                  maxLength={20}
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
                <h3 className="text-3xl font-medium uppercase">Country</h3>
                <input
                  type="text"
                  maxLength={20}
                  className="h-10 w-3/4 rounded px-2 text-xl outline-none"
                  value={country}
                  // skipcq: JS-0417
                  onChange={(e) => setCountry(e.target.value)}
                  // skipcq: JS-0417
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleUpdate();
                    }
                  }}
                />
                <h3 className="text-3xl font-medium uppercase">Company name</h3>
                <input
                  type="text"
                  maxLength={20}
                  className="h-10 w-3/4 rounded px-2 text-xl outline-none"
                  value={companyName}
                  // skipcq: JS-0417
                  onChange={(e) => setcompanyName(e.target.value)}
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
                      setUsername(dataUserDetails?.[0]?.basicInfo.name || "");
                      setCountry(dataUserDetails?.[0]?.country || "");
                      setcompanyName(dataUserDetails?.[0]?.company_name || "");
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

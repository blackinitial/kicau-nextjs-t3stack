import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const user = useUser()

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {
            !user.isSignedIn &&
            <SignInButton mode="modal">
              <button className="w-fit rounded-lg py-2 px-8 cursor-pointer active:scale-95
                shadow-md text-xs duration-300 bg-blue-700 active:bg-opacity-80
                ease-in-out bg-transparent font-medium md:text-sm text-white">Sign in</button>
            </SignInButton>
          }
          {
            !!user.isSignedIn &&
            <SignOutButton>
              <button className="w-fit rounded-lg py-2 px-8 cursor-pointer active:scale-95
                shadow-md text-xs duration-300 bg-rose-700 active:bg-opacity-80
                ease-in-out bg-transparent font-medium md:text-sm text-white">Sign out</button>
            </SignOutButton>
          }
        </div>
      </main>
    </>
  );
};

export default Home;

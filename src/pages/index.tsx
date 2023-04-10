import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    }
  });

  if (!user) return null;

  return <div className="flex gap-4 w-full items-center">
    <Image
      src={user.profileImageUrl} 
      alt={`@${user.username || 'username'}'s profile image`} 
      width={64} height={64} 
      className="w-16 h-16 rounded-full" />
    <input
      className="rounded-xl w-full bg-transparent text-white outline-none py-3 px-4 text-xs focus:px-6 duration-200"
      type="text"
      placeholder="What do you think?"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (input !== "") {
            mutate({ content: input });
          }
        }
      }}
      disabled={isPosting}
      />
    {input !== "" && !isPosting && (
      <button 
        onClick={() => mutate({ content: input })} disabled={isPosting}
        className="w-fit h-fit rounded-lg py-2 px-8 cursor-pointer active:scale-95
        shadow-md text-xs duration-300 bg-[#c084fc] active:bg-opacity-80
        ease-in-out bg-transparent font-medium md:text-sm text-white"
      >Post</button>
    )}
    {isPosting && (
      <div className="flex justify-center items-center pr-4">
        <LoadingSpinner size={20} />
      </div>
    )}
  </div>
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="fle grow flex-col overflow-y-scroll">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  // start fetching asap
  api.posts.getAll.useQuery();

  // return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="p-6 flex border-b border-slate-400">
        {
          !isSignedIn &&
          <SignInButton mode="modal">
            <button className="w-fit rounded-lg py-2 px-8 cursor-pointer active:scale-95
              shadow-md text-xs duration-300 bg-[#1d4ed8] active:bg-opacity-80
              ease-in-out bg-transparent font-medium md:text-sm text-white">Sign in</button>
          </SignInButton>
        }

        {isSignedIn && <CreatePostWizard />}
      </div>

      <Feed />

      <div className="flex items-center justify-between p-4 text-xl">
        <div>
        {
          !!isSignedIn && <SignOutButton>
            <button className="w-fit rounded-lg py-2 px-8 cursor-pointer active:scale-95
              shadow-md text-xs duration-300 bg-[#b91c1c] active:bg-opacity-80
              ease-in-out bg-transparent font-medium md:text-sm text-white">Sign out</button>
          </SignOutButton>
        }
        </div>
        <a href="https://github.com/blackinitial/kicau-nextjs-t3stack">
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <div>Github</div>
          </div>
        </a>
      </div>
    </PageLayout>
  );
};

export default Home;

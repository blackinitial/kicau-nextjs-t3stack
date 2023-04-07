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
        shadow-md text-xs duration-300 bg-purple-400 active:bg-opacity-80
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
    <div className="flex flex-col">
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
              shadow-md text-xs duration-300 bg-blue-700 active:bg-opacity-80
              ease-in-out bg-transparent font-medium md:text-sm text-white">Sign in</button>
          </SignInButton>
        }

        {isSignedIn && <CreatePostWizard />}
      </div>

      <Feed />
      
      <div className="flex justify-center p-8">{ !!isSignedIn &&
        <SignOutButton>
          <button className="w-fit rounded-lg py-2 px-8 cursor-pointer active:scale-95
            shadow-md text-xs duration-300 bg-red-700 active:bg-opacity-80
            ease-in-out bg-transparent font-medium md:text-sm text-white">Sign out</button>
        </SignOutButton>
        }
      </div>
    </PageLayout>
  );
};

export default Home;

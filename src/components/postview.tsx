import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div className="flex gap-3 p-8 border-b border-slate-400">
      <Image
        src={author.profileImageUrl} 
        alt={`@${author.username}'s profile image`} 
        width={32} height={32} 
        className="w-8 h-8 rounded-full" />
      <div className="flex flex-col">
        <div className="flex gap-2 items-center text-slate-100">
          <Link href={`/@${author.username}`}>
            <span className="font-normal">{`@${author.username}`}</span>
          </Link>
          <span>•</span>
          <Link href={`/post/${post.id}`}>
            <span className="text-sm font-thin">{`${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}
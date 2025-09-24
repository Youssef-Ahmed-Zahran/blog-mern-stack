import { Link } from "react-router-dom";
import Imagee from "./Imagee";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* image */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3 flex-shrink-0">
          <Imagee
            src={post.img}
            className="rounded-2xl object-cover w-full h-full"
            w="735"
          />
        </div>
      )}
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        {/* title */}
        <Link to={`/post/${post.slug}`} className="text-2xl font-semibold">
          {post.title}
        </Link>
        {/* info */}
        <div className="flex items-center gap-2 text-gray-400 text-xs  md:text-sm">
          <span>Written by</span>
          <Link
            className="text-blue-800"
            to={`/posts?author=${post.user?.username}`}
          >
            {post.user?.username}
          </Link>
          <span>on</span>
          <Link className="text-blue-800" to={`/posts?cat=${post.category}`}>
            {post.category}
          </Link>
          <span>{format(post.createdAt)}</span>
        </div>
        {/* description */}
        <p>{post.desc}</p>
        {/* <p>{post.content}</p> */}
        <Link
          to={`/post/${post.slug}`}
          className="underline text-blue-800 text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;

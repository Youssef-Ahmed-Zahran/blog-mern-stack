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
        <Link
          to={`/post/${post.slug}`}
          className="text-xl sm:text-2xl font-semibold leading-tight"
        >
          {post.title}
        </Link>

        {/* info - Responsive layout that stacks when needed */}
        <div className="text-gray-400 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>Written by</span>
              <Link
                className="text-blue-800 font-medium"
                to={`/posts?author=${post.user?.username}`}
              >
                {post.user?.username}
              </Link>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span>on</span>
              <Link
                className="text-blue-800 font-medium"
                to={`/posts?cat=${post.category}`}
              >
                {post.category}
              </Link>
            </div>
            <span className="whitespace-nowrap">{format(post.createdAt)}</span>
          </div>
        </div>

        {/* description */}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {post.desc}
        </p>

        <Link
          to={`/post/${post.slug}`}
          className="underline text-blue-800 text-sm hover:text-blue-900 transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;

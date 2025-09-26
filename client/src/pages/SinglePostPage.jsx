import { Link, useParams } from "react-router-dom";
import Imagee from "../components/Imagee";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../requestMethod";
import { format } from "timeago.js";
import LoadingSpinner from "../components/LoadingSpinner";

const fetchSinglePost = async (slug) => {
  const res = await makeRequest.get(`/posts/${slug}`);
  return res.data;
};

const SinglePost = () => {
  const { slug } = useParams();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchSinglePost(slug),
  });

  if (isPending) {
    return (
      <LoadingSpinner fullScreen={true} text="Loading post..." size="lg" />
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data) {
    return <span>Post not found!</span>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* details */}
      <div className="flex gap-8">
        {/* title, info, and desc */}
        <div className="flex flex-col lg:w-3/5 gap-8 sm:w-full ">
          {/* title */}
          <h1 className="font-semibold text-xl md:text-3xl xl:text-4xl 2xl:text-5xl">
            {data.title}
          </h1>
          {/* info */}
          <div className="text-gray-400 text-xs md:text-sm flex items-center gap-2 mb-4">
            <span>Written by</span>
            <Link className="text-blue-800">{data.user?.username}</Link>
            <span>on</span>
            <Link className="text-blue-800">{data.category}</Link>
            <span>{format(data.createdAt)}</span>
          </div>
          {/* desc */}
          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>
        {/* image */}
        <div className="hidden lg:block w-2/5">
          {data.img && (
            <Imagee src={data.img} className="rounded-2xl" w="600" />
          )}
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* desc and image */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
          {/* <p>{data.content}</p> */}
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
            fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
            dolorem, dolores eligendi amet perferendis illum repellat nam quam
            facilis veritatis. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
            exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
            Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Libero fuga modi amet error aliquid
            eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
            obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
            fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
            dolorem, dolores eligendi amet perferendis illum repellat nam quam
            facilis veritatis. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
            exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
            Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Libero fuga modi amet error aliquid
            eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
            obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
            fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
            dolorem, dolores eligendi amet perferendis illum repellat nam quam
            facilis veritatis. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
            exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
            Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Libero fuga modi amet error aliquid
            eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
            obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
            fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
            dolorem, dolores eligendi amet perferendis illum repellat nam quam
            facilis veritatis. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
            exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
            Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Libero fuga modi amet error aliquid
            eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
            obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
            fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
            dolorem, dolores eligendi amet perferendis illum repellat nam quam
            facilis veritatis. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
            exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
            Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Libero fuga modi amet error aliquid
            eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
            obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
            fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
            dolorem, dolores eligendi amet perferendis illum repellat nam quam
            facilis veritatis. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
            exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
            Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Libero fuga modi amet error aliquid
            eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
            obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
          </p>
          {/* <div className="w-full aspect-video">
            <Imagee
              src={data.img}
              className="rounded-3xl object-cover w-full h-full"
            />
          </div> */}
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h2 className="mb-4 text-sm font-medium">Author</h2>
          <div className="flex flex-col gap-4">
            {/* profile */}
            <div className="flex items-center gap-8">
              {data.user?.img ? (
                <Imagee
                  src={data.user?.img}
                  className="rounded-full object-cover w-12 h-12"
                  w="48"
                  h="48"
                />
              ) : (
                <Imagee
                  src="userImg.jpeg"
                  className="rounded-full object-cover w-10 h-10"
                  w="40"
                />
              )}
              <Link>{data.user?.username}</Link>
            </div>
            {/* desc */}
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </p>
            {/* social */}
            <div className="flex items-center gap-2">
              <Link>
                <Imagee src="facebook.svg" w="25" h="25" />
              </Link>
              <Link>
                <Imagee src="instagram.svg" w="25" h="25" />
              </Link>
            </div>
          </div>
          {/* Actions */}
          <PostMenuActions post={data} />
          {/* Categories */}
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="underline">
              All
            </Link>
            <Link to="/" className="underline">
              Web Design
            </Link>
            <Link to="/" className="underline">
              Development
            </Link>
            <Link to="/" className="underline">
              Databases
            </Link>
            <Link to="/" className="underline">
              Search Engines
            </Link>
            <Link to="/" className="underline">
              Marketing
            </Link>
          </div>
          {/* Search */}
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      {/* comments */}
      <Comments postId={data._id} />
    </div>
  );
};
export default SinglePost;

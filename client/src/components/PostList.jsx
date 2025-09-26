import PostListItem from "./PostListItem";
import { makeRequest } from "../requestMethod";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  try {
    const res = await makeRequest.get("/posts", {
      params: { page: pageParam, limit: 10, ...searchParamsObj },
    });
    return res.data;
  } catch (error) {
    console.log("fetch posts error: ", error.message);
    throw error;
  }
};

const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, error, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  if (status === "loading") return <LoadingSpinner text="Loading posts..." />;

  if (status === "error") return "An error has occurred: " + error.message;

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="bg-white p-2 rounded-lg">
          <LoadingSpinner size="sm" text="Loading More Posts..." />
        </div>
      }
      endMessage={
        <p className="mb-5 text-center font-medium">
          <b>All Posts Loaded!</b>
        </p>
      }
    >
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;

import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const Home = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* BREADCRUMB */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <span className="font-bold">•</span>
        <span className="text-blue-800">Blogs and Articles</span>
      </div>
      {/* INTRODUCTION */}
      <div className="flex justify-between items-center">
        {/* titles */}
        <div className="flex flex-col gap-4">
          <h1 className="text-gray-800 font-bold text-2xl md:text-4xl lg:text-5xl">
            Your Destination for Creativity, Knowledge, and Growth
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Discover insights, tips, and trends to fuel your creativity and
            success.
          </p>
        </div>
        {/* animated button - desktop only */}
        <Link to="/write" className="hidden md:block relative">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            className="text-lg tracking-widest animate-spin animatedButton"
          >
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75, 75 0 1, 1 150 ,0 a 75, 75 0 1,1 -150, 0"
            />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                Write your story •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share your idea •
              </textPath>
            </text>
          </svg>
          <button className="bg-blue-800 rounded-full flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50"
              height="50"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <line x1="6" y1="18" x2="18" y2="6" />
              <polyline points="9 6 18 6 18 15" />
            </svg>
          </button>
        </Link>
      </div>

      {/* MOBILE WRITE BUTTON */}
      <div className="md:hidden flex justify-center mt-4">
        <Link
          to="/write"
          className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-full flex items-center gap-3 font-semibold text-lg shadow-lg transition-all duration-200 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Write Your Story
        </Link>
      </div>

      {/* CATEGORIES */}
      <MainCategories />
      {/* FEATURED POSTS */}
      <FeaturedPosts />
      {/* POST LIST */}
      <h1 className="mt-8 text-2xl text-gray-600">Recent Posts</h1>
      <PostList />
    </div>
  );
};

export default Home;

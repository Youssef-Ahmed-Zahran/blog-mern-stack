import { Link } from "react-router-dom";
import Search from "../components/Search";

const MainCategories = () => {
  return (
    <div className="hidden md:flex justify-center items-center bg-white rounded-3xl xlg:rounded-full p-4 shadow-lg gap-8">
      {/* links */}
      <div className="flex flex-1 justify-between items-center flex-wrap">
        <Link to="/" className="bg-blue-800 py-2 px-4 text-white rounded-full">
          All Posts
        </Link>
        <Link
          to="/posts?cat=web-design"
          className="hover:bg-blue-50 py-2 px-4 rounded-full"
        >
          Web Design
        </Link>
        <Link
          to="/posts?cat=development"
          className="hover:bg-blue-50 py-2 px-4 rounded-full"
        >
          Development
        </Link>
        <Link
          to="/posts?cat=databases"
          className="hover:bg-blue-50 py-2 px-4 rounded-full"
        >
          Databases
        </Link>
        <Link
          to="/posts?cat=seo"
          className="hover:bg-blue-50 py-2 px-4 rounded-full"
        >
          Search Engines
        </Link>
        <Link
          to="/posts?cat=marketing"
          className="hover:bg-blue-50 py-2 px-4 rounded-full"
        >
          Marketing
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <Search />
    </div>
  );
};

export default MainCategories;

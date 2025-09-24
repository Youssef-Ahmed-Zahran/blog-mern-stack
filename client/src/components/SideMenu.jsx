import { Link, useSearchParams } from "react-router-dom";
import Searh from "../components/Search";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };

  const handleCategoryChange = (category) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    if (category === "all") {
      // Remove the cat parameter to show all posts
      delete currentParams.cat;
      setSearchParams(currentParams);
    } else if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...currentParams,
        cat: category,
      });
    }
  };

  return (
    <div className="h-max sticky top-8">
      {/* search */}
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Searh />
      {/* filters */}
      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] bg-white border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800"
          />
          Newest
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] bg-white border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800"
          />
          Most Popular
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] bg-white border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800"
          />
          Trending
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] bg-white border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800"
          />
          Oldest
        </label>
      </div>
      {/* categories */}
      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div className="underline flex flex-col gap-4 text-sm">
        <Link onClick={() => handleCategoryChange("all")}>All</Link>
        <Link onClick={() => handleCategoryChange("web-design")}>
          Web Design
        </Link>
        <Link onClick={() => handleCategoryChange("development")}>
          Development
        </Link>
        <Link onClick={() => handleCategoryChange("databases")}>Databases</Link>
        <Link onClick={() => handleCategoryChange("seo")}>Search Engines</Link>
        <Link onClick={() => handleCategoryChange("marketing")}>Marketing</Link>
        <Link onClick={() => handleCategoryChange("general")}>General</Link>
      </div>
    </div>
  );
};

export default SideMenu;

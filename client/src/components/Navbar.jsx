import { useState, useContext, useEffect } from "react";
import Imagee from "./Imagee";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner"; // Import your LoadingSpinner

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setOpen(false);
  };

  // Handle logout with loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      handleLinkClick(); // Close mobile menu if open
    }
  };

  // Loading spinner overlay when logging out
  if (isLoggingOut) {
    return <LoadingSpinner fullScreen={true} text="Logging out..." size="lg" />;
  }

  return (
    <div className="w-full h-16 md:h-20 flex justify-between items-center relative">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-xl font-bold z-50">
        <Imagee className="w-8 h-8" src="logo.png" alt="..logo" />
        <span>BLOG</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-4xl z-50 relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "×" : "≡"}
        </div>

        {/* MOBILE LINK LIST */}
        <div
          className={`fixed inset-0 w-full h-screen flex flex-col justify-center items-center gap-8 font-medium text-lg bg-[#ebebff] z-40 transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Link
            to="/"
            className="hover:text-blue-800 transition-colors"
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link
            to="/"
            className="hover:text-blue-800 transition-colors"
            onClick={handleLinkClick}
          >
            Trending
          </Link>
          <Link
            to="/popular"
            className="hover:text-blue-800 transition-colors"
            onClick={handleLinkClick}
          >
            Most Popular
          </Link>
          <Link
            to="/"
            className="hover:text-blue-800 transition-colors"
            onClick={handleLinkClick}
          >
            About
          </Link>
          {currentUser ? (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-blue-800 py-2 px-4 text-white rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link to="/login" onClick={handleLinkClick}>
              <button className="bg-blue-800 py-2 px-4 text-white rounded-full hover:bg-blue-900 transition-colors">
                Login 👋
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/" className="hover:text-blue-800 transition-colors">
          Home
        </Link>
        <Link to="/" className="hover:text-blue-800 transition-colors">
          Trending
        </Link>
        <Link to="/" className="hover:text-blue-800 transition-colors">
          Most Popular
        </Link>
        <Link to="/" className="hover:text-blue-800 transition-colors">
          About
        </Link>
        {currentUser ? (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-blue-800 py-2 px-4 text-white rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-blue-800 py-2 px-4 text-white rounded-full hover:bg-blue-900 transition-colors">
              Login 👋
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;

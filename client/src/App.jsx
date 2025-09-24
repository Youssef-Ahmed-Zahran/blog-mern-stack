import { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  ScrollRestoration,
} from "react-router-dom";

// Global
import Navbar from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import PostListPage from "./pages/PostListPage";
import SinglePostPage from "./pages/SinglePostPage";
import WritePage from "./pages/WritePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Context
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  const Layout = () => {
    return (
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-7xl mx-auto">
        <Navbar />
        <ScrollRestoration />
        <Outlet />
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/write",
          element: <WritePage />,
        },
        {
          path: "/posts",
          element: <PostListPage />,
        },
        {
          path: "/post/:slug",
          element: <SinglePostPage />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      ),
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

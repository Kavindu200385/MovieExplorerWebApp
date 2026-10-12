import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import FavoritesPage from "./pages/FavoritesPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import MovieDetailsPage from "./pages/MovieDetailsPage"
import NotFoundPage from "./pages/NotFoundPage"

/** Declares all public and protected routes using React Router data mode. */
export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          { index: true, Component: HomePage },
          { path: "movie/:id", Component: MovieDetailsPage },
          { path: "favorites", Component: FavoritesPage },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
])

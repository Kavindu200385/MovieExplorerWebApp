import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import FavoritesPage from "./pages/FavoritesPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import MovieDetailsPage from "./pages/MovieDetailsPage"
import MoviesPage from "./pages/MoviesPage"
import NotFoundPage from "./pages/NotFoundPage"
import SignupPage from "./pages/SignupPage"

/** Declares all public and protected routes using React Router data mode. */
export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    Component: AppLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "movies", Component: MoviesPage },
      { path: "movie/:id", Component: MovieDetailsPage },
      {
        Component: ProtectedRoute,
        children: [{ path: "favorites", Component: FavoritesPage }],
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
])

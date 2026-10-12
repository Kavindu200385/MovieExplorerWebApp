import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/** Redirects anonymous visitors while preserving their intended destination. */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate replace state={{ from: location }} to="/login" />
  )
}

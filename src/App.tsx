import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import ErrorBoundary from "./components/ErrorBoundary"

/** Mounts the application’s React Router data router inside an error boundary. */
export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

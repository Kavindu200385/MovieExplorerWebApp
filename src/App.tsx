import { RouterProvider } from "react-router-dom"
import { router } from "./routes"

/** Mounts the application’s React Router data router. */
export default function App() {
  return <RouterProvider router={router} />
}

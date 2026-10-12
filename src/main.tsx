import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import AuthProvider from "./context/AuthContext"
import FavoritesProvider from "./context/FavoritesContext"
import MovieProvider from "./context/MovieContext"
import ThemeProvider from "./context/ThemeContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <MovieProvider>
            <App />
          </MovieProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

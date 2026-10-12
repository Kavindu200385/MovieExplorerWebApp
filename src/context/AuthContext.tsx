import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react"
import useLocalStorage from "../hooks/useLocalStorage"

interface User {
  username: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/** Owns the persisted mock session and fixed demo-credential validation. */
export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useLocalStorage<User | null>(
    "movie-explorer-auth",
    null,
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (username, password) => {
        const isValid = username === "demo" && password === "movie123"
        if (isValid) {
          setUser({ username })
        }
        return isValid
      },
      logout: () => setUser(null),
    }),
    [setUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

import { useState, useEffect } from "react"

interface Admin {
  id: number
  email: string
}

interface AuthState {
  isAuthenticated: boolean
  admin: Admin | null
  token: string | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    token: null,
    loading: true,
  })

  // ✅ logout defined first
  const logout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_data")
    setAuthState({
      isAuthenticated: false,
      admin: null,
      token: null,
      loading: false,
    })
  }

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("admin_token")
    const adminData = localStorage.getItem("admin_data")

    if (token && adminData) {
      try {
        const admin = JSON.parse(adminData)
        setAuthState({
          isAuthenticated: true,
          admin,
          token,
          loading: false,
        })
      } catch (error) {
        console.error("Error parsing admin data:", error)
        logout()
      }
    } else {
      setAuthState((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      })

      if (!res.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await res.json()

      // ✅ Save token and admin data
      localStorage.setItem("admin_token", data.token)
      localStorage.setItem("admin_data", JSON.stringify(data.admin))

      setAuthState({
        isAuthenticated: true,
        admin: data.admin,
        token: data.token,
        loading: false,
      })

      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  // ✅ return everything
  return {
    ...authState,
    login,
    logout,
  }
}

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: (id: string, pw: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // 컴포넌트 마운트 시 localStorage에서 인증 상태 복구
  useEffect(() => {
    const token = localStorage.getItem('demo_auth')
    if (token === 'admin_token_123') {
      setIsLoggedIn(true)
    }
    setIsInitialized(true)
  }, [])

  const login = (id: string, pw: string) => {
    // 테스트용 하드코딩 인증: admin / admin
    if (id === 'admin' && pw === 'admin') {
      localStorage.setItem('demo_auth', 'admin_token_123')
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('demo_auth')
    setIsLoggedIn(false)
  }

  // 초기화가 완료될 때까지 빈 화면 렌더링 (깜빡임 방지)
  if (!isInitialized) return null

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

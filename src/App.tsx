import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import DemoLayout from './layouts/DemoLayout'
import DashboardPage from './pages/DashboardPage'
import PlaceholderPage from './pages/PlaceholderPage'
import LoginPage from './pages/LoginPage'
import { useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <DemoLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      // 사이드바 나머지 메뉴 — 팀원이 채워 넣을 골조 슬롯
      { path: '/:section', element: <ProtectedRoute><PlaceholderPage /></ProtectedRoute> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

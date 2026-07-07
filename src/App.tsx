import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import DemoLayout from './layouts/DemoLayout'
import DashboardPage from './pages/DashboardPage'
import OperatePage from './pages/OperatePage'
import PlaceholderPage from './pages/PlaceholderPage'
import AnalyzePage from './pages/AnalyzePage'
import LoginPage from './pages/LoginPage'
import { useAuth } from './contexts/AuthContext'
import SystemPage from './pages/SystemPage'

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
      // 운영(주문 관리 / 배송 관리 / 경로 최적화)은 한 페이지(OperatePage) 안에서
      // 섹션 스크롤로 이동한다. 사이드바 링크(/orders, /delivery, /routes)는 그대로 둔다.
      { path: '/orders', element: <ProtectedRoute><OperatePage /></ProtectedRoute> },
      { path: '/delivery', element: <ProtectedRoute><OperatePage /></ProtectedRoute> },
      { path: '/routes', element: <ProtectedRoute><OperatePage /></ProtectedRoute> },
      // 분석(분석 리포트)은 AnalyzePage에서 구현한다.
      { path: '/reports', element: <ProtectedRoute><AnalyzePage /></ProtectedRoute> },
      { path: '/system', element: <ProtectedRoute><SystemPage/></ProtectedRoute> },
      { path: '/messages', element: <ProtectedRoute><Navigate to="/system" replace /></ProtectedRoute> },
      { path: '/settings', element: <ProtectedRoute><Navigate to="/system" replace /></ProtectedRoute> },
      // 사이드바 나머지 메뉴 — 팀원이 채워 넣을 골조 슬롯
      { path: '/:section', element: <ProtectedRoute><PlaceholderPage /></ProtectedRoute> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

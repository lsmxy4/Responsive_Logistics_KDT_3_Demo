import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Snowflake,
  LayoutDashboard,
  Package,
  Truck,
  Route,
  Warehouse,
  Users,
  BarChart,
  Bell,
  Settings,
  Menu,
  X,
  ExternalLink,
  Lock,
} from '../components/icons'

/** 메인 랜딩 사이트 주소 — 배포 시 실제 URL로 교체 */
const MAIN_SITE_URL = 'https://responsive-logistics-kdt-3.vercel.app/'

interface NavItem {
  to: string
  label: string
  icon: (p: { className?: string }) => JSX.Element
  end?: boolean
  badge?: { text: string; cls: string }
}

interface NavGroup {
  label: string | null
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [{ to: '/', label: '대시보드', icon: LayoutDashboard, end: true }],
  },
  {
    label: '운영',
    items: [
      { to: '/orders', label: '주문 관리', icon: Package, badge: { text: '12', cls: 'bg-sky-500 text-white' } },
      { to: '/delivery', label: '배송 관리', icon: Truck, badge: { text: '5', cls: 'bg-white/10 text-slate-300' } },
      { to: '/routes', label: '경로 최적화', icon: Route },
    ],
  },
  {
    label: '자원',
    items: [
      { to: '/warehouses', label: '창고 관리', icon: Warehouse },
      { to: '/drivers', label: '기사 관리', icon: Users },
    ],
  },
  {
    label: '분석',
    items: [{ to: '/reports', label: '분석 리포트', icon: BarChart }],
  },
  {
    label: '시스템',
    items: [
      { to: '/messages', label: '알림/메시지', icon: Bell, badge: { text: '3', cls: 'bg-rose-500 text-white' } },
      { to: '/settings', label: '설정', icon: Settings },
    ],
  },
]

function SidebarContent() {
  const { isLoggedIn, logout } = useAuth()
  
  return (
    <div className="flex h-full flex-col">
      {/* brand */}
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-sm shadow-sky-900/10">
          <Snowflake className="h-5 w-5" />
        </span>
        <span className="flex flex-col leading-none">
          <strong className="text-[17px] font-extrabold tracking-tight text-white">Fresh Chain</strong>
          <small className="mt-0.5 text-[11px] font-bold tracking-[0.2em] text-sky-400">WMS DEMO</small>
        </span>
      </div>

      {/* nav */}
      <nav className="scrollbar-none flex-1 overflow-y-auto px-3 pb-4" aria-label="데모 메뉴">
        {NAV_GROUPS.map((group) => (
          <div key={group.label ?? 'root'} className="mt-2">
            {group.label && (
              <span className="block px-3 pb-1.5 pt-4 text-[11px] font-bold tracking-widest text-slate-500">
                {group.label}
              </span>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isLocked = !isLoggedIn && item.to !== '/'
                return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => {
                      if (item.to === '/messages' || item.to === '/settings') {
                        window.dispatchEvent(new CustomEvent('system-section-link-click', { detail: { path: item.to } }))
                      }
                    }}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-500 to-sky-600 font-semibold text-white shadow-sm shadow-sky-900/20'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      } ${isLocked ? 'opacity-60' : ''}`
                    }
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isLocked ? (
                      <Lock className="h-4 w-4 shrink-0 text-slate-500" />
                    ) : item.badge && (
                      <span
                        className={`grid min-w-[22px] place-items-center rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none ${item.badge.cls}`}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </NavLink>
                </li>
              )})}
            </ul>
          </div>
        ))}
      </nav>

      {/* profile + back to main site */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          {isLoggedIn ? (
            <>
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-[14px] font-bold text-white">
                김
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1626] bg-green-400" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <b className="block truncate text-[13px] font-semibold text-white">김신선</b>
                <span className="text-[11px] text-slate-400">물류 관리자</span>
              </div>
              <button onClick={logout} className="text-[11px] text-slate-400 hover:text-white underline">로그아웃</button>
            </>
          ) : (
            <>
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-700 text-[14px] font-bold text-slate-400">
                게
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <b className="block truncate text-[13px] font-semibold text-white">게스트</b>
                <span className="text-[11px] text-slate-400">데모 모드</span>
              </div>
              <NavLink to="/login" className="text-[12px] text-sky-400 hover:text-sky-300 font-bold whitespace-nowrap">로그인</NavLink>
            </>
          )}
        </div>
        <a
          href={MAIN_SITE_URL}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-sky-300"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          메인 홈페이지로 이동
        </a>
      </div>
    </div>
  )
}

function FigmaDownloadButton() {
  const isFigma = typeof window !== 'undefined' && window.location.search.includes('figma=1')
  if (!isFigma) return null

  const download = () => {
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.outerHTML).join('\n')
    const clone = document.documentElement.cloneNode(true) as HTMLElement
    const btn = clone.querySelector('#figma-download-btn')
    if (btn) btn.remove()
    clone.querySelectorAll('script').forEach(s => s.remove())
    
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>Figma Export</title>
  ${styles}
  <style>
    *, ::before, ::after {
      animation: none !important;
      transition: none !important;
    }
  </style>
</head>
<body class="${document.body.className}">
  ${clone.querySelector('body')?.innerHTML || ''}
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'coldchain-dashboard-figma.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      id="figma-download-btn"
      onClick={download}
      className="fixed bottom-6 right-6 z-[9999] rounded-xl bg-violet-600 px-5 py-3 text-[14px] font-bold text-white shadow-2xl transition-transform hover:scale-105"
    >
      Figma HTML 다운로드
    </button>
  )
}

/** 데모 전역 셸: 다크 사이드바(데스크톱 고정 / 모바일 드로어) + 콘텐츠 영역 */
export default function DemoLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  // 라우트 변경 시: 드로어 닫기 + 스크롤 최상단
  useEffect(() => {
    setDrawerOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  // 드로어 열림 시 바디 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-[#0b1626] lg:block" aria-label="사이드바">
        <SidebarContent />
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 text-white">
            <Snowflake className="h-4 w-4" />
          </span>
          <b className="text-[15px] font-extrabold text-slate-900">Fresh Chain</b>
          <small className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">DEMO</small>
        </span>
      </header>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-950/50 transition-opacity duration-300 ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0b1626] shadow-2xl transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="모바일 사이드바"
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="메뉴 닫기"
            className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <SidebarContent />
        </aside>
      </div>

      {/* main */}
      <main className="lg:pl-64">
        <Outlet />
      </main>
      <FigmaDownloadButton />
    </div>
  )
}

import { useEffect, useState } from 'react'
import {
  Activity,
  BarChart,
  Bell,
  Building,
  Clock,
  ExternalLink,
  Grid2X2,
  MapPin,
  Package,
  Route,
  Settings,
  Snowflake,
  Thermometer,
  Truck,
  Users,
  X,
} from '../components/icons'

const resources = [
  {
    title: '창고 관리',
    description: '냉장·냉동 창고의 위치, 온도 구역, 적재율을 한 화면에서 관리합니다.',
    icon: Building,
    stats: '8개 창고 운영 중',
  },
  {
    title: '기사 관리',
    description: '배송 기사 배정 상태와 근무 가능 여부를 실시간으로 확인합니다.',
    icon: Users,
    stats: '24명 기사 등록',
  },
]


const sidebarSections = [
  {
    title: '운영',
    items: [
      { label: '주문 관리', href: '#orders', icon: Package, badge: '12', badgeTone: 'bg-sky-400 text-white' },
      { label: '배송 관리', href: '#delivery', icon: Truck, badge: '5', badgeTone: 'bg-slate-700 text-slate-300' },
      { label: '경로 최적화', href: '#route', icon: Route },
    ],
  },
  {
    title: '자원',
    items: resources.map(({ title, icon: Icon }) => ({ label: title, href: `#${title.replace(' ', '-')}`, icon: Icon })),
  },
  {
    title: '분석',
    items: [{ label: '분석 리포트', href: '#report', icon: BarChart }],
  },
  {
    title: '시스템',
    items: [
      { label: '알림/메시지', href: '#messages', icon: Bell, badge: '3', badgeTone: 'bg-rose-500 text-white' },
      { label: '설정', href: '#settings', icon: Settings },
    ],
  },
]

const summaryCards = [
  { label: '운영 창고', value: '8', unit: '개', icon: Building, tone: 'text-sky-300', bg: 'bg-sky-500/15' },
  { label: '가용 기사', value: '19', unit: '명', icon: Users, tone: 'text-emerald-300', bg: 'bg-emerald-500/15' },
  { label: '평균 적재율', value: '74', unit: '%', icon: BarChart, tone: 'text-violet-300', bg: 'bg-violet-500/15' },
  { label: '온도 정상률', value: '99.2', unit: '%', icon: Thermometer, tone: 'text-cyan-300', bg: 'bg-cyan-500/15' },
]

const warehouses = [
  { name: '강남 냉장 센터', zone: '서울 강남구', temperature: '2.8°C', capacity: 82, status: '정상' },
  { name: '인천 냉동 허브', zone: '인천 서구', temperature: '-18.4°C', capacity: 68, status: '정상' },
  { name: '수원 신선 보관소', zone: '경기 수원시', temperature: '4.1°C', capacity: 91, status: '혼잡' },
  { name: '대전 크로스독', zone: '대전 유성구', temperature: '3.6°C', capacity: 57, status: '정상' },
]

const drivers = [
  { name: '김소연', route: '서울 A-12', vehicle: '냉장 1톤', eta: '12분', status: '배송 중' },
  { name: '박지훈', route: '경기 B-07', vehicle: '냉동 2.5톤', eta: '대기', status: '배차 가능' },
  { name: '이민재', route: '인천 C-03', vehicle: '냉장 1톤', eta: '28분', status: '회차 중' },
  { name: '최유나', route: '충청 D-02', vehicle: '냉동 5톤', eta: '대기', status: '점검 중' },
]


const ACTIVE_RESOURCE_MENU_KEY = 'fresh-chain-active-resource-menu'

const statusClass = (status: string) => {
  if (status === '정상' || status === '배차 가능') return 'bg-emerald-400/15 text-emerald-300'
  if (status === '혼잡' || status === '배송 중') return 'bg-sky-400/15 text-sky-300'
  if (status === '회차 중') return 'bg-violet-400/15 text-violet-300'
  return 'bg-amber-400/15 text-amber-300'
}

export default function ResourcesPage() {
  const [activeHref, setActiveHref] = useState('#창고-관리')

  useEffect(() => {
    const syncHash = () => {
      const savedHref = window.localStorage.getItem(ACTIVE_RESOURCE_MENU_KEY)
      setActiveHref(window.location.hash || savedHref || '#창고-관리')
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  const handleMenuClick = (href: string) => {
    setActiveHref(href)
    window.localStorage.setItem(ACTIVE_RESOURCE_MENU_KEY, href)
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="flex min-h-[760px] flex-col rounded-[28px] border border-slate-800/80 bg-[#0b1626] p-4 shadow-2xl shadow-slate-950/40 lg:sticky lg:top-28 lg:self-start">
          <div className="mb-7 flex items-center gap-3 px-1">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25">
              <Snowflake className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-black leading-5 text-white">Fresh Chain</p>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-sky-400">WMS Demo</p>
            </div>
            <button type="button" aria-label="닫기" className="text-slate-500 transition-colors hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-7" aria-label="WMS 사이드 메뉴">
            <a
              href="#dashboard"
              onClick={() => handleMenuClick('#dashboard')}
              className={`group flex items-center gap-4 rounded-lg px-4 py-3 text-[15px] font-extrabold transition-colors ${
                activeHref === '#dashboard' ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/30' : 'text-slate-400 hover:bg-sky-500 hover:text-white'
              }`}
            >
              <Grid2X2 className={`h-5 w-5 ${activeHref === '#dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              대시보드
            </a>

            {sidebarSections.map((section) => (
              <div key={section.title}>
                <p className="mb-4 px-2 text-xs font-black text-slate-500">{section.title}</p>
                <div className="space-y-1">
                  {section.items.map(({ label, href, icon: Icon, badge, badgeTone }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => handleMenuClick(href)}
                      className={`group flex items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-offset-2 focus:ring-offset-[#0b1626] ${
                        activeHref === href ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/30' : 'text-slate-400 hover:bg-sky-500 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${activeHref === href ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      <span className="min-w-0 flex-1">{label}</span>
                      {badge ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-black leading-5 ${
                            activeHref === href ? 'bg-white/20 text-white' : `${badgeTone} group-hover:bg-white/20 group-hover:text-white`
                          }`}
                        >
                          {badge}
                        </span>
                      ) : null}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-800/80 p-3">
              <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-500 text-sm font-black text-white">
                김
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">김소연</p>
                <p className="text-xs font-bold text-slate-400">물류 관리자</p>
              </div>
            </div>
            <a href="/" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 transition-colors hover:text-sky-300">
              <ExternalLink className="h-4 w-4" />
              메인 홈페이지로 이동
            </a>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-3 text-sm font-bold text-sky-400">Fresh Chain WMS</p>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">자원 관리</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Figma 시안의 자원 영역을 기준으로 창고, 기사, 작업 현황까지 한 번에 확인할 수 있도록 리소스 대시보드 내용을 확장했습니다.
                </p>
              </div>
              <div className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-500/25">+ 자원 등록</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map(({ label, value, unit, icon: Icon, tone, bg }) => (
                <article key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${bg} ${tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {value}<span className="ml-1 text-base font-bold text-slate-500">{unit}</span>
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section id="창고-관리" className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500">WAREHOUSE</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">창고 관리</h2>
                </div>
                <Building className="h-7 w-7 text-sky-300" />
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {warehouses.map(({ name, zone, temperature, capacity, status }) => (
                  <article key={name} className="min-w-[280px] rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-slate-950">{name}</h3>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4" />{zone}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(status)}`}>{status}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                        <p className="text-slate-500">현재 온도</p>
                        <p className="mt-1 font-extrabold text-cyan-300">{temperature}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                        <p className="text-slate-500">적재율</p>
                        <p className="mt-1 font-extrabold text-slate-950">{capacity}%</p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" style={{ width: `${capacity}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="기사-관리" className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500">DRIVER</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">기사 관리</h2>
                </div>
                <Users className="h-7 w-7 text-sky-300" />
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {drivers.map(({ name, route, vehicle, eta, status }) => (
                  <article key={name} className="min-w-[280px] rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-slate-950">{name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{route} · {vehicle}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(status)}`}>{status}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                        <p className="flex items-center gap-2 text-slate-500"><Clock className="h-4 w-4" />도착 예정</p>
                        <p className="mt-1 font-extrabold text-slate-950">{eta}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                        <p className="flex items-center gap-2 text-slate-500"><Activity className="h-4 w-4" />상태</p>
                        <p className="mt-1 font-extrabold text-sky-300">{status}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
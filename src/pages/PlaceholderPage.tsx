import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Building,
  ChevronRight,
  CheckCircle,
  Clock,
  Lock,
  LayoutDashboard,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Snowflake,
  Thermometer,
  Truck,
  Users,
  Warehouse,
} from "../components/icons";
import { useCountUp } from "../hooks/useCountUp";
import { useInView } from "../hooks/useInView";

/** 사이드바 각 메뉴에 대응하는 라벨 (팀원이 페이지를 채울 때 참고) */
const SECTION_LABELS: Record<string, { label: string; desc: string }> = {
  orders: {
    label: "주문 관리",
    desc: "전체 주문 현황을 확인하고 관리하는 페이지입니다.",
  },
  delivery: {
    label: "배송 관리",
    desc: "배송 현황을 실시간으로 모니터링하고 관리하는 페이지입니다.",
  },
  routes: {
    label: "경로 최적화",
    desc: "AI 기반 최적 경로를 설계하고 효율성을 분석하는 페이지입니다.",
  },
  warehouses: {
    label: "창고 관리",
    desc: "창고별 재고·온도 현황을 관리하는 페이지입니다.",
  },
  drivers: {
    label: "기사 관리",
    desc: "배송 기사 배정과 운행 현황을 관리하는 페이지입니다.",
  },
  reports: {
    label: "분석 리포트",
    desc: "운영 지표를 시각화하고 리포트를 생성하는 페이지입니다.",
  },
  messages: {
    label: "알림/메시지",
    desc: "시스템 알림과 메시지를 확인하는 페이지입니다.",
  },
  settings: { label: "설정", desc: "시스템 환경 설정 페이지입니다." },
};

type StatTone = "sky" | "violet" | "cyan" | "amber" | "emerald";
type StatItem = {
  label: string;
  value: number;
  unit: string;
  decimals?: number;
  caption: string;
  icon: typeof Building;
  tone: StatTone;
};

const warehouseStats: StatItem[] = [
  {
    label: "운영 창고",
    value: 8,
    unit: "개",
    caption: "수도권 5 · 지방 3",
    icon: Building,
    tone: "sky",
  },
  {
    label: "평균 적재율",
    value: 74,
    unit: "%",
    caption: "전일 대비 +3.2%",
    icon: Warehouse,
    tone: "violet",
  },
  {
    label: "온도 정상률",
    value: 99.2,
    unit: "%",
    decimals: 1,
    caption: "이탈 알림 1건",
    icon: Thermometer,
    tone: "cyan",
  },
];

const warehouseRows = [
  {
    name: "강남 냉장 센터",
    zone: "서울 강남구",
    temp: 2.8,
    capacity: 82,
    status: "정상",
  },
  {
    name: "인천 냉동 허브",
    zone: "인천 서구",
    temp: -18.4,
    capacity: 68,
    status: "정상",
  },
  {
    name: "수원 신선 보관소",
    zone: "경기 수원시",
    temp: 4.1,
    capacity: 91,
    status: "혼잡",
  },
  {
    name: "대전 크로스독",
    zone: "대전 유성구",
    temp: 3.6,
    capacity: 57,
    status: "정상",
  },
];

const driverStats: StatItem[] = [
  {
    label: "전체 기사",
    value: 42,
    unit: "명",
    caption: "정규 32 · 협력 10",
    icon: Users,
    tone: "amber",
  },
  {
    label: "운행 중",
    value: 26,
    unit: "명",
    caption: "냉장 18 · 냉동 8",
    icon: Truck,
    tone: "sky",
  },
  {
    label: "배차 가능",
    value: 9,
    unit: "명",
    caption: "즉시 투입 가능",
    icon: Activity,
    tone: "emerald",
  },
];
const driverRows = [
  {
    name: "김소연",
    route: "서울 A-12",
    vehicle: "냉장 1톤",
    eta: "12분",
    etaMinutes: 12,
    status: "배송 중",
  },
  {
    name: "박지훈",
    route: "경기 B-07",
    vehicle: "냉동 2.5톤",
    eta: "대기",
    etaMinutes: null,
    status: "배차 가능",
  },
  {
    name: "이민재",
    route: "인천 C-03",
    vehicle: "냉장 1톤",
    eta: "28분",
    etaMinutes: 28,
    status: "회차 중",
  },
  {
    name: "최유나",
    route: "충청 D-02",
    vehicle: "냉동 5톤",
    eta: "대기",
    etaMinutes: null,
    status: "점검 중",
  },
];

const toneClass: Record<StatTone, { box: string; text: string }> = {
  sky: { box: "bg-sky-50 ring-sky-100", text: "text-sky-600" },
  violet: { box: "bg-violet-50 ring-violet-100", text: "text-violet-600" },
  cyan: { box: "bg-cyan-50 ring-cyan-100", text: "text-cyan-600" },
  amber: { box: "bg-amber-50 ring-amber-100", text: "text-amber-600" },
  emerald: { box: "bg-emerald-50 ring-emerald-100", text: "text-emerald-600" },
};

const statusClass = (status: string) => {
  if (status === "정상" || status === "배차 가능")
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "혼잡" || status === "배송 중")
    return "bg-sky-50 text-sky-700 ring-sky-100";
  if (status === "회차 중")
    return "bg-violet-50 text-violet-700 ring-violet-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
};

function AnimatedNumber({
  value,
  active,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  active: boolean;
  decimals?: number;
  suffix?: string;
}) {
  const display = useCountUp(value, { active, decimals, duration: 1200 });

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

function StatCard({
  label,
  value,
  unit,
  decimals,
  caption,
  icon: Icon,
  tone,
}: StatItem) {
  const { ref, inView } = useInView<HTMLElement>();
  const colors = toneClass[tone];

  return (
    <article
      ref={ref}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60"
    >
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${colors.box} ${colors.text}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[13px] font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        <AnimatedNumber
          value={value}
          active={inView}
          decimals={decimals}
          suffix={unit}
        />
      </p>
      <p className="mt-1 text-[12px] font-semibold text-slate-400">{caption}</p>
    </article>
  );
}

function PageHeader({
  eyebrow,
  title,
  desc,
  actionLabel,
  actionTone,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  actionLabel: string;
  actionTone: "sky" | "amber";
}) {
  const actionClass =
    actionTone === "sky"
      ? "bg-sky-500 shadow-sky-500/25 hover:bg-sky-600"
      : "bg-amber-500 shadow-amber-500/25 hover:bg-amber-600";

  return (
    <div>
      <p className="text-[14px] font-semibold text-slate-500">{eyebrow}</p>
      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-[28px] font-black tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-2 text-[14px] font-medium leading-6 text-slate-500">
            {desc}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-400 shadow-sm shadow-slate-200/50 sm:w-72">
            <Search className="h-4 w-4 shrink-0" />
            <input
              className="min-w-0 flex-1 bg-transparent font-semibold outline-none placeholder:text-slate-400"
              placeholder="이름, 지역, 상태 검색"
            />
          </label>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm shadow-slate-200/50 transition-colors hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            필터
          </button>
          <button
            type="button"
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-extrabold text-white shadow-lg transition-colors ${actionClass}`}
          >
            <Plus className="h-4 w-4" />
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const PATH_TO_SECTION_RES: Record<string, string> = {
  '/warehouses': 'warehouses',
  '/drivers': 'drivers',
};

const SECTION_ORDER_RES = [
  { id: 'warehouses', path: '/warehouses' },
  { id: 'drivers', path: '/drivers' },
];

const SCROLL_OFFSET = 24;
const SPY_LINE_OFFSET = 96;

function ResourcePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const warehouseRef = useRef<HTMLElement>(null);
  const driverRef = useRef<HTMLElement>(null);

  const skipNextScrollRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const activePathRef = useRef(location.pathname);

  const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
    'warehouses': warehouseRef,
    'drivers': driverRef,
  };

  useEffect(() => {
    activePathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }

    const container = scrollRef.current;
    const sectionId = PATH_TO_SECTION_RES[location.pathname];
    const target = sectionId ? sectionRefs[sectionId]?.current : null;
    if (!container || !target) return;

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const isFirstSection = location.pathname === SECTION_ORDER_RES[0].path;
    const targetY = isFirstSection ? 0 : Math.max(0, container.scrollTop + (targetRect.top - containerRect.top) - SCROLL_OFFSET);
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (Math.abs(container.scrollTop - targetY) < 1) return;

    isProgrammaticScrollRef.current = true;
    const clearFlag = () => { isProgrammaticScrollRef.current = false; };
    
    if ('onscrollend' in container) {
      container.addEventListener('scrollend', clearFlag, { once: true });
    } else {
      setTimeout(clearFlag, 700);
    }

    container.scrollTo({ top: targetY, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const sections = SECTION_ORDER_RES.map((s) => ({ path: s.path, el: sectionRefs[s.id]?.current })).filter(
      (s): s is { path: string; el: HTMLElement } => !!s.el,
    );
    if (sections.length === 0) return;

    let ticking = false;

    const updateActivePath = () => {
      ticking = false;
      if (isProgrammaticScrollRef.current) return;

      const probeLine = container.getBoundingClientRect().top + SPY_LINE_OFFSET;

      let current = sections[0];
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= probeLine) current = s;
      }

      if (current.path !== activePathRef.current) {
        activePathRef.current = current.path;
        skipNextScrollRef.current = true;
        navigate(current.path, { replace: true, preventScrollReset: true });
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActivePath);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  return (
    <div ref={scrollRef} className="h-[calc(100vh-3.5rem)] overflow-y-auto lg:h-screen">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 border-b border-slate-200/60 pb-6">
          <h1 className="flex items-center gap-3 text-[36px] font-black tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">자원</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Resources
            </span>
          </h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500">
            창고 재고·온도부터 기사 배정과 운행 현황까지 자원 관리 과정을 이
            페이지에서 확인하고 관리하세요.
          </p>
        </div>

        <section ref={warehouseRef} className="mt-8 scroll-mt-6">
          <PageHeader
            eyebrow="자원 관리"
            title="창고 관리"
            desc="창고별 재고·온도 현황을 확인하고 신규 창고를 등록할 수 있습니다."
            actionLabel="신규 창고"
            actionTone="sky"
          />
          <div className="mt-6">
            <WarehousePage />
          </div>
        </section>

        <section
          ref={driverRef}
          className="mt-14 scroll-mt-6 border-t border-slate-200 pt-12"
        >
          <PageHeader
            eyebrow="자원 관리"
            title="기사 관리"
            desc="배송 기사 배정과 운행 현황을 이어서 확인하고 관리할 수 있습니다."
            actionLabel="신규 기사"
            actionTone="amber"
          />
          <div className="mt-6">
            <DriverPage />
          </div>
        </section>
      </div>
    </div>
  );
}

function WarehousePage() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {warehouseStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
            Warehouse Monitor
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-950">
            창고별 재고·온도 현황
          </h3>
        </div>

        <div ref={ref} className="grid gap-4 lg:grid-cols-2">
          {warehouseRows.map(({ name, zone, temp, capacity, status }) => (
            <article
              key={name}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-950">{name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {zone}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${statusClass(status)}`}
                >
                  {status}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <p className="text-slate-500">현재 온도</p>
                  <p className="mt-1 text-lg font-black text-cyan-600">
                    {temp}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <p className="text-slate-500">적재율</p>
                  <p className="mt-1 text-lg font-black text-slate-950">
                    {capacity}%
                  </p>
                </div>
              </div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`grow-bar h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 ${inView ? "is-visible" : ""}`}
                  style={
                    {
                      "--bar-w": `${capacity}%`,
                      "--reveal-delay": "120ms",
                    } as CSSProperties
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function DriverPage() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {driverStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-500">
            Driver Dispatch
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-950">
            기사 배정·운행 현황
          </h3>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200">
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr] bg-slate-50 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400 max-md:hidden">
            <span>기사</span>
            <span>담당 경로</span>
            <span>도착 예정</span>
            <span>상태</span>
          </div>
          <div className="divide-y divide-slate-200 bg-white">
            {driverRows.map(
              ({ name, route, vehicle, eta, status }) => (
                <article
                  key={name}
                  className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-black text-white">
                      {name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-950">{name}</p>
                      <p className="text-xs font-semibold text-slate-400">
                        {vehicle}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-600">{route}</p>
                  <p className="flex items-center gap-2 font-bold text-slate-600">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {eta}
                  </p>
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${statusClass(status)}`}
                  >
                    {status}
                  </span>
                </article>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}

const settingsCards = [
  {
    title: "콜드체인 운영 기준",
    desc: "배송·창고 공통 온도 정책과 이탈 알림 기준을 설정합니다.",
    icon: Snowflake,
    tone: "sky",
    rows: ["냉장 0~5℃", "냉동 -23~-18℃", "이탈 5분 지속 시 알림"],
  },
  {
    title: "권한 및 보안",
    desc: "관리자 승인, 세션 만료, 2단계 인증 정책을 관리합니다.",
    icon: Lock,
    tone: "violet",
    rows: ["관리자 승인 사용", "세션 30분 유지", "중요 작업 2FA 필요"],
  },
  {
    title: "데이터 동기화",
    desc: "WMS·TMS 연동 주기와 실패 재시도 방식을 제어합니다.",
    icon: RefreshCw,
    tone: "emerald",
    rows: ["실시간 주문 동기화", "GPS 30초 주기", "실패 시 3회 재시도"],
  },
];

const initialNotificationRules = [
  { label: "온도 이탈", channel: "앱 푸시 · SMS", enabled: true },
  { label: "배송 지연", channel: "앱 푸시", enabled: true },
  { label: "재고 부족", channel: "이메일 · 앱 푸시", enabled: true },
  { label: "야간 점검", channel: "이메일", enabled: false },
];

function ToggleButton({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onClick}
      className={`inline-flex h-9 min-w-20 items-center justify-center rounded-full px-3 text-xs font-extrabold transition-colors ${
        enabled
          ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25 hover:bg-sky-600"
          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-200"
      }`}
    >
      {enabled ? "ON" : "OFF"}
    </button>
  );
}

function SettingsPage() {
  const { ref: healthRef, inView: healthInView } = useInView<HTMLDivElement>();
  const [notificationRules, setNotificationRules] = useState(initialNotificationRules);

  const toggleNotificationRule = (label: string) => {
    setNotificationRules((rules) =>
      rules.map((rule) =>
        rule.label === label ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <Link to="/" className="transition-colors hover:text-sky-600">
          대시보드
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-600">설정</span>
      </div>

      <section className="mt-4 overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
        <div className="relative isolate bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-6 py-8 text-white sm:px-8 lg:px-10">
          <div className="absolute right-0 top-0 -z-10 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-sky-100 ring-1 ring-white/15">
            <Settings className="h-3.5 w-3.5" />
            System Settings
          </span>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-[30px] font-black tracking-tight sm:text-4xl">시스템 설정</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                콜드체인 물류 운영에 필요한 온도 기준, 알림 채널, 보안 정책을 한 화면에서 점검하고 조정하는 관리자 설정 페이지입니다.
              </p>
            </div>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 text-sm font-extrabold text-white shadow-lg shadow-sky-900/25 transition-colors hover:bg-sky-400">
              <CheckCircle className="h-4 w-4" />
              변경사항 저장
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-3 lg:p-8">
          {settingsCards.map(({ title, desc, icon: Icon, tone, rows }) => {
            const colors = toneClass[tone as StatTone];
            return (
              <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${colors.box} ${colors.text}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-slate-950">{title}</h2>
                <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-slate-500">{desc}</p>
                <div className="mt-5 space-y-2">
                  {rows.map((row) => (
                    <div key={row} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600 ring-1 ring-slate-200">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      {row}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">Notification Rules</p>
              <h2 className="mt-2 text-xl font-black text-slate-950">알림 정책</h2>
            </div>
            <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50">새 규칙 추가</button>
          </div>
          <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200">
            {notificationRules.map((rule) => (
              <div key={rule.label} className="flex items-center justify-between gap-4 bg-white px-5 py-4">
                <div>
                  <p className="font-extrabold text-slate-950">{rule.label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{rule.channel}</p>
                </div>
                <ToggleButton enabled={rule.enabled} onClick={() => toggleNotificationRule(rule.label)} />
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-6 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">System Health</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">설정 점검 상태</h2>
          <div ref={healthRef} className="mt-6 space-y-4">
            {[
              ["보안 정책", "정상", "100%"],
              ["알림 수신", "3개 채널 연결", "86%"],
              ["연동 상태", "마지막 동기화 2분 전", "92%"],
            ].map(([label, caption, width], index) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-extrabold text-slate-700"><span>{label}</span><span>{caption}</span></div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/80"><div className={`grow-bar h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 ${healthInView ? "is-visible" : ""}`} style={{ "--bar-w": width, "--reveal-delay": `${120 + index * 120}ms` } as CSSProperties} /></div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function SkeletonPage() {
  return (
    <>
      <div
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-hidden="true"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="mt-4 h-7 w-28 rounded bg-slate-200/80" />
          </div>
        ))}
      </div>
      <div
        className="mt-4 h-72 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
        aria-hidden="true"
      >
        <div className="h-4 w-40 rounded bg-slate-200/80" />
        <div className="mt-3 h-3 w-64 rounded bg-slate-100" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * 준비 중 페이지 골조(스켈레톤).
 * 창고 관리와 기사 관리는 바로 시연 가능한 간단 화면으로 표시하고, 나머지 메뉴는 골조만 표시한다.
 */
export default function PlaceholderPage() {
  const { section = "" } = useParams();
  const meta = SECTION_LABELS[section];
  const isResourcePage = section === "warehouses" || section === "drivers";

  if (section === "settings") {
    return <SettingsPage />;
  }

  if (isResourcePage) {
    return <ResourcePage />;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <Link to="/" className="transition-colors hover:text-sky-600">
          대시보드
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-600">
          {meta?.label ?? "알 수 없는 페이지"}
        </span>
      </div>

      <div className="mt-4 rounded-[32px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm shadow-slate-200/70">
        <span
          className={`inline-block rounded-full px-3 py-1 text-[12px] font-bold ring-1 ${isResourcePage ? "bg-emerald-50 text-emerald-600 ring-emerald-200" : "bg-amber-50 text-amber-600 ring-amber-200"}`}
        >
          {isResourcePage
            ? "시연용 화면 구성 완료"
            : "골조(스켈레톤) 단계 — 준비 중"}
        </span>
        <h1 className="mt-3 text-[24px] font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {meta?.label ?? "페이지를 찾을 수 없습니다"}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-6 text-slate-500">
          {meta?.desc ?? "주소를 다시 확인해 주세요."}{" "}
          {isResourcePage
            ? "핵심 지표, 목록, 상태 배지를 한 화면에서 확인할 수 있도록 구성했습니다."
            : "이 화면은 팀에서 채워 넣을 페이지 골조입니다."}
        </p>
      </div>

      <div className="mt-6">
        <SkeletonPage />
      </div>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 px-5 py-3 text-[14px] font-bold text-white shadow-sm shadow-sky-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
      >
        <LayoutDashboard className="h-4 w-4" />
        대시보드로 돌아가기
      </Link>
    </div>
  );
}

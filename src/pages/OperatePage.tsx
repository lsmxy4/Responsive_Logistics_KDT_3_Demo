import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import OrderManagementSection from '../components/operate/OrderManagementSection'
import DeliveryManagementSection from '../components/operate/DeliveryManagementSection'
import RouteOptimizationSection from '../components/operate/RouteOptimizationSection'

/** 사이드바 경로 → 이 페이지 안의 스크롤 대상 섹션 매핑 */
const PATH_TO_SECTION: Record<string, string> = {
  '/orders': 'order-management',
  '/delivery': 'delivery-management',
  '/routes': 'route-optimization',
}

const SCROLL_OFFSET = 24

/**
 * 운영 페이지: 주문 관리 · 배송 관리 · 경로 최적화 세 도메인을 한 화면에 구성한다.
 * 사이드바의 운영 메뉴(주문 관리 / 배송 관리 / 경로 최적화)는 각각 /orders, /delivery, /routes로
 * 이동하며, 이 페이지는 그 경로에 대응하는 섹션으로 자동 스크롤한다.
 *
 * DemoLayout은 라우트가 바뀔 때마다 window.scrollTo(top:0)으로 문서 스크롤을 초기화한다
 * (사이드바/레이아웃 쪽 코드라 건드리지 않는다). 그 리셋과 "여기서는 특정 섹션으로
 * 스크롤해야 한다"는 요구가 같은 window 스크롤을 두고 충돌하면, effect 실행 순서나
 * 브라우저 프레임 타이밍에 따라 계속 어긋나기 쉽다. 그래서 이 페이지의 스크롤은
 * window가 아니라, 이 페이지 자신이 소유한 내부 스크롤 컨테이너(아래 <div>)에서
 * 일어나게 만든다. 문서(window) 자체는 뷰포트 높이만큼만 차지해서 스크롤할 일이
 * 없어지므로, DemoLayout이 window를 리셋해도 실제로 보이는 화면에는 아무 영향이
 * 없고, 우리는 내부 컨테이너의 scrollTop만 우리 마음대로 다루면 된다.
 */
export default function OperatePage() {
  const location = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const orderRef = useRef<HTMLElement>(null)
  const deliveryRef = useRef<HTMLElement>(null)
  const routeRef = useRef<HTMLElement>(null)

  const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
    'order-management': orderRef,
    'delivery-management': deliveryRef,
    'route-optimization': routeRef,
  }

  useEffect(() => {
    const container = scrollRef.current
    const sectionId = PATH_TO_SECTION[location.pathname]
    const target = sectionId ? sectionRefs[sectionId]?.current : null
    if (!container || !target) return

    const targetRect = target.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const targetY = Math.max(0, container.scrollTop + (targetRect.top - containerRect.top) - SCROLL_OFFSET)
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    container.scrollTo({ top: targetY, behavior: reduceMotion ? 'auto' : 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div ref={scrollRef} className="h-[calc(100vh-3.5rem)] overflow-y-auto lg:h-screen">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* header */}
        <div className="mb-2">
          <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900">운영</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            주문 접수부터 배송, 경로 최적화까지 운영 전 과정을 이 페이지에서 확인하고 관리하세요.
          </p>
        </div>

        <OrderManagementSection ref={orderRef} />
        <DeliveryManagementSection ref={deliveryRef} />
        <RouteOptimizationSection ref={routeRef} />
      </div>
    </div>
  )
}

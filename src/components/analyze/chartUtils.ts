/** 데이터 최대값을 보기 좋은 축 최대값으로 올림한다 (예: 2,650 → 3,000 / 31,200 → 40,000). */
export function niceMax(value: number): number {
  if (value <= 0) return 100
  const exponent = Math.floor(Math.log10(value))
  const magnitude = Math.pow(10, exponent)
  const residual = value / magnitude
  let niceResidual: number
  if (residual <= 1) niceResidual = 1
  else if (residual <= 2) niceResidual = 2
  else if (residual <= 5) niceResidual = 5
  else niceResidual = 10
  return niceResidual * magnitude
}

/** 축 눈금 라벨 포맷 (1,000 이상이면 K 단위로 축약) */
export function formatTick(value: number): string {
  if (value === 0) return '0'
  if (value % 1000 === 0) return `${value / 1000}K`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toLocaleString()
}

/** 0부터 max까지 `steps`등분한 눈금 배열 */
export function buildTicks(max: number, steps = 5): number[] {
  return Array.from({ length: steps + 1 }, (_, i) => Math.round((max / steps) * i))
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Snowflake, ExternalLink, TriangleAlert } from '../components/icons'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(id, pw)
    if (success) {
      navigate('/', { replace: true })
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[20%] h-[60%] w-[50%] rounded-full bg-sky-200/50 blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[50%] w-[40%] rounded-full bg-emerald-200/40 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Card */}
        <div className="rounded-3xl border border-white bg-white/70 px-8 py-10 shadow-2xl shadow-sky-900/10 backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-500/30">
              <Snowflake className="h-8 w-8" />
            </span>
            <h1 className="mt-5 text-[24px] font-extrabold tracking-tight text-slate-900">
              관리자 로그인
            </h1>
            <p className="mt-2 text-[14px] text-slate-500">
              Fresh Chain WMS 데모 시스템에 로그인하여<br />
              모든 기능을 해금하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-600">
                <TriangleAlert className="h-4 w-4 shrink-0" />
                아이디 또는 비밀번호가 일치하지 않습니다.
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-slate-700" htmlFor="id">
                아이디
              </label>
              <input
                id="id"
                type="text"
                value={id}
                onChange={(e) => {
                  setId(e.target.value)
                  setError(false)
                }}
                placeholder="admin"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white/50 px-4 text-[15px] font-medium text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                required
              />
            </div>
            
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-slate-700" htmlFor="pw">
                비밀번호
              </label>
              <input
                id="pw"
                type="password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value)
                  setError(false)
                }}
                placeholder="admin"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white/50 px-4 text-[15px] font-medium text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-[15px] font-bold text-white shadow-md shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30"
            >
              로그인
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://responsive-logistics-kdt-3.vercel.app/"
            className="flex items-center gap-1.5 text-[14px] font-medium text-slate-500 transition-colors hover:text-sky-600"
          >
            <ExternalLink className="h-4 w-4" />
            랜딩 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}

import { type ReactNode } from 'react'

export function PageHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  return (
    <div className="bg-yellow-400 px-4 py-4 shadow-md">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-yellow-900 font-bold text-xl leading-none p-1 -ml-1">
            ←
          </button>
        )}
        <div className="text-left">
          <h1 className="text-yellow-900 font-bold text-xl leading-tight">{title}</h1>
          {subtitle && <p className="text-yellow-800 text-sm">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const base = 'px-4 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200',
    ghost: 'text-gray-600 hover:bg-gray-100',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function CounterInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  demeritsEach,
  totalDemerits,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  demeritsEach?: number
  totalDemerits?: number
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {demeritsEach != null && (
          <span className="ml-2 text-xs text-red-500">({demeritsEach} ea{max != null ? `, max ${max * demeritsEach}` : ''})</span>
        )}
        {totalDemerits != null && totalDemerits > 0 && (
          <span className="ml-2 text-xs font-bold text-red-600">= {totalDemerits} pts</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center active:scale-95"
        >
          −
        </button>
        <span className="w-8 text-center font-bold text-gray-900">{value}</span>
        <button
          onClick={() => onChange(max != null ? Math.min(max, value + 1) : value + 1)}
          className="w-9 h-9 rounded-full bg-yellow-400 text-yellow-900 font-bold text-lg flex items-center justify-center active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  )
}

export function CheckItem({
  label,
  checked,
  onChange,
  demerits,
  penalty = false,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  demerits: number
  penalty?: boolean
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer select-none ${checked ? (penalty ? 'bg-red-50' : 'bg-green-50') : ''} -mx-4 px-4`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            checked
              ? penalty ? 'bg-red-500 border-red-500' : 'bg-green-500 border-green-500'
              : 'border-gray-300 bg-white'
          }`}
        >
          {checked && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <span className="text-sm font-medium text-gray-800 leading-tight">{label}</span>
      </div>
      <span className={`text-xs font-bold ml-2 flex-shrink-0 ${penalty && checked ? 'text-red-600' : 'text-gray-400'}`}>
        {demerits > 0 ? `−${demerits}` : `${demerits}`}
      </span>
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 pt-4 pb-2">{children}</h3>
  )
}

export function ScoreBadge({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? score / max : 0
  const color = pct >= 0.9 ? 'text-green-700 bg-green-100' : pct >= 0.7 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${color}`}>
      {score}/{max}
    </span>
  )
}

import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full px-4 py-2.5 rounded-xl border bg-surface-50 text-slate-800
            placeholder:text-slate-300 text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 focus:bg-white
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50/30' : 'border-surface-200'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-[11px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

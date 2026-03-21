import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-glow focus:ring-primary-300',
  secondary: 'bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-200',
  danger: 'bg-accent-danger text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-glow-red focus:ring-red-200',
  ghost: 'bg-transparent text-slate-600 hover:bg-surface-100 hover:text-slate-800 focus:ring-slate-200',
  outline: 'bg-transparent text-slate-600 border border-surface-200 hover:bg-surface-50 hover:border-surface-300 focus:ring-slate-200',
}

const sizes = {
  xs: 'px-2.5 py-1 text-[11px] gap-1',
  sm: 'px-3.5 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`
        inline-flex items-center justify-center rounded-xl font-semibold
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-1
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        ${variants[variant] || variants.primary}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5" />
      ) : null}
      {children}
    </motion.button>
  )
}

export default Button

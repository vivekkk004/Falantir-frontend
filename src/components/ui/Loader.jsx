import { motion } from 'framer-motion'

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-3 border-surface-200 border-t-primary-500 rounded-full`}
        style={{ borderWidth: '3px' }}
      />
      {text && (
        <p className="text-sm text-slate-400 font-medium">{text}</p>
      )}
    </div>
  )
}

export default Loader

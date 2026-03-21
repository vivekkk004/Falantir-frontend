import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'p-5',
  glass = false,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -3, boxShadow: '0 12px 40px -8px rgba(0,0,0,0.12)' } : {}}
      transition={{ duration: 0.2 }}
      className={`
        rounded-2xl border shadow-card
        ${glass ? 'bg-white/60 backdrop-blur-xl border-white/40' : 'bg-white border-surface-200/60'}
        ${padding}
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card

import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)' } : {}}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-2xl border border-surface-100 shadow-card
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

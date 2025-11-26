import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card ${className} ${hover ? 'hover:shadow-card-hover' : ''}`}
    >
      {children}
    </motion.div>
  );
}


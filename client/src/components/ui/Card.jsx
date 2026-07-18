import { motion } from 'framer-motion';

const Card = ({ hover = true, className = '', children, ...props }) => {
  return (
    <motion.div
      className={`card-ui ${hover ? 'card-ui--hover' : ''} ${className}`}
      whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(26,35,126,0.1)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;

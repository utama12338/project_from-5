import { motion } from 'framer-motion';
import { BUTTON_LABELS } from '@/constants/labels';

const containerVariants = {
  initial: { 
    scale: 1,
    y: 0,
    rotate: 0,
    boxShadow: 'var(--button-shadow)'
  },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: 'var(--button-shadow-hover)',
    transition: { 
      duration: 0.2,
      when: "beforeChildren" 
    }
  },
  tap: {
    scale: 0.98
  }
};

const iconVariants = {
  initial: { rotate: 0 },
  hover: {
    rotate: 180,
    transition: { 
      duration: 0.3, 
      ease: "easeInOut" 
    }
  }
};

const textVariants = {
  initial: { x: 0 },
  hover: {
    x: 3,
    transition: { duration: 0.2 }
  }
};

interface AddNewEntriesButtonProps {
  onClick: () => void;
}

const AddNewEntriesButton = ({ onClick }: AddNewEntriesButtonProps) => {
  return (
<motion.button
  type="button"
  onClick={onClick}
  className="group px-4 py-2.5 
    text-var(--text-primary)
    bg-[var(--card-background)]
    dark:bg-[var(--card-background)]
    hover:bg-[var(--background-secondary)]
    dark:hover:bg-[var(--background-secondary)]
    rounded-lg
    transform transition-all duration-200
    flex items-center space-x-2 font-medium"
  variants={containerVariants}
  initial="initial"
  whileHover="hover"
  whileTap="tap"
  animate="initial"
>
      <motion.div variants={iconVariants}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-[var(--button-primary)] dark:text-white"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </motion.div>
      <motion.span variants={textVariants}>
        {BUTTON_LABELS.add}
      </motion.span>
    </motion.button>
  );
};

export default AddNewEntriesButton;

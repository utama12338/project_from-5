import { motion } from 'framer-motion';
import { BUTTON_LABELS } from '@/constants/labels';

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98
  }
};

const iconVariants = {
  hover: {
    rotate: 90,
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
      className="group px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 
        text-white rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
        transform transition-all duration-200 hover:shadow-xl
        flex items-center space-x-2 font-medium"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        variants={iconVariants}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 4v16m8-8H4" 
        />
      </motion.svg>
      <span>{BUTTON_LABELS.add}</span>
    </motion.button>
  );
};

export default AddNewEntriesButton;

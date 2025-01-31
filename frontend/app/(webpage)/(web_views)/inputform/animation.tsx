import { motion, type Variants } from 'framer-motion';
// 
export const backButtonVariants = {
    initial: {
      backgroundColor: "transparent"
    },
    hover: {
      backgroundColor: "rgba(99, 102, 241, 0.05)"
    }
  };
  
 export const backIconVariants: Variants = {
    hover: {
      x: [0, 0, -5], // Sliding left and right
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse"
      }
    },
    initial: {
      x: 0
    }
  };


  export const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };
  
  export const iconVariants = {
    hover: {
      scale: [1, 0.1, 1.2],
      rotate: [0, 0, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  
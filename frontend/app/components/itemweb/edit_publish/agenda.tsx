import React from 'react'
import { motion } from 'framer-motion';

export const tabVariants = {
  active: {
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    color: "#EC4899",
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  inactive: {
    backgroundColor: "transparent",
    color: "#6B7280",
    scale: 1
  }
};

export const tabUnderlineVariants = {
  active: {
    width: "100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  inactive: {
    width: "0%"
  }
};

interface AgendaProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const tabs = [
  { id: 'system', label: 'ข้อมูลระบบ' },
  { id: 'environment', label: 'สภาพแวดล้อม' },
  { id: 'connection', label: 'การเชื่อมต่อ' },
  { id: 'security', label: 'ความปลอดภัย' }
];

const Agenda: React.FC<AgendaProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-12 w-full overflow-hidden">
      <nav className="flex justify-center items-center relative">
        <div className="flex gap-2 p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm shadow-xl overflow-x-auto max-w-full">
          <div className="flex space-x-2 px-2">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variants={tabVariants}
                animate={activeTab === tab.id ? "active" : "inactive"}
                className={`
                  relative py-3 px-6 rounded-lg font-medium text-sm whitespace-nowrap
                  transition-all duration-300 ease-in-out
                  hover:bg-gray-700/30
                  flex items-center gap-2
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-pink-500"
                  variants={tabUnderlineVariants}
                  animate={activeTab === tab.id ? "active" : "inactive"}
                  initial="inactive"
                  style={{
                    borderRadius: "2px",
                    marginTop: "2px"
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ zIndex: -1 }}
        />
      </nav>
    </div>
  )
}

export default Agenda
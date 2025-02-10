import React from 'react'
import { motion } from 'framer-motion';
import { colors } from '../../../styles/theme';

export const tabVariants = {
  active: {
    backgroundColor: 'var(--agenda-active-bg)',
    color: 'var(--agenda-text-active)',
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  inactive: {
    backgroundColor: "transparent",
    color: 'var(--agenda-text-inactive)',
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
    <div className="mb-12 w-full ">
      <nav className="flex justify-center items-center relative">
        <div 
          className="flex gap-2 p-2 rounded-xl backdrop-blur-sm shadow-xl overflow-x-auto max-w-full"
          style={{ 
            backgroundColor: 'var(--agenda-bg)',
            boxShadow: colors.shadows.primary
          }}
        >
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
                  hover:bg-[var(--agenda-hover)]
                  flex items-center gap-2
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5"
                  style={{
                    backgroundColor: 'var(--agenda-text-active)',
                    borderRadius: "2px",
                    marginTop: "2px"
                  }}
                  variants={tabUnderlineVariants}
                  animate={activeTab === tab.id ? "active" : "inactive"}
                  initial="inactive"
                />
              </motion.button>
            ))}
          </div>
        </div>

      </nav>
    </div>
  )
}

export default Agenda
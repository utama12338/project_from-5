'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvironmentInfo {
  serverName: string;
  environment: string;
  ip: string;
}

interface SystemInfoCollapseProps {
  environmentInfo: EnvironmentInfo[];
}

export default function SystemInfoCollapse({ environmentInfo }: SystemInfoCollapseProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      {/* Always show first item */}
      {environmentInfo.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            <span className="font-medium">Servername:</span> {environmentInfo[0].serverName}
          </p>
          <p className="text-sm text-gray-400">
            <span className="font-medium">Environment:</span> {environmentInfo[0].environment}
          </p>
          <p className="text-sm text-gray-400">
            <span className="font-medium">IP server:</span> {environmentInfo[0].ip}
          </p>
        </div>
      )}

      {/* Show collapse button if there are more items */}
      {environmentInfo.length > 1 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-2"
          >
            {isExpanded ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม'}
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pl-4 border-l-2 border-gray-600"
              >
                {environmentInfo.slice(1).map((env, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Servername:</span> {env.serverName}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-medium">Environment:</span> {env.environment}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-medium">IP server:</span> {env.ip}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

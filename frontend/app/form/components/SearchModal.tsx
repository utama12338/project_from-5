import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import StyledWrapper from '../../components/neoninput';
import { colors, shadows, transitions } from '../../styles/theme';
import ModernDropdown from '../../components/ModernDropdown';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: SearchCriteria) => void;
  initialCriteria: SearchCriteria; // Add this prop
}

export interface SearchCriteria {
  systemName?: string;
  serverName?: string;
  environment?: string;
  ip?: string;
  developType?: string;
  businessUnit?: string;
  operatingSystem?: string;
}

export default function SearchModal({ isOpen, onClose, onSearch, initialCriteria }: SearchModalProps) {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(initialCriteria);

  // Update searchCriteria when initialCriteria changes
  useEffect(() => {
    setSearchCriteria(initialCriteria);
  }, [initialCriteria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchCriteria);
    onClose();
  };

  const handleClear = () => {
    setSearchCriteria({
      systemName: '',
      serverName: '',
      environment: '',
      ip: '',
      developType: '',
      businessUnit: '',
    });
  };

  const environments = ['DEV', 'SIT', 'UAT', 'PreProd', 'Prod'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ 
                backgroundColor: colors.background.secondary,
                boxShadow: shadows.primary,
                transition: transitions.default
              }}
              className="rounded-lg p-6 w-full max-w-2xl z-10"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">ค้นหาระบบ</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common Search Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-100 mb-2">
                      ชื่อระบบ
                    </label>
                    <StyledWrapper>
                      <input
                        type="text"
                        value={searchCriteria.systemName}
                        className="w-full"
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, systemName: e.target.value })}
                      />
                    </StyledWrapper>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-100 mb-2">
                      Server Name
                    </label>
                    <StyledWrapper>
                      <input
                        type="text"
                        value={searchCriteria.serverName}
                        className="w-full"
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, serverName: e.target.value })}
                      />
                    </StyledWrapper>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-100 mb-2">
                      Environment
                    </label>
                    <ModernDropdown
                      options={environments}
                      value={searchCriteria.environment || ''}
                      onChange={(value) => setSearchCriteria({ ...searchCriteria, environment: value })}
                      placeholder="เลือก Environment"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-100 mb-2">
                      IP Address
                    </label>
                    <StyledWrapper>
                      <input
                        type="text"
                        value={searchCriteria.ip}
                        className="w-full"
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, ip: e.target.value })}
                      />
                    </StyledWrapper>
                  </div>
                </div>

                {/* Additional Search Fields */}
                <details className="mt-4 text-gray-100">
                  <summary className="cursor-pointer text-pink-500 hover:text-pink-400">
                    ค้นหาขั้นสูง
                  </summary>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-100 mb-2">
                        ประเภทการพัฒนา
                      </label>
                      <ModernDropdown
                        options={['OUTSOURCE', 'IN HOUSE']}
                        value={searchCriteria.developType || ''}
                        onChange={(value) => setSearchCriteria({ ...searchCriteria, developType: value })}
                        placeholder="เลือกประเภทการพัฒนา"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-100 mb-2">
                        หน่วยงาน
                      </label>
                      <StyledWrapper>
                        <input
                          type="text"
                          value={searchCriteria.businessUnit}
                          className="w-full"
                          onChange={(e) => setSearchCriteria({ ...searchCriteria, businessUnit: e.target.value })}
                        />
                      </StyledWrapper>
                    </div>
                  </div>
                </details>

                <div className="flex justify-end space-x-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 rounded-md text-gray-300 hover:text-white"
                    style={{ backgroundColor: `${colors.button.secondary.background}40` }}
                    whileHover={{ 
                      backgroundColor: `${colors.button.secondary.hover}60`,
                      scale: 1.05 
                    }}
                  >
                    ล้างข้อมูล
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-md text-gray-300 hover:text-white"
                    style={{ backgroundColor: `${colors.button.secondary.background}40` }}
                    whileHover={{ 
                      backgroundColor: `${colors.button.secondary.hover}60`,
                      scale: 1.05 
                    }}
                  >
                    ยกเลิก
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 text-white rounded-md"
                    style={{ backgroundColor: colors.button.primary.background }}
                    whileHover={{ 
                      backgroundColor: colors.button.primary.hover,
                      scale: 1.05
                    }}
                  >
                    ค้นหา
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

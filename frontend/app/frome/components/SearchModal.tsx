import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

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
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl z-10"
            >
              <h2 className="text-2xl font-bold mb-4">ค้นหาระบบ</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common Search Fields - Most frequently used */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ชื่อระบบ
                    </label>
                    <input
                      type="text"
                      value={searchCriteria.systemName}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, systemName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Server Name
                    </label>
                    <input
                      type="text"
                      value={searchCriteria.serverName}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, serverName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Environment
                    </label>
                    <select
                      value={searchCriteria.environment}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, environment: e.target.value })}
                    >
                      <option value="">ทั้งหมด</option>
                      {environments.map((env) => (
                        <option key={env} value={env}>
                          {env}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      IP Address
                    </label>
                    <input
                      type="text"
                      value={searchCriteria.ip}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, ip: e.target.value })}
                    />
                  </div>
                </div>

                {/* Additional Search Fields - Collapsible */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    ค้นหาขั้นสูง
                  </summary>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ประเภทการพัฒนา
                      </label>
                      <select
                        value={searchCriteria.developType}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, developType: e.target.value })}
                      >
                        <option value="">ทั้งหมด</option>
                        <option value="OUTSOURCE">OUTSOURCE</option>
                        <option value="IN HOUSE">IN HOUSE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        หน่วยงาน
                      </label>
                      <input
                        type="text"
                        value={searchCriteria.businessUnit}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, businessUnit: e.target.value })}
                      />
                    </div>
                  </div>
                </details>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    ล้างข้อมูล
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    ค้นหา
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

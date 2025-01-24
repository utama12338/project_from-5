'use client'
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  system: any;
}

export default function DetailViewModal({ isOpen, onClose, system }: DetailViewModalProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const modalContentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    basic: useRef<HTMLDivElement>(null),
    environment: useRef<HTMLDivElement>(null),
    connection: useRef<HTMLDivElement>(null),
    security: useRef<HTMLDivElement>(null)
  };

  // Reset active section and scroll position when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSection('basic');
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = modalContentRef.current?.scrollTop || 0;

      // Check which section is in view
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const element = ref.current;
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + height - 100) {
            setActiveSection(key);
          }
        }
      });
    };

    const modalContent = modalContentRef.current;
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => modalContent.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]); // Add isOpen as dependency

  const scrollToSection = (sectionId: string) => {
    sectionRefs[sectionId as keyof typeof sectionRefs].current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-6xl mx-4 h-[80vh] flex"
          onClick={e => e.stopPropagation()}
        >
          {/* Side Navigation */}
          <div className="w-64 border-r p-4 space-y-2">
            <div 
              className={`cursor-pointer p-2 rounded ${
                activeSection === 'basic' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => scrollToSection('basic')}
            >
              ข้อมูลพื้นฐาน
            </div>
            <div 
              className={`cursor-pointer p-2 rounded ${
                activeSection === 'environment' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => scrollToSection('environment')}
            >
              สภาพแวดล้อม
            </div>
            <div 
              className={`cursor-pointer p-2 rounded ${
                activeSection === 'connection' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => scrollToSection('connection')}
            >
              การเชื่อมต่อ
            </div>
            <div 
              className={`cursor-pointer p-2 rounded ${
                activeSection === 'security' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => scrollToSection('security')}
            >
              ความปลอดภัย
            </div>
          </div>

          {/* Content Area */}
          <div 
            id="modal-content" 
            ref={modalContentRef}
            className="flex-1 overflow-y-auto p-6"
          >
            {/* Basic Info Section */}
            <div ref={sectionRefs.basic} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">ข้อมูลพื้นฐาน</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-indigo-600 mb-1">ชื่อระบบ</p>
                  <p className="text-gray-900">{system.systemName || '-'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-indigo-600 mb-1">ประเภทการพัฒนา</p>
                  <p className="text-gray-900">{system.developType || '-'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-indigo-600 mb-1">เลขที่สัญญา</p>
                  <p className="text-gray-900">{system.contractNo || '-'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-indigo-600 mb-1">บริษัทคู่สัญญา/ติดต่อ</p>
                  <p className="text-gray-900">{system.vendorContactNo || '-'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-indigo-600 mb-1">หน่วยงานเจ้าของระบบงาน</p>
                  <p className="text-gray-900">{system.businessUnit || '-'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-indigo-600 mb-1">ผู้รับผิดชอบของทีมพัฒนา</p>
                  <p className="text-gray-900">{system.developUnit || '-'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-indigo-600 mb-1">Computer Backup</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    system.computerbackup === 'YES' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {system.computerbackup || 'NO'}
                  </span>
                </div>
              </div>
            </div>

            {/* Environment Info Section */}
            <div ref={sectionRefs.environment} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">สภาพแวดล้อม</h2>
              {system.environmentInfo?.map((env: any, index: number) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-600">Environment {index + 1}</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Environment</p>
                      <p className="text-gray-900">{env.environment || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Server Name</p>
                      <p className="text-gray-900">{env.serverName || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">IP Address</p>
                      <p className="text-gray-900">{env.ip || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Server Type</p>
                      <p className="text-gray-900">{env.serverType || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Server Role</p>
                      <p className="text-gray-900">{env.serverRole || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Server Duty</p>
                      <p className="text-gray-900">{env.serverDuty || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Database</p>
                      <p className="text-gray-900">{env.database || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Application</p>
                      <p className="text-gray-900">{env.application || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Operating System</p>
                      <p className="text-gray-900">{env.operatingSystem || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Service Pack</p>
                      <p className="text-gray-900">{env.servicePack || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Build</p>
                      <p className="text-gray-900">{env.build || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">CPU</p>
                      <p className="text-gray-900">{env.cpu || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">RAM</p>
                      <p className="text-gray-900">{env.ram || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Disk</p>
                      <p className="text-gray-900">{env.disk || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">DR</p>
                      <p className="text-gray-900">{env.dr || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Join Domain</p>
                      <p className="text-gray-900">{env.joinDomain || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Windows Cluster</p>
                      <p className="text-gray-900">{env.windowsCluster || '-'}</p>
                    </div>
                    <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Production Unit</p>
                      <div className="flex flex-wrap gap-2">
                        {env.productionUnit?.map((unit: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                            {unit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Connection Info Section */}
            <div ref={sectionRefs.connection} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">การเชื่อมต่อ</h2>
              {system.connectionInfo?.map((conn: any, index: number) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                    Server: {system.environmentInfo[index]?.serverName || `Server ${index + 1}`}
                  </h3>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                    {Object.entries(conn)
                      .filter(([key]) => !['id', 'createdAt', 'updatedAt', 'systemInfoId'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-semibold text-indigo-600 mb-1">{key}</p>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            value === 'YES' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {String(value)}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Security Info Section */}
            <div ref={sectionRefs.security} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">ความปลอดภัย</h2>
              {system.securityInfo?.map((security: any, index: number) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                    Server: {system.environmentInfo[index]?.serverName || `Server ${index + 1}`}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">URL Website</p>
                      <p className="text-gray-900">{security.urlWebsite || '-'}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Certificate Expire Date</p>
                      <p className="text-gray-900">{security.certificateExpireDate || '-'}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Backup Policy</p>
                      <p className="text-gray-900">{security.backupPolicy || '-'}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-indigo-600 mb-1">Downtime Allowed</p>
                      <p className="text-gray-900">{security.downtimeAllowed || '-'}</p>
                    </div>

                    {['centralizeLog', 'setupAgentPatch', 'internetFacing'].map((field) => (
                      <div key={field} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-indigo-600 mb-1">{field}</p>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          security[field] === 'YES' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {security[field]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

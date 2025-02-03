'use client'
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StyledWrapper from './neoninput';
import { colors, shadows, transitions, line } from '../styles/theme';
import ModernDropdown from './ModernDropdown';

interface DetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: any[]; // Changed from single system to array of systems
}

export default function DetailViewModal({ isOpen, onClose, systems }: DetailViewModalProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [activeSystemIndex, setActiveSystemIndex] = useState(0);
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

  const currentSystem = systems[activeSystemIndex];

  const InfoBox = ({ title, value, isStatus = false }: { title: string; value: string | null; isStatus?: boolean }) => (
    <div style={{ 
      backgroundColor: colors.background.tertiary,
      transition: transitions.default
    }} className="p-4 rounded-lg hover:shadow-lg">
      <p className="font-semibold mb-1" style={{ color: colors.text.secondary }}>{title}</p>
      {isStatus ? (
        <span className={`px-3 py-1 rounded-full text-sm ${
          value === 'YES' 
            ? 'bg-green-500 bg-opacity-20 text-green-400' 
            : 'bg-red-500 bg-opacity-20 text-red-400'
        }`}>
          {value || 'NO'}
        </span>
      ) : (
        <p style={{ color: colors.text.primary }}>{value || '-'}</p>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-start pt-10"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          style={{ 
            backgroundColor: colors.background.secondary,
            boxShadow: shadows.primary,
          }}
          className="rounded-lg w-full max-w-6xl mx-4 h-[80vh] flex"
          onClick={e => e.stopPropagation()}
        >
          {/* System Selection Tabs */}
          <div className="w-64 border-r flex flex-col" 
               style={{ backgroundColor: colors.background.tertiary }}>
            <div className="p-4 border-b">
              <h3 className="font-semibold text-white">ระบบที่เลือก ({systems.length})</h3>
            </div>
            <div className="overflow-y-auto">
              {systems.map((sys, index) => (
                <div
                  key={sys.id}
                  onClick={() => setActiveSystemIndex(index)}
                  style={{
                    backgroundColor: index === activeSystemIndex ? `${colors.button.primary.background}20` : 'transparent',
                    color: index === activeSystemIndex ? colors.button.primary.background : colors.text.primary
                  }}
                  className="p-4 cursor-pointer hover:bg-pink-500 hover:bg-opacity-10 transition-all duration-200"
                >
                  {sys.systemName}
                </div>
              ))}
            </div>
            {/* Existing navigation */}
            <div className="border-t p-4 space-y-2">
              {['basic', 'environment', 'connection', 'security'].map((section) => (
                <div 
                  key={section}
                  onClick={() => scrollToSection(section)}
                  style={{
                    backgroundColor: activeSection === section ? `${colors.button.primary.background}20` : 'transparent',
                    color: activeSection === section ? colors.button.primary.background : colors.text.primary
                  }}
                  className="cursor-pointer p-2 rounded hover:bg-pink-500 hover:bg-opacity-10 transition-all duration-200"
                >
                  {section === 'basic' && 'ข้อมูลพื้นฐาน'}
                  {section === 'environment' && 'สภาพแวดล้อม'}
                  {section === 'connection' && 'การเชื่อมต่อ'}
                  {section === 'security' && 'ความปลอดภัย'}
                </div>
              ))}
            </div>
          </div>

          {/* Content Area - Use currentSystem instead of system */}
          <div 
            id="modal-content" 
            ref={modalContentRef}
            className="flex-1 overflow-y-auto p-6"
            style={{ backgroundColor: colors.background.secondary }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Basic Info Section */}
              <div ref={sectionRefs.basic} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 pb-2 text-white border-b" 
                    style={{ borderImage: line.line, borderImageSlice: 1 }}>
                  ข้อมูลพื้นฐาน
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoBox title="ชื่อระบบ" value={currentSystem.systemName} />
                  <InfoBox title="ประเภทการพัฒนา" value={currentSystem.developType} />
                  <InfoBox title="เลขที่สัญญา" value={currentSystem.contractNo} />
                  <InfoBox title="บริษัทคู่สัญญา/ติดต่อ" value={currentSystem.vendorContactNo} />
                  <InfoBox title="หน่วยงานเจ้าของระบบงาน" value={currentSystem.businessUnit} />
                  <InfoBox title="ผู้รับผิดชอบของทีมพัฒนา" value={currentSystem.developUnit} />
                  <InfoBox title="Computer Backup" value={currentSystem.computerbackup} isStatus />
                </div>
              </div>

              {/* Environment Info Section */}
              <div ref={sectionRefs.environment} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 pb-2 text-white border-b"
                    style={{ borderImage: line.line, borderImageSlice: 1 }}>
                  สภาพแวดล้อม
                </h2>
                {currentSystem.environmentInfo?.map((env: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">Environment {index + 1}</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <InfoBox title="Environment" value={env.environment} />
                      <InfoBox title="Server Name" value={env.serverName} />
                      <InfoBox title="IP Address" value={env.ip} />
                      <InfoBox title="Server Type" value={env.serverType} />
                      <InfoBox title="Server Role" value={env.serverRole} />
                      <InfoBox title="Server Duty" value={env.serverDuty} />
                      <InfoBox title="Database" value={env.database} />
                      <InfoBox title="Application" value={env.application} />
                      <InfoBox title="Operating System" value={env.operatingSystem} />
                      <InfoBox title="Service Pack" value={env.servicePack} />
                      <InfoBox title="Build" value={env.build} />
                      <InfoBox title="CPU" value={env.cpu} />
                      <InfoBox title="RAM" value={env.ram} />
                      <InfoBox title="Disk" value={env.disk} />
                      <InfoBox title="DR" value={env.dr} />
                      <InfoBox title="Join Domain" value={env.joinDomain} />
                      <InfoBox title="Windows Cluster" value={env.windowsCluster} />
                      
                      <div className="col-span-2 p-4 rounded-lg" style={{ backgroundColor: colors.background.tertiary }}>
                        <p className="font-semibold mb-1" style={{ color: colors.text.secondary }}>Production Unit</p>
                        <div className="flex flex-wrap gap-2">
                          {env.productionUnit?.map((unit: string, i: number) => (
                            <span 
                              key={i} 
                              className="px-2 py-1 rounded-md text-sm" 
                              style={{ 
                                backgroundColor: `${colors.button.primary.background}20`,
                                color: colors.text.primary
                              }}
                            >
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
                <h2 className="text-2xl font-bold mb-4 pb-2 text-white border-b"
                    style={{ borderImage: line.line, borderImageSlice: 1 }}>
                  การเชื่อมต่อ
                </h2>
                {currentSystem.connectionInfo?.map((conn: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                      Server: {currentSystem.environmentInfo[index]?.serverName || `Server ${index + 1}`}
                    </h3>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                      {Object.entries(conn)
                        .filter(([key]) => !['id', 'createdAt', 'updatedAt', 'systemInfoId'].includes(key))
                        .map(([key, value]) => (
                          <InfoBox key={key} title={key} value={String(value)} isStatus />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Info Section */}
              <div ref={sectionRefs.security} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 pb-2 text-white border-b"
                    style={{ borderImage: line.line, borderImageSlice: 1 }}>
                  ความปลอดภัย
                </h2>
                {currentSystem.securityInfo?.map((security: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                      Server: {currentSystem.environmentInfo[index]?.serverName || `Server ${index + 1}`}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <InfoBox title="URL Website" value={security.urlWebsite} />
                      <InfoBox title="Certificate Expire Date" value={security.certificateExpireDate} />
                      <InfoBox title="Backup Policy" value={security.backupPolicy} />
                      <InfoBox title="Downtime Allowed" value={security.downtimeAllowed} />
                      {['centralizeLog', 'setupAgentPatch', 'internetFacing'].map((field) => (
                        <InfoBox key={field} title={field} value={security[field]} isStatus />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

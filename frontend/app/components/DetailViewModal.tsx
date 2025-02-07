'use client'
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  colors, 
  shadows, 
  transitions, 
  line, 
  layout,
  animation,
  menu,
  labels
} from '../styles/theme';
import { SYSTEM_LABELS, ENVIRONMENT_LABELS, CONNECTION_LABELS, SECURITY_LABELS } from '../constants/labels';
import { SystemData, EnvironmentInfo, ConnectionInfo } from '../types/inputform';

interface DetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: SystemData[]; // Changed from any[] to SystemData[]
}

export default function DetailViewModal({ isOpen, onClose, systems }: DetailViewModalProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [activeSystemIndex, setActiveSystemIndex] = useState(0);
  const [activeEnvironmentIndex, setActiveEnvironmentIndex] = useState(0);
  const [expandedEnvironments, setExpandedEnvironments] = useState<number[]>([]); // Replace isEnvironmentExpanded
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Create refs outside useMemo
  const basicRef = useRef<HTMLDivElement>(null);
  const environmentRef = useRef<HTMLDivElement>(null);
  const connectionRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);

  // Use the created refs in useMemo
  const sectionRefs = useMemo(() => ({
    basic: basicRef,
    environment: environmentRef,
    connection: connectionRef,
    security: securityRef
  }), []); // Empty dependency array since refs don't need to change

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
  }, [isOpen, sectionRefs]); // Added sectionRefs to dependency array

  const scrollToSection = (sectionId: string, envIndex?: number) => {
    const offset = 80; // Add offset to account for sticky header if any
    
    if (sectionId && sectionRefs[sectionId as keyof typeof sectionRefs].current) {
      const element = sectionRefs[sectionId as keyof typeof sectionRefs].current;
      const modalContent = modalContentRef.current;
      
      if (element && modalContent) {
        const elementPosition = element.offsetTop - offset;
        modalContent.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }

    if (envIndex !== undefined) {
      setActiveEnvironmentIndex(envIndex);
      setExpandedEnvironments([envIndex]);
    }
  };

  if (!isOpen) return null;

  const currentSystem: SystemData = systems[activeSystemIndex];

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
        {...animation.fadeIn}
        className="fixed inset-0 z-50 flex justify-center items-start pt-10"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        onClick={onClose}
      >
        <motion.div
          {...animation.slideIn}
          style={{ 
            backgroundColor: colors.background.secondary,
            boxShadow: shadows.primary,
            borderRadius: layout.borderRadius.large
          }}
          className="w-full max-w-6xl mx-4 h-[80vh] flex"
          onClick={e => e.stopPropagation()}
        >
          {/* System Selection Tabs - Update styling */}
          <div className="w-64 border-r flex flex-col sticky top-0 h-[80vh]" 
               style={{ 
                 backgroundColor: colors.background.tertiary,
                 borderTopLeftRadius: layout.borderRadius.large,
                 borderBottomLeftRadius: layout.borderRadius.large
               }}>
            <div className="p-4 border-b sticky top-0 bg-inherit z-10">
              <h3 className="font-semibold text-white text-center">ระบบที่เลือก ({systems.length})</h3>
            </div>
            <div className="overflow-y-auto flex-1">
              {/* Systems list - Add text truncation and padding */}
              {systems.map((sys, index) => (
                <div
                  key={sys.id}
                  onClick={() => setActiveSystemIndex(index)}
                  style={{
                    backgroundColor: index === activeSystemIndex ? `${colors.button.primary.background}20` : 'transparent',
                    color: index === activeSystemIndex ? colors.button.primary.background : colors.text.primary
                  }}
                  className="px-1 py-1 cursor-pointer hover:bg-pink-500 hover:bg-opacity-10 transition-all duration-200"
                >
                  <div className="truncate text-center">{sys.systemName}</div>
                </div>
              ))}
            </div>
            {/* Navigation menu - Update styling */}
            <div className="border-t p-1 space-y-2 sticky bottom-0 bg-inherit h-[300px] min-h-[300px] overflow-y-auto">
  {/* Basic Info - Center text and improve padding */}
  <div 
    onClick={() => scrollToSection('basic')}
    style={{
      backgroundColor: activeSection === 'basic' 
        ? `${colors.button.primary.background}20` 
        : 'transparent',
      color: activeSection === 'basic' 
        ? colors.button.primary.background 
        : colors.text.primary,
      borderRadius: labels.section.borderRadius,
    }}
    className="cursor-pointer px-3 py-2 transition-all duration-200 text-center"
  >
    <span className="font-semibold truncate block">ข้อมูลพื้นฐาน Systeminfo</span>
  </div>

              {/* Environments Section - Update container and spacing */}
              {currentSystem.environmentInfo?.map((env: EnvironmentInfo, index: number) => (
                <div key={index} className="ml-2">
                  <div
                    onClick={() => {
                      if (index === activeEnvironmentIndex) {
                        // If clicking the same environment, toggle it
                        setExpandedEnvironments(prev => 
                          prev.includes(index) ? [] : [index]
                        );
                      } else {
                        // If clicking a different environment, expand it and close others
                        setActiveEnvironmentIndex(index);
                        setExpandedEnvironments([index]);
                        scrollToSection('environment', index);
                      }
                    }}
                    style={{
                      backgroundColor: activeSection === 'environment' && activeEnvironmentIndex === index
                        ? `${colors.button.primary.background}20`
                        : 'transparent',
                      color: activeSection === 'environment' && activeEnvironmentIndex === index
                        ? menu.text.active
                        : menu.text.inactive
                    }}
                    className="cursor-pointer px-3 py-2 rounded hover:bg-pink-500 hover:bg-opacity-10 transition-all duration-200 flex justify-between items-center"
                  >
                    <span className="truncate flex-1 pr-2">{env.environment || `Environment ${index + 1}`}</span>
                    <span className="text-xs flex-shrink-0">
                      {expandedEnvironments.includes(index) ? menu.icons.collapse : menu.icons.expand}
                    </span>
                  </div>

                  {expandedEnvironments.includes(index) && (
                    <div className="ml-3 space-y-1 mt-1">
                      {[
                        { id: 'environment', text: 'สภาพแวดล้อม Environment' },
                        { id: 'connection', text: 'การเชื่อมต่อ connecting' },
                        { id: 'security', text: 'ความปลอดภัย security' }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => scrollToSection(item.id, index)}
                          style={{
                            color: activeSection === item.id && activeEnvironmentIndex === index
                              ? menu.text.hover 
                              : menu.text.inactive,
                            backgroundColor: activeSection === item.id && activeEnvironmentIndex === index
                              ? `${colors.button.primary.background}10`
                              : 'transparent'
                          }}
                          className="cursor-pointer px-3 py-1.5 rounded hover:bg-pink-500 hover:bg-opacity-10 flex items-center transition-all duration-200"
                        >
                          {/* <span className="text-xs mr-2 flex-shrink-0">●</span> */}
                          <span className="truncate">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Area - Add separate scrolling */}
          <div 
            id="modal-content" 
            ref={modalContentRef}
            className="flex-1 overflow-y-auto p-6 relative"
            style={{ 
              backgroundColor: colors.background.secondary,
              borderTopRightRadius: layout.borderRadius.large,
              borderBottomRightRadius: layout.borderRadius.large,
              height: '80vh'
            }}
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
                <h3 className="text-lg font-semibold mb-4 text-indigo-600">Systeminfo </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoBox title={SYSTEM_LABELS.systemName} value={currentSystem.systemName} />
                  <InfoBox title={SYSTEM_LABELS.developType} value={currentSystem.developType} />
                  <InfoBox title={SYSTEM_LABELS.contractNo} value={currentSystem.contractNo} />
                  <InfoBox title={SYSTEM_LABELS.vendorContactNo} value={currentSystem.vendorContactNo} />
                  <InfoBox title={SYSTEM_LABELS.businessUnit} value={currentSystem.businessUnit} />
                  <InfoBox title={SYSTEM_LABELS.developUnit} value={currentSystem.developUnit} />
                  <InfoBox title={SYSTEM_LABELS.computerBackup} value={currentSystem.computerbackup} isStatus />
                </div>
              </div>

              {/* Environment Info Section */}
              {currentSystem.environmentInfo?.[activeEnvironmentIndex] && (
                <div ref={sectionRefs.environment} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 pb-2 text-white border-b"
                      style={{ borderImage: line.line, borderImageSlice: 1 }}>
                    สภาพแวดล้อม
                  </h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">Environment {currentSystem.systemName}</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <InfoBox title={ENVIRONMENT_LABELS.environment} value={currentSystem.environmentInfo[activeEnvironmentIndex].environment} />
                      <InfoBox title={ENVIRONMENT_LABELS.serverName} value={currentSystem.environmentInfo[activeEnvironmentIndex].serverName} />
                      <InfoBox title={ENVIRONMENT_LABELS.ip} value={currentSystem.environmentInfo[activeEnvironmentIndex].ip} />
                      <InfoBox title={ENVIRONMENT_LABELS.serverType} value={currentSystem.environmentInfo[activeEnvironmentIndex].serverType} />
                      <InfoBox title={ENVIRONMENT_LABELS.serverRole} value={currentSystem.environmentInfo[activeEnvironmentIndex].serverRole} />
                      <InfoBox title={ENVIRONMENT_LABELS.serverDuty} value={currentSystem.environmentInfo[activeEnvironmentIndex].serverDuty} />
                      <InfoBox title={ENVIRONMENT_LABELS.database} value={currentSystem.environmentInfo[activeEnvironmentIndex].database} />
                      <InfoBox title={ENVIRONMENT_LABELS.application} value={currentSystem.environmentInfo[activeEnvironmentIndex].application} />
                      <InfoBox title={ENVIRONMENT_LABELS.operatingSystem} value={currentSystem.environmentInfo[activeEnvironmentIndex].operatingSystem} />
                      <InfoBox title={ENVIRONMENT_LABELS.servicePack} value={currentSystem.environmentInfo[activeEnvironmentIndex].servicePack} />
                      <InfoBox title={ENVIRONMENT_LABELS.build} value={currentSystem.environmentInfo[activeEnvironmentIndex].build} />
                      <InfoBox title={ENVIRONMENT_LABELS.cpu} value={currentSystem.environmentInfo[activeEnvironmentIndex].cpu} />
                      <InfoBox title={ENVIRONMENT_LABELS.ram} value={currentSystem.environmentInfo[activeEnvironmentIndex].ram} />
                      <InfoBox title={ENVIRONMENT_LABELS.disk} value={currentSystem.environmentInfo[activeEnvironmentIndex].disk} />
                      <InfoBox title={ENVIRONMENT_LABELS.dr} value={currentSystem.environmentInfo[activeEnvironmentIndex].dr} />
                      <InfoBox title={ENVIRONMENT_LABELS.joinDomain} value={currentSystem.environmentInfo[activeEnvironmentIndex].joinDomain} />
                      <InfoBox title={ENVIRONMENT_LABELS.windowsCluster} value={currentSystem.environmentInfo[activeEnvironmentIndex].windowsCluster} />
                      
                      <div className="col-span-2 p-4 rounded-lg" style={{ backgroundColor: colors.background.tertiary }}>
                        <p className="font-semibold mb-1" style={{ color: colors.text.secondary }}>{ENVIRONMENT_LABELS.productionUnit}</p>
                        <div className="flex flex-wrap gap-2">
                          {currentSystem.environmentInfo[activeEnvironmentIndex].productionUnit?.map((unit: string, i: number) => (
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
                </div>
              )}

              {/* Connection Info Section */}
              {currentSystem.connectionInfo?.[activeEnvironmentIndex] && (
                <div ref={sectionRefs.connection} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 pb-2 text-white border-b"
                      style={{ borderImage: line.line, borderImageSlice: 1 }}>
                    การเชื่อมต่อ
                  </h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                      Server: {currentSystem.environmentInfo[activeEnvironmentIndex]?.serverName || `Server ${activeEnvironmentIndex + 1}`}
                    </h3>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                      {Object.entries(currentSystem.connectionInfo[activeEnvironmentIndex] as ConnectionInfo)
                        .filter(([key]) => !['id', 'createdAt', 'updatedAt', 'systemInfoId'].includes(key))
                        .map(([key, value]) => (
                          <InfoBox 
                            key={key} 
                            title={CONNECTION_LABELS[key as keyof typeof CONNECTION_LABELS] || key} 
                            value={String(value)} 
                            isStatus 
                          />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Info Section */}
              {currentSystem.securityInfo?.[activeEnvironmentIndex] && (
                <div ref={sectionRefs.security} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 pb-2 text-white border-b"
                      style={{ borderImage: line.line, borderImageSlice: 1 }}>
                    ความปลอดภัย
                  </h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                      Server: {currentSystem.environmentInfo[activeEnvironmentIndex]?.serverName || `Server ${activeEnvironmentIndex + 1}`}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <InfoBox title={SECURITY_LABELS.urlWebsite} value={currentSystem.securityInfo[activeEnvironmentIndex].urlWebsite} />
                      <InfoBox title={SECURITY_LABELS.certificateExpireDate} value={currentSystem.securityInfo[activeEnvironmentIndex].certificateExpireDate} />
                      <InfoBox title={SECURITY_LABELS.backupPolicy} value={currentSystem.securityInfo[activeEnvironmentIndex].backupPolicy} />
                      <InfoBox title={SECURITY_LABELS.downtimeAllowed} value={currentSystem.securityInfo[activeEnvironmentIndex].downtimeAllowed} />
                      <InfoBox title={SECURITY_LABELS.centralizeLog} value={currentSystem.securityInfo[activeEnvironmentIndex].centralizeLog} isStatus />
                      <InfoBox title={SECURITY_LABELS.setupAgentPatch} value={currentSystem.securityInfo[activeEnvironmentIndex].setupAgentPatch} isStatus />
                      <InfoBox title={SECURITY_LABELS.internetFacing} value={currentSystem.securityInfo[activeEnvironmentIndex].internetFacing} isStatus />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
// frontend/app/create-system/page.tsx
"use client"
import { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import Swal from 'sweetalert2';
export default function CreateSystem() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // สร้าง state สำหรับควบคุมขั้นตอน
  const [currentStep, setCurrentStep] = useState(1);
  
  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    systemName: '',
    developType: '',
    contractNo: '',
    vendorContactNo: '',
    businessUnit: '',
    developUnit: '',
    environmentInfo: [{
      environment: '',
      serverName: '',
      ip: '',
      serverType: '',
      serverRole: '',
      serverDuty: '',
      database: '',
      application: '',
      operatingSystem: '',
      servicePack: '',
      build: '',
      cpu: '',
      ram: '',
      disk: '',
      dr: '',
      joinDomain: '',
      windowsCluster: '',
      productionUnit: ''
    }],
    connectionInfo: [{
      ad: 'NO',
      adfs: 'NO',
      dns: 'NO',
      ntp: 'NO',
      tpam: 'NO',
      netka: 'NO',
      fim: 'NO',
      ftpServer: 'NO',
      ftpGoAnywhereMFTServer: 'NO',
      emailSmtp: 'NO',
      sms: 'NO',
      apiManagement: 'NO',
      dv: 'NO',
      snmp: 'NO'
    }],
    securityInfo: [{
      urlWebsite: '',
      certificateExpireDate: '',
      backupPolicy: '',
      downtimeAllowed: '',
      centralizeLog: 'NO',
      setupAgentPatch: 'NO',
      internetFacing: 'NO'
    }]
  });




    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล (เหมือนเดิม)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results: any) => {
          // แปลงข้อมูล CSV เป็น format ที่ต้องการ
          console.log('Imported data:', results.data);
          // TODO: แปลงข้อมูลและ set formData
        },
        header: true
      });
    }
  };
  // ฟังก์ชันสำหรับไปขั้นตอนถัดไป
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  // ฟังก์ชันสำหรับกลับไปขั้นตอนก่อนหน้า
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };



  // ฟังก์ชันอื่นๆ เหมือนเดิม...

  // ฟังก์ชันสำหรับส่งข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/form/createpublish/', {
      ...formData,
      draftStatus: 'PUBLISH'  // เพิ่ม status PUBLISH
    });
      console.log('Success:', response.data);
      router.push('/forme');
      Swal.fire({
        title: 'บันทึกสำเร็จ!',
        text: 'ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
    } catch (error) {
      console.error('Error saving data:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  const handleDraft = async () => {
    console.log('Draft data:', formData);
    try {
      const response = await axios.post('http://localhost:4000/form/createDraft', formData);
      console.log('Draft saved:', response.data);
      router.push('/forme');
      Swal.fire({
        title: 'บันทึกฉบับร่างสำเร็จ!',
        text: 'ข้อมูลของคุณถูกบันทึกเป็นฉบับร่างเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกฉบับร่างได้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  const handleEnvironmentChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newEnvironmentInfo = [...prev.environmentInfo];
      newEnvironmentInfo[index] = {
        ...newEnvironmentInfo[index],
        [name]: value
      };
      return {
        ...prev,
        environmentInfo: newEnvironmentInfo
      };
    });
  };
  const handleConnectionChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newConnectionInfo = [...prev.connectionInfo];
      newConnectionInfo[index] = {
        ...newConnectionInfo[index],
        [name]: value
      };
      return {
        ...prev,
        connectionInfo: newConnectionInfo
      };
    });
  };

  const handleSecurityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    index: number
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newSecurityInfo = [...prev.securityInfo];
      newSecurityInfo[index] = {
        ...newSecurityInfo[index],
        [name]: value
      };
      return {
        ...prev,
        securityInfo: newSecurityInfo
      };
    });
  };

    return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with import and draft buttons */}
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">เพิ่มข้อมูลระบบ</h2>
            <div className="space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportCSV}
                accept=".csv"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Import CSV
              </button>
              <button
                onClick={handleDraft}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Save Draft
              </button>
            </div>
          </div>
  
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {['ข้อมูลระบบ', 'สภาพแวดล้อม', 'การเชื่อมต่อ', 'ความปลอดภัย'].map((step, index) => (
                <div
                  key={index}
                  className={`text-sm font-medium ${
                    currentStep > index + 1 ? 'text-indigo-600' :
                    currentStep === index + 1 ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
  
          {/* Form content */}
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: ข้อมูลระบบพื้นฐาน */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    ข้อมูลระบบพื้นฐาน
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ชื่อระบบ System name
                      </label>
                      <input
                        type="text"
                        name="systemName"
                        value={formData.systemName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ประเภทการพัฒนา Develop Type
                      </label>
                      <select
                        name="developType"
                        value={formData.developType}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      >
                        <option value="">เลือกประเภทการพัฒนา</option>
                        <option value="OUTSOURCE">OUTSOURCE</option>
                        <option value="IN HOUSE">IN HOUSE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        เลขที่สัญญา Contract NO.
                      </label>
                      <input
                        type="text"
                        name="contractNo"
                        value={formData.contractNo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                      บริษัทคู่สัญญา  / ติดต่อ   Vendor / Contact NO.
                      </label>  
                      <input
                        type="text"
                        name="vendorContactNo"
                        value={formData.vendorContactNo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block teBusiness Unitxt-sm font-medium text-gray-700">
                      หน่วยงานเจ้าของระบบงาน Business Unit
                      </label>
                      <input
                        type="text"
                        name="businessUnit"
                        value={formData.businessUnit}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                      <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ผู้รับผิดชอบของทีมพัฒนา Develop Unit
                      </label>
                      <select
                        name="developUnit"
                        value={formData.developUnit}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      >
                        <option value="">เลือกผู้รับผิดชอบ</option>
                        <option value="ฝรล.">ฝรล.</option>
                        <option value="ส่วนระบบงานสนับสนุน">ส่วนระบบงานสนับสนุน</option>
                        <option value="ระบบสนับสนุนนโยบายรัฐ">ระบบสนับสนุนนโยบายรัฐ</option>
                        <option value="ธนรัตน์ เกรอด">ธนรัตน์ เกรอด</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
  
              {/* Step 2: Environment Info */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    ข้อมูลสภาพแวดล้อม
                  </h3>
                  {formData.environmentInfo.map((env, index) => (
                    <div key={index} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Environment
                          </label>
                          <input
                            type="text"
                            name="environment"
                            value={env.environment}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Server Name
                          </label>
                          <input
                            type="text"
                            name="serverName"
                            value={env.serverName}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            IP Address
                          </label>
                          <input
                            type="text"
                            name="ip"
                            value={env.ip}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Server Type
                          </label>
                          <input
                            type="text"
                            name="serverType"
                            value={env.serverType}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Server Role
                          </label>
                          <input
                            type="text"
                            name="serverRole"
                            value={env.serverRole}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Server Duty
                          </label>
                          <input
                            type="text"
                            name="serverDuty"
                            value={env.serverDuty}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Database
                          </label>
                          <input
                            type="text"
                            name="database"
                            value={env.database}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Application
                          </label>
                          <input
                            type="text"
                            name="application"
                            value={env.application}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Operating System
                          </label>
                          <input
                            type="text"
                            name="operatingSystem"
                            value={env.operatingSystem}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Service Pack
                          </label>
                          <input
                            type="text"
                            name="servicePack"
                            value={env.servicePack}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Build
                          </label>
                          <input
                            type="text"
                            name="build"
                            value={env.build}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            CPU
                          </label>
                          <input
                            type="text"
                            name="cpu"
                            value={env.cpu}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            RAM
                          </label>
                          <input
                            type="text"
                            name="ram"
                            value={env.ram}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Disk
                          </label>
                          <input
                            type="text"
                            name="disk"
                            value={env.disk}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            DR
                          </label>
                          <input
                            type="text"
                            name="dr"
                            value={env.dr}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Join Domain
                          </label>
                          <input
                            type="text"
                            name="joinDomain"
                            value={env.joinDomain}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Windows Cluster
                          </label>
                          <input
                            type="text"
                            name="windowsCluster"
                            value={env.windowsCluster}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Production Unit
                          </label>
                          <input
                            type="text"
                            name="productionUnit"
                            value={env.productionUnit}
                            onChange={(e) => handleEnvironmentChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
  

                  {/* Step 3: Connection Info */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      ข้อมูลการเชื่อมต่อ
                    </h3>
                    {formData.connectionInfo.map((conn, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Active Directory (AD)
                          </label>
                          <select
                            name="ad"
                            value={conn.ad}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            ADFS
                          </label>
                          <select
                            name="adfs"
                            value={conn.adfs}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            DNS
                          </label>
                          <select
                            name="dns"
                            value={conn.dns}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            NTP
                          </label>
                          <select
                            name="ntp"
                            value={conn.ntp}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            TPAM
                          </label>
                          <select
                            name="tpam"
                            value={conn.tpam}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Netka
                          </label>
                          <select
                            name="netka"
                            value={conn.netka}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            FIM
                          </label>
                          <select
                            name="fim"
                            value={conn.fim}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            FTP Server
                          </label>
                          <select
                            name="ftpServer"
                            value={conn.ftpServer}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            FTP GoAnywhere MFT Server
                          </label>
                          <select
                            name="ftpGoAnywhereMFTServer"
                            value={conn.ftpGoAnywhereMFTServer}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email SMTP
                          </label>
                          <select
                            name="emailSmtp"
                            value={conn.emailSmtp}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            SMS
                          </label>
                          <select
                            name="sms"
                            value={conn.sms}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            API Management
                          </label>
                          <select
                            name="apiManagement"
                            value={conn.apiManagement}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            DV
                          </label>
                          <select
                            name="dv"
                            value={conn.dv}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            SNMP
                          </label>
                          <select
                            name="snmp"
                            value={conn.snmp}
                            onChange={(e) => handleConnectionChange(e, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              {/* Step 2-4 เหมือนเดิม... */}
  
              {/* Step 4: Security Info */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    ข้อมูลความปลอดภัย
                  </h3>
                  {formData.securityInfo.map((security, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          URL Website
                        </label>
                        <input
                          type="text"
                          name="urlWebsite"
                          value={security.urlWebsite}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Certificate Expire Date
                        </label>
                        <input
                          type="date"
                          name="certificateExpireDate"
                          value={security.certificateExpireDate}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Backup Policy
                        </label>
                        <input
                          type="text"
                          name="backupPolicy"
                          value={security.backupPolicy}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Downtime Allowed
                        </label>
                        <input
                          type="text"
                          name="downtimeAllowed"
                          value={security.downtimeAllowed}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Centralize Log
                        </label>
                        <select
                          name="centralizeLog"
                          value={security.centralizeLog}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Setup Agent Patch
                        </label>
                        <select
                          name="setupAgentPatch"
                          value={security.setupAgentPatch}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Internet Facing
                        </label>
                        <select
                          name="internetFacing"
                          value={security.internetFacing}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}


              {/* Navigation buttons */}
              <div className="flex justify-between pt-5">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    ย้อนกลับ
                  </button>
                )}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleDraft}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    บันทึกแบบร่าง
                  </button>
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      ถัดไป
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      บันทึกข้อมูล
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

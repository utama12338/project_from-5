"use client"

import CSVPreviewModal from '../../../components/CSVPreviewModal';
import { FiArrowLeft } from 'react-icons/fi';
import {useCSVImport} from '@/components/itemweb/inputform/csv_function';
// 
import StyledWrapper  from '../../../components/neoninput';
import {backButtonVariants,backIconVariants,fadeInUp}from '../../../components/itemweb/inputform/animation'
import Checkbox3d from '../../../components/checkbox3d'
// 
import ModernDropdown from '../../../components/ModernDropdown';
import CustomDatePicker from '../../../components/CustomDatePicker';

import {colors}from '@/styles/theme'

import { motion } from 'framer-motion';


import { useFormHandlers } from '../../../components/itemweb/inputform/function_handle';

import Button from '../../../components/button/next';
import DeleteButton from '../../../components/button/delete';
import AddNewEntriesButton from '../../../components/button/addNewEntries';

import {ENVIRONMENT_OPTIONS,
  SERVER_TYPE_OPTIONS,
  SERVER_ROLE_OPTIONS,
  SERVER_DUTY_OPTIONS,
  PRODUCTION_UNIT_OPTIONS,
  DEVELOPER_UNIT,
  YES_NO,
  DR_DC,
  DEVELOPER_TYPE
  }from '@/types/optionselect';

import { 
  SYSTEM_LABELS, 
  ENVIRONMENT_LABELS, 
  CONNECTION_LABELS, 
  SECURITY_LABELS, 
  BUTTON_LABELS 
} from '@/constants/labels';

import { useEffect, useState } from 'react';
import Header from '../../../components/itemweb/inputform/header';
import ProgressStepper from '../../../components/itemweb/inputform/steper';

export default function CreateSystem() {
  // Add state to control client-side rendering
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { 
    showPreview, 
    csvData, 
    fileInputRef, 
    handleImportCSV, 
    handleConfirmImport, 
    handleClosePreview 
  } = useCSVImport();
  // const { 
  //   steps,
  //   ColorlibStepIcon
  // } = iconstrper();


 
    const {
      currentStep,
      formData,
      errors,
      isSubmitting,
      isSubmitted,
      handleChange,
      nextStep,
      prevStep,
      handleSubmit,
      handleEnvironmentChange,
      handleConnectionChange,
      handleSecurityChange,
      handleDateChange,
      addNewEntries,
      removeEntries
    } = useFormHandlers();


  // Return null or loading state while client-side rendering is not ready
  if (!isClient) {
    return <div className="min-h-screen py-8" style={{ background: colors.background.primary }} />;
  }

  return (
    // แก้ไขจาก bg-[rgb(17,17,16)] เป็นการใช้ style จาก theme
    <div className="min-h-screen py-8" style={{ background: colors.background.primary }}>
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header 
          fileInputRef={fileInputRef}
          handleImportCSV={handleImportCSV}
        />

        {/* Replace existing stepper with new component */}
        <ProgressStepper currentStep={currentStep} />

        {/* Form Content */}
        <motion.div 
          // แก้ไขจาก bg-[rgb(27,27,26)] เป็นการใช้ style จาก theme
          className="shadow-2xl rounded-2xl p-8 "
          style={{ background: colors.background.secondary }}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* เปลี่ยนจาก form เป็น div เพื่อป้องกัน default HTML5 validation */}
          <div className="space-y-8">
            {/* Step 1: ข้อมูลระบบพื้นฐาน */}
            {currentStep === 1 && (
              <motion.div className="space-y-4" variants={fadeInUp}>
                <h3 className="text-lg font-medium text-var(--text-secondary)">
                  ข้อมูลระบบพื้นฐาน
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-var(--text-secondary)">
                      {SYSTEM_LABELS.systemName}
                    </label>
                    <StyledWrapper>
                    <input  
                      type="text"
                      name="systemName"
                      value={formData.systemName}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.systemName ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                      required  
                      autoComplete="off"
                    /> </StyledWrapper>
                    {errors.systemName && (
                      <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>
                    )}
                  </div>

                  <div>
                    <ModernDropdown
                      options={DEVELOPER_TYPE}
                      value={formData.developType}
                      onChange={(value) => handleChange({
                        target: { name: 'developType', value }
                      } )}
                      label={SYSTEM_LABELS.developType}
                      required
                      placeholder="เลือกประเภทการพัฒนา"
                    />
                    {errors.developType && (
                      <p className="mt-1 text-sm text-red-600">{errors.developType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-var(--text-secondary)">
                      {SYSTEM_LABELS.contractNo}
                    </label>
                    <StyledWrapper>
                    <input
                      type="text"
                      name="contractNo"
                      value={formData.contractNo}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.contractNo ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                      required
                      autoComplete="off"
                    />
                    </StyledWrapper>
                    {errors.contractNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.contractNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block teBusiness Unitxt-sm font-medium text-var(--text-secondary)">
                    {SYSTEM_LABELS.vendorContactNo}
                    </label>  
                    <StyledWrapper>
                    <input
                      type="text"
                      name="vendorContactNo"
                      value={formData.vendorContactNo}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.vendorContactNo ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                      required
                      autoComplete="off"
                    />
                    </StyledWrapper>
                    {errors.vendorContactNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.vendorContactNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block teBusiness Unitxt-sm font-medium text-var(--text-secondary)">
                    {SYSTEM_LABELS.businessUnit}
                    </label>
                    <StyledWrapper>
                    <input
                      type="text"
                      name="businessUnit"
                      value={formData.businessUnit}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.businessUnit ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                      required
                      autoComplete="off"
                    />
                    </StyledWrapper>
                    {errors.businessUnit && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessUnit}</p>
                    )}
                  </div>

                    <div>
                    <ModernDropdown
                      options={DEVELOPER_UNIT}
                      value={formData.developUnit}
                      onChange={(value) => handleChange({
                        target: { name: 'developUnit', value }
                      } )}
                      label={SYSTEM_LABELS.developUnit}
                      required
                      placeholder="เลือกผู้รับผิดชอบ"
                    />
                    {errors.developUnit && (
                      <p className="mt-1 text-sm text-red-600">{errors.developUnit}</p>
                    )}
                  </div>

                  <div>
                    <ModernDropdown
                      options={YES_NO}
                      value={formData.computerbackup}
                      onChange={(value) => handleChange({
                        target: { name: 'computerbackup', value }
                      } )}
                      label={SYSTEM_LABELS.computerBackup}
                      required
                      placeholder="Select Option"
                    />
                    {errors.computerbackup && (
                      <p className="mt-1 text-sm text-red-600">{errors.computerbackup}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Environment Info */}
            {currentStep === 2 && (
              <motion.div className="space-y-4" variants={fadeInUp}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-var(--text-secondary)">
                    ข้อมูลสภาพแวดล้อม - {formData.systemName || 'ไม่ระบุชื่อระบบ'}
                  </h3>
                  <AddNewEntriesButton onClick={addNewEntries} />
                </div>
                {formData.environmentInfo.map((env, index) => (
                  // แก้ไข background ของ cards จาก bg-[rgb(32,32,31)] เป็น
                  <div key={index} className="space-y-4 p-4 rounded-lg" 
                       style={{ background: colors.background.tertiary }}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">ข้อมูลชุดที่ {index + 1}</h4>
                                              
                          <DeleteButton onClick={() => removeEntries(index)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>

                        <StyledWrapper>
                        <ModernDropdown
                              options={ENVIRONMENT_OPTIONS}
                              value={env.environment}
                              onChange={(value) => handleEnvironmentChange({
                                target: { name: 'environment', value }
                              }, index)}
                              label={ENVIRONMENT_LABELS.environment}
                              required
                              placeholder="Select Environment"
                            />
                        </StyledWrapper>
                        {errors[`environment-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`environment-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.serverName}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="serverName"
                          value={env.serverName}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`serverName-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`serverName-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverName-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.ip}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="ip"
                          value={env.ip}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`ip-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`ip-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`ip-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <ModernDropdown
                          options={SERVER_TYPE_OPTIONS}
                          value={env.serverType}
                          onChange={(value) => handleEnvironmentChange({
                            target: { name: 'serverType', value }
                          }, index)}
                          label={ENVIRONMENT_LABELS.serverType}
                          required
                          placeholder="Select Server Type"
                        />
                        {errors[`serverType-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverType-${index}`]}</p>
                        )}
                        
                      </div>

                      <div>
                        <ModernDropdown
                          options={SERVER_ROLE_OPTIONS}
                          value={env.serverRole}
                          onChange={(value) => handleEnvironmentChange({
                            target: { name: 'serverRole', value }
                          }, index)}
                          label={ENVIRONMENT_LABELS.serverRole}
                          required
                          placeholder="Select Server Role"
                        />
                        {errors[`serverRole-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverRole-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <ModernDropdown
                          options={SERVER_DUTY_OPTIONS}
                          value={env.serverDuty}
                          onChange={(value) => handleEnvironmentChange({
                            target: { name: 'serverDuty', value }
                          }, index)}
                          label={ENVIRONMENT_LABELS.serverDuty}
                          required
                          placeholder="Select Server Duty"
                        />
                        {errors[`serverDuty-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverDuty-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.database}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="database"
                          value={env.database}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`database-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          placeholder="Database management"
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`database-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`database-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.application}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="application"
                          value={env.application}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`application-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          placeholder="Supporting software IIS .net framework"
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`application-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`application-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.operatingSystem}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="operatingSystem"
                          value={env.operatingSystem}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`operatingSystem-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`operatingSystem-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`operatingSystem-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.servicePack}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="servicePack"
                          value={env.servicePack}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`servicePack-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`servicePack-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`servicePack-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.build}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="build"
                          value={env.build}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`build-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`build-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`build-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.cpu}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="cpu"
                          value={env.cpu}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`cpu-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`cpu-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`cpu-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.ram}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="ram"
                          value={env.ram}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`ram-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`ram-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`ram-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {ENVIRONMENT_LABELS.disk}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="disk"
                          value={env.disk}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`disk-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`disk-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`disk-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <ModernDropdown
                          options={DR_DC}
                          value={env.dr}
                          onChange={(value) => handleEnvironmentChange({
                            target: { name: 'dr', value }
                          }, index)}
                          label={ENVIRONMENT_LABELS.dr}
                          required
                          placeholder="Select DR/DC"
                        />
                        {errors[`dr-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`dr-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={env.joinDomain}
                          onChange={(value) => handleEnvironmentChange({
                            target: { name: 'joinDomain', value }
                          }, index)}
                          label={ENVIRONMENT_LABELS.joinDomain}
                          required
                          placeholder="Select Option"
                        />
                        {errors[`joinDomain-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`joinDomain-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={env.windowsCluster}
                          onChange={(value) => handleEnvironmentChange({
                            target: { name: 'windowsCluster', value }
                          }, index)}
                          label={ENVIRONMENT_LABELS.windowsCluster}
                          required
                          placeholder="Select Option"
                        />
                        {errors[`windowsCluster-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`windowsCluster-${index}`]}</p>
                        )}
                      </div>

                      <div >
                        <label className="block text-sm font-medium text-var(--text-secondary) mb-2 ">
                          {ENVIRONMENT_LABELS.productionUnit}
                        </label>
                        <div className={`grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2  rounded-md ${
                          errors[`productionUnit-${index}`] ? 'border-red-500' : ' text-var(--text-secondary)'
                        }`}>
                          {PRODUCTION_UNIT_OPTIONS.map((option) => (
                            <Checkbox3d key={option}>
                              <label className="container flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`productionUnit-${index}-${option}`}
                                    checked={Array.isArray(env.productionUnit) && env.productionUnit.includes(option)}
                                    onChange={(e) => {
                                      const updatedUnits = e.target.checked
                                        ? [...(Array.isArray(env.productionUnit) ? env.productionUnit : []), option]
                                        : (Array.isArray(env.productionUnit) ? env.productionUnit : []).filter((unit: string) => unit !== option);
                                      
                                      handleEnvironmentChange({
                                        target: {
                                          name: 'productionUnit',
                                          value: updatedUnits
                                        }
                                      }, index);
                                    }}
                                  />
                                <svg viewBox="0 0 64 64" height="24" width="24">
                                  <path
                                    d="M 0 16 V 56 A 8 8 0 0 0 8 64 H 56 A 8 8 0 0 0 64 56 V 8 A 8 8 0 0 0 56 0 H 8 A 8 8 0 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 0 0 0 56 0 H 8 A 8 8 0 0 0 0 8 V 16"
                                    className="path"
                                  />
                                </svg>
                                <span className="text-sm text-var(--text-secondary) ml-2">{option}</span>
                              </label>
                            </Checkbox3d>
                          ))}
                        </div>
                        {errors[`productionUnit-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`productionUnit-${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 3: Connection Info */}
            {currentStep === 3 && (
              <motion.div className="space-y-4" variants={fadeInUp}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-var(--text-secondary)">
                    ข้อมูลการเชื่อมต่อ
                  </h3>
                </div>
                {formData.connectionInfo.map((conn, index) => (
                  // แก้ไข background ของ cards จาก bg-[rgb(32,32,31)] เป็น
                  <div key={index} className="space-y-4 p-4 rounded-lg" 
                       style={{ background: colors.background.tertiary }}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-var(--text-secondary)">
                        Server Name: {formData.environmentInfo[index]?.serverName || 'N/A'}
                      </h4>
                  <DeleteButton onClick={() => removeEntries(index)} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.ad}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'ad', value }
                          } , index)}
                          label={CONNECTION_LABELS.ad}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.adfs}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'adfs', value }
                          } , index)}
                          label={CONNECTION_LABELS.adfs}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.dns}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'dns', value }
                          } , index)}
                          label={CONNECTION_LABELS.dns}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.ntp}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'ntp', value }
                          } , index)}
                          label={CONNECTION_LABELS.ntp}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.tpam}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'tpam', value }
                          } , index)}
                          label={CONNECTION_LABELS.tpam}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.netka}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'netka', value }
                          } , index)}
                          label={CONNECTION_LABELS.netka}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.fim}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'fim', value }
                          } , index)}
                          label={CONNECTION_LABELS.fim}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.ftpServer}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'ftpServer', value }
                          } , index)}
                          label={CONNECTION_LABELS.ftpServer}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.ftpGoAnywhereMFTServer}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'ftpGoAnywhereMFTServer', value }
                          } , index)}
                          label={CONNECTION_LABELS.ftpGoAnywhereMFTServer}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.emailSmtp}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'emailSmtp', value }
                          } , index)}
                          label={CONNECTION_LABELS.emailSmtp}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.sms}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'sms', value }
                          } , index)}
                          label={CONNECTION_LABELS.sms}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.apiManagement}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'apiManagement', value }
                          } , index)}
                          label={CONNECTION_LABELS.apiManagement}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.dv}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'dv', value }
                          } , index)}
                          label={CONNECTION_LABELS.dv}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={conn.snmp}
                          onChange={(value) => handleConnectionChange({
                            target: { name: 'snmp', value }
                          } , index)}
                          label={CONNECTION_LABELS.snmp}
                          required
                          placeholder="Select Option"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 4: Security Info */}
            {currentStep === 4 && (
              <motion.div className="space-y-4" variants={fadeInUp}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-var(--text-secondary)">
                    ข้อมูลความปลอดภัย
                  </h3>
                </div>
                {formData.securityInfo.map((security, index) => (
                  // แก้ไข background ของ cards จาก bg-[rgb(32,32,31)] เป็น
                  <div key={index} className="space-y-4 p-4 rounded-lg" 
                       style={{ background: colors.background.tertiary }}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-var(--text-secondary)">
                        Server Name: {formData.environmentInfo[index]?.serverName || 'N/A'}
                      </h4>
                     <DeleteButton onClick={() => removeEntries(index)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {SECURITY_LABELS.urlWebsite}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="urlWebsite"
                          value={security.urlWebsite}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`urlWebsite-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`urlWebsite-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`urlWebsite-${index}`]}</p>
                        )}
                      </div>

                      <div   >
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {SECURITY_LABELS.certificateExpireDate}
                        </label>
                        <StyledWrapper  style={{ position: 'relative', zIndex: 1000 }}>
                          <CustomDatePicker
                            selectedDate={security.certificateExpireDate ? new Date(security.certificateExpireDate) : null}
                            onChange={(date) => handleDateChange(date, index)}
                            placeholder="Select expiry date"
                            required
                            error={!!errors[`certificateExpireDate-${index}`]}
                          
                          />
                        </StyledWrapper>
                        {errors[`certificateExpireDate-${index}`] && (
                          <p className="mt-1 text-sm text-red-500">{errors[`certificateExpireDate-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {SECURITY_LABELS.backupPolicy}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="backupPolicy"
                          value={security.backupPolicy}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`backupPolicy-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`backupPolicy-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`backupPolicy-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-var(--text-secondary)">
                          {SECURITY_LABELS.downtimeAllowed}
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="downtimeAllowed"
                          value={security.downtimeAllowed}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`downtimeAllowed-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-var(--text-secondary)'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`downtimeAllowed-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`downtimeAllowed-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={security.centralizeLog}
                          onChange={(value) => handleSecurityChange({
                            target: { name: 'centralizeLog', value }
                          } , index)}
                          label={SECURITY_LABELS.centralizeLog}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={security.setupAgentPatch}
                          onChange={(value) => handleSecurityChange({
                            target: { name: 'setupAgentPatch', value }
                          } , index)}
                          label={SECURITY_LABELS.setupAgentPatch}
                          required
                          placeholder="Select Option"
                        />
                      </div>

                      <div>
                        <ModernDropdown
                          options={YES_NO}
                          value={security.internetFacing}
                          onChange={(value) => handleSecurityChange({
                            target: { name: 'internetFacing', value }
                          } , index)}
                          label={SECURITY_LABELS.internetFacing}
                          required
                          placeholder="Select Option"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Navigation buttons */}
            <motion.div 
              className="flex justify-between pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentStep > 1 && (
                <motion.button
  type="button"
  onClick={prevStep}
  className="px-6 py-3 border-2 border-pink-500 rounded-lg shadow-md
    text-pink-500 font-medium transform transition-all
    duration-200 hover:shadow-lg active:scale-95 flex items-center space-x-2
    hover:bg-pink-500 hover:text-white"
  variants={backButtonVariants}
  initial="initial"
  whileHover="hover"
  whileTap="tap"
>
  <motion.div variants={backIconVariants}>
    <FiArrowLeft className="h-5 w-5" />
  </motion.div>
  <span>{BUTTON_LABELS.back}</span>
</motion.button>
              )}
              
              <Button 
                  onClick={async (e) => {
                  e.preventDefault();
                  if (currentStep < 4) {
                    nextStep();
                  } else {
                    await handleSubmit(e as React.FormEvent);
                  }
                }}
                isSubmit={currentStep === 4}
                isLoading={isSubmitting}
                disabled={isSubmitting || isSubmitted}
                currentStep={currentStep}
                totalSteps={4}
              >
                {currentStep === 4 ? BUTTON_LABELS.save : BUTTON_LABELS.next}
              </Button>
            </motion.div>

          </div>
        </motion.div>
      </motion.div>

      <CSVPreviewModal 
        isOpen={showPreview}
        onClose={handleClosePreview}
        data={csvData}
        onConfirm={handleConfirmImport}
      />
    </div>
  );
}

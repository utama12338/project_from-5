"use client"

import { useState } from 'react'
import { UserGroupIcon, DocumentTextIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const router = useRouter()
  
  const onClickform = (section: string) => {
    if (section === 'forms') {
      router.push('/form')
    } else {
      setActiveSection(activeSection === section ? null : section)
    }
  }

  const onClickuser = (section: string) => {
    if (section === 'users') {
      router.push('/admin/user')
    } else {
      setActiveSection(activeSection === section ? null : section)
    }
  }
  


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        แดชบอร์ดผู้ดูแลระบบ
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Management Card */}
        <div 
          className="rounded-xl p-6 bg-white/10 backdrop-blur-sm shadow-lg border border-gray-200/20 hover:shadow-xl transition cursor-pointer"
          onClick={() =>onClickuser('users')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-500/10">
                <UserGroupIcon className="h-8 w-8 text-pink-500" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">จัดการผู้ใช้</h2>
                <p className="text-var(--text--admin)">จัดการผู้ใช้ในระบบ</p>
              </div>
            </div>
            <ChevronRightIcon className="h-6 w-6 text-gray-500" />
          </div>
        </div>
        
        {/* Form Management Card */}
        <div 
          className="rounded-xl p-6 bg-white/10 backdrop-blur-sm shadow-lg border border-gray-200/20 hover:shadow-xl transition cursor-pointer"
          onClick={() =>onClickform('forms')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-violet-500/10">
                <DocumentTextIcon className="h-8 w-8 text-violet-500" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">จัดการฟอร์ม</h2>
                <p className="text-var(--text--admin)">จัดการฟอร์มในระบบ</p>
              </div>
            </div>
            <ChevronRightIcon className="h-6 w-6 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
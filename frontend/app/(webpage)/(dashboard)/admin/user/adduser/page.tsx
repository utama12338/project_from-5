"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Switch } from '@headlessui/react'

export default function AddUser() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    canCreate: false,
    canEdit: false,
    canDelete: false,
    viewHistory: false,
    canCreateuser: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role,
          canCreate: formData.canCreate,
          canEdit: formData.canEdit,
          canDelete: formData.canDelete,
          viewHistory: formData.viewHistory,
          canCreateuser: formData.canCreateuser
        })
      })

      if (!response.ok) throw new Error('Failed to create user')
      
      router.push('/admin/user')
    } catch (err) {
      setError('Error creating user: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        เพิ่มผู้ใช้ใหม่
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/20">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">ชื่อผู้ใช้</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-2 bg-white/5 border border-gray-200/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">รหัสผ่าน</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 bg-white/5 border border-gray-200/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full p-2 bg-white/5 border border-gray-200/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">บทบาท</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 bg-white/5 border border-gray-200/20 rounded-lg text-white"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPERUSER">Superuser</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200 mb-2">สิทธิ์การใช้งาน</label>
              
              <div className="flex items-center justify-between">
                <span>สร้างแบบฟอร์ม</span>
                <Switch
                  checked={formData.canCreate}
                  onChange={(checked) => setFormData({ ...formData, canCreate: checked })}
                  className={`${formData.canCreate ? 'bg-pink-500' : 'bg-gray-700'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${formData.canCreate ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <span>แก้ไขแบบฟอร์ม</span>
                <Switch
                  checked={formData.canEdit}
                  onChange={(checked) => setFormData({ ...formData, canEdit: checked })}
                  className={`${formData.canEdit ? 'bg-pink-500' : 'bg-gray-700'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${formData.canEdit ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <span>ลบแบบฟอร์ม</span>
                <Switch
                  checked={formData.canDelete}
                  onChange={(checked) => setFormData({ ...formData, canDelete: checked })}
                  className={`${formData.canDelete ? 'bg-pink-500' : 'bg-gray-700'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${formData.canDelete ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <span>จัดการผู้ใช้</span>
                <Switch
                  checked={formData.canCreateuser}
                  onChange={(checked) => setFormData({ ...formData, canCreateuser: checked })}
                  className={`${formData.canCreateuser ? 'bg-pink-500' : 'bg-gray-700'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${formData.canCreateuser ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/user')}
            className="px-4 py-2 border border-gray-200/20 rounded-lg text-gray-300 hover:bg-gray-700 transition"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            เพิ่มผู้ใช้
          </button>
        </div>
      </form>
    </div>
  )
}

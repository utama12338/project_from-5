"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Switch } from '@headlessui/react'
import { KeyIcon, UserIcon } from '@heroicons/react/24/outline'
import { use } from 'react'
interface UserData {
  id: string
  username: string
  role: string
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  viewHistory: boolean
  canCreateuser: boolean
}

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
 
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Unwrap params ด้วย React.use()
  const unwrappedParams = use(params)
  const userId = unwrappedParams.id

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user data for ID:', userId);
        const response = await fetch(`/api/auth/userID/${userId}`)
        console.log('Fetching user data for ID:', userId);
        if (!response.ok) throw new Error('Failed to fetch user data')
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError('Error loading user: ' + (err instanceof Error ? err.message : String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userData) return

    try {
      const updateData = {
        ...userData,
        ...(password ? { password } : {})
      }

      const response = await fetch(`/api/auth/userID/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) throw new Error('Failed to update user')
      
      router.push('/admin/user')
    } catch (err) {
      setError('Error updating user: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error || 'User not found'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        แก้ไขผู้ใช้: {userData.username}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/20">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                className="w-full p-2 bg-white/5 border border-gray-200/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">บทบาท</label>
              <select
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
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
                  checked={userData.canCreate}
                  onChange={(checked) => setUserData({ ...userData, canCreate: checked })}
                  className={`${userData.canCreate ? 'bg-pink-500' : 'bg-gray-700'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${userData.canCreate ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <span>แก้ไขแบบฟอร์ม</span>
                <Switch
                  checked={userData.canEdit}
                  onChange={(checked) => setUserData({ ...userData, canEdit: checked })}
                  className={`${userData.canEdit ? 'bg-pink-500' : 'bg-gray-700'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${userData.canEdit ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <span>ลบแบบฟอร์ม</span>
                <Switch
                  checked={userData.canDelete}
                  onChange={(checked) => setUserData({ ...userData, canDelete: checked })}
                  className={`${userData.canDelete ? 'bg-pink-500' : 'bg-gray-700'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${userData.canDelete ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <span>จัดการผู้ใช้</span>
                <Switch
                  checked={userData.canCreateuser}
                  onChange={(checked) => setUserData({ ...userData, canCreateuser: checked })}
                  className={`${userData.canCreateuser ? 'bg-pink-500' : 'bg-gray-700'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span className={`${userData.canCreateuser ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <label className="block text-sm font-medium text-gray-200">เปลี่ยนรหัสผ่าน (ไม่ต้องกรอกถ้าไม่ต้องการเปลี่ยน)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่านใหม่"
                className="w-full p-2 bg-white/5 border border-gray-200/20 rounded-lg text-white"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่านใหม่"
                className="w-full p-2 bg-white/5 border border-gray-200/20 rounded-lg text-white"
              />
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
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}

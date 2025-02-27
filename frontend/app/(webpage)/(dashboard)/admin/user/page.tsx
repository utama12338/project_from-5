"use client"

import { useState, useEffect } from 'react'
import { UserIcon, PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  role: string
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  viewHistory: boolean
  canCreateuser: boolean
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/auth/user')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      } catch (err) {
        setError('Error loading users: ' + (err instanceof Error ? err.message : String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleAddUser = () => {
    // Navigate to add user page
    router.push('/admin/user/adduser')
  }

  const handleEditUser = (id: string) => {
    router.push(`/admin/user/edit/${id}`)
  }

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/auth/user/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete user')
        }

        // Remove user from state
        const updatedUsers = users.filter(user => user.id !== id)
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers.filter(user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      } catch (err) {
        setError('Error deleting user: ' + (err instanceof Error ? err.message : String(err)))
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          จัดการผู้ใช้
        </h1>
        <button
          onClick={handleAddUser}
          className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          เพิ่มผู้ใช้
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
  <div className="relative">
    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    <input
      type="text"
      className="w-full p-2 pl-10 bg-white/10 backdrop-blur-sm border border-gray-200/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
      placeholder="ค้นหาผู้ใช้งาน..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>

      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
        <div className="bg-white/10 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200/20 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200/20">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  ชื่อผู้ใช้
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  บทบาท
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  สิทธิ์การใช้งาน
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/20 bg-black/20">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                    {searchTerm ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ไม่พบข้อมูลผู้ใช้'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-700/70 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-pink-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.username}</div>
                          <div className="text-sm text-gray-400">ID: {user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'ADMIN' ? 'bg-pink-100 text-pink-800' : 
                          user.role === 'SUPERUSER' ? 'bg-purple-100 text-purple-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`h-2 w-2 rounded-full ${user.canCreate ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          <span>สร้างแบบฟอร์ม</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`h-2 w-2 rounded-full ${user.canEdit ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          <span>แก้ไขแบบฟอร์ม</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`h-2 w-2 rounded-full ${user.canDelete ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          <span>ลบแบบฟอร์ม</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`h-2 w-2 rounded-full ${user.canCreateuser ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          <span>จัดการผู้ใช้</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="text-indigo-400 hover:text-indigo-300 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagement

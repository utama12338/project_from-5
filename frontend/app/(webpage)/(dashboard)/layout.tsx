"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '@/components/ThemeProvider/Theme'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { isDark, toggleTheme } = useTheme()

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const navItems = [
    {
      name: 'หน้าหลัก',
      href: '/admin',
      icon: HomeIcon,
      current: pathname === '/แบบฟอร์ม'
    },
    {
      name: 'ฟอร์ม',
      href: '/dashboard/forms',
      icon: DocumentTextIcon,
      current: pathname === '/dashboard/forms'
    },
    {
        name: 'ตั้งค่า',
        href: '/dashboard/settings',
        icon: Cog6ToothIcon,
        current: pathname === '/dashboard/settings'
      }
    // {
    //   name: 'ผู้ดูแลระบบ',
    //   href: '/dashboard/admin',
    //   icon: UserGroupIcon,
    //   current: pathname === '/dashboard/admin'
    // },

  ]

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300 border-r border-gray-200/20 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Admin
            </span>
          )}
          <button 
            onClick={toggleSidebar}
            className="rounded-full p-2 hover:bg-gray-200/20 transition"
          >
            {collapsed ? 
              <ChevronDoubleRightIcon className="h-5 w-5" /> : 
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            }
          </button>
        </div>

        <div className="flex-1 overflow-y-hidden">
          <nav className="px-2 space-y-1 mt-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 text-pink-500'
                    : 'hover:bg-gray-200/20'
                } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all`}
              >
                <item.icon
                  className={`${
                    item.current ? 'text-pink-500' : 'text-gray-400 group-hover:text-gray-300'
                  } ${collapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0 h-6 w-6 transition-colors`}
                  aria-hidden="true"
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white font-semibold">
                A
              </div>
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium">ผู้ดูแลระบบ</p>
                  <p className="text-xs text-gray-500">admin@ssd.com</p>
                </div>
              )}
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200/20 transition"
              aria-label="Toggle theme"
            >
              {isDark ? 
                <SunIcon className="h-5 w-5 text-yellow-400" /> : 
                <MoonIcon className="h-5 w-5" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-transparent">
          {children}
        </main>
      </div>
    </div>
  )
}

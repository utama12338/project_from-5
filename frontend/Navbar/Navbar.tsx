"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
// import { FaServer, FaDatabase, FaNetworkWired, FaShieldAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { FaServer, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { colors } from '../app/styles/theme';
import { ThemeToggle } from '@/components/ThemeProvider/Theme';

const pageTitles: { [key: string]: string } = {
  '/': 'ระบบทั้งหมด | All Systems',
  '/systemmanage': 'จัดการระบบ | System Management',
  '/connection': 'การเชื่อมต่อระบบ | System Connection',
  '/security': 'ความปลอดภัย | Security',
  '/add': 'เพิ่มข้อมูล | Add Information',
  '/search': 'ค้นหา | Search'
};

// const menuItems = [
  // { icon: <FaServer className="w-5 h-5" />, text: 'ระบบทั้งหมด', link: '/form' },
  // { icon: <FaDatabase className="w-5 h-5", text: 'จัดการระบบ', link: '/systemmanage' },
  // { icon: <FaNetworkWired className="w-5 h-5", text: 'เชื่อมต่อระบบ', link: '/connection' },
  // { icon: <FaShieldAlt className="w-5 h-5", text: 'ความปลอดภัย', link: '/security' },
  // { icon: <FaPlus className="w-5 h-5" />, text: 'เพิ่มระบใหม่', link: '/inputform' },
  // { icon: <FaSearch className="w-5 h-5", text: 'ค้นหา', link: '/search' },
// ];

const hideNavbarPaths = ['/login', '/register','/admin'];

export default function Navbar() {
  // const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  if (hideNavbarPaths.includes(pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-lg border-b border-gray-200/20 p-4 dark:bg-gray-800/10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          {pageTitles[pathname] || 'System Management'}
        </div>

        <div className="flex items-center space-x-4">
          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-1">
            {/* {menuItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                className={`relative px-4 py-2 hover:text-white transition-colors ${
                  activeIndex === index 
                    ? 'text-white' 
                    : `text-white/80`
                }`}
                style={{
                  backgroundColor: activeIndex === index 
                    ? `${colors.button.primary.background}20` 
                    : 'transparent'
                }}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.text}</span>
                </span>
                {activeIndex === index && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 w-full rounded-full"
                    style={{ backgroundColor: colors.button.primary.background }}
                    layoutId="underline"
                  />
                )}
              </motion.a>
            ))} */}
            
            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              className="relative px-4 py-2 text-white/80 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-2">
                <FaSignOutAlt className="w-5 h-5" />
                <span>ออกจากระบบ</span>
              </span>
            </motion.button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

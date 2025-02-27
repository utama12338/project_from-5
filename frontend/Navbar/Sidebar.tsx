// // src/components/Sidebar.tsx
// import Link from 'next/link';
// import { FaPlus } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { colors } from '../app/styles/theme';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   return (
//     <motion.div
//       className="fixed top-0 right-0 h-full w-64 p-4 transform md:hidden shadow-lg"
//       style={{ backgroundColor: colors.background.primary }}
//       animate={{ x: isOpen ? 0 : '100%' }}
//       initial={{ x: '100%' }}
//       transition={{ type: 'spring', stiffness: 100 }}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h2 style={{ color: colors.text.primary }} className="text-xl font-semibold">
//           Menu
//         </h2>
//         <motion.button
//           onClick={onClose}
//           style={{ color: colors.text.primary }}
//           className="focus:outline-none"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <FaPlus className="h-6 w-6" />
//         </motion.button>
//       </div>
//       <nav className="flex flex-col space-y-4">
//         {['/forms', '/create', '/admin'].map((path, index) => (
//           <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//             <Link 
//               href={path} 
//               className="hover:text-white transition-colors block py-2"
//               style={{ color: colors.text.secondary }}
//             >
//               {path === '/forms' && 'รายการแบบฟอร์ม'}
//               {path === '/create' && 'สร้างแบบฟอร์ม'}
//               {path === '/admin' && 'Admin'}
//             </Link>
//           </motion.div>
//         ))}
//       </nav>
//     </motion.div>
//   );
// };

// export default Sidebar;

import { PreviewModalProps, CSVValidationResult } from '../types/csv';

export default function CSVPreviewModal({ isOpen, onClose, data, onConfirm }: PreviewModalProps) {
  if (!isOpen) return null;

  const getRowClassName = (status: string) => {
    switch (status) {
      case 'invalid': return 'bg-red-100';
      case 'incomplete': return 'bg-yellow-100';
      case 'update': return 'bg-green-100';
      case 'create': return 'bg-blue-100';
      default: return '';
    }
  };

  const filteredData = (status: string) => {
    return data.filter(item => item.status === status);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">ตรวจสอบข้อมูลนำเข้า</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="mb-4 flex space-x-2">
          <button 
            className="px-3 py-1 bg-yellow-100 rounded"
            onClick={() => {/* Filter incomplete */}}
          >
            Draft ({filteredData('incomplete').length})
          </button>
          <button 
            className="px-3 py-1 bg-green-100 rounded"
            onClick={() => {/* Filter updates */}}
          >
            อัพเดท ({filteredData('update').length})
          </button>
          <button 
            className="px-3 py-1 bg-blue-100 rounded"
            onClick={() => {/* Filter new */}}
          >
            สร้างใหม่ ({filteredData('create').length})
          </button>
          <button 
            className="px-3 py-1 bg-red-100 rounded"
            onClick={() => {/* Filter invalid */}}
          >
            ข้อมูลไม่ถูกต้อง ({filteredData('invalid').length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ชื่อระบบ</th>
                <th>สถานะ</th>
                <th>ข้อผิดพลาด</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className={getRowClassName(row.status)}>
                  <td>{row.row}</td>
                  <td>{row.systemName}</td>
                  <td>{row.status}</td>
                  <td>{row.errors.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ยกเลิก
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ดำเนินการต่อ
          </button>
        </div>
      </div>
    </div>
  );
}

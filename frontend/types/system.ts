
export interface SystemInfo {
  id: string;
  systemName: string;
  environmentInfo?: {
    serverName: string;
    environment: string;
  }[];
  // เพิ่ม fields อื่นๆ ตามที่จำเป็น
}
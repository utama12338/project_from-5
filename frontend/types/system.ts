
export interface SystemInfo {
  id: number;
  systemName: string;
  environmentInfo?: {
    serverName: string;
    environment: string;
  }[];
  // เพิ่ม fields อื่นๆ ตามที่จำเป็น
}
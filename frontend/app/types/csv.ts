// import { SystemData } from '../types/inputform';
//  import { SystemData } from '../types/inputform';

export interface CSVValidationResult {
  row: number;
  data: CSVRowData;
  status: 'invalid' | 'incomplete' | 'update' | 'create';
  errors: string[];
  systemName: string;
}
export interface CSVRowData {
  systemName: string;
  developType: string;
  contractNo: string;
  vendorContactNo: string;
  businessUnit: string;
  developUnit: string;
  [key: string]: string; // For dynamic CSV fields
}
export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CSVValidationResult[];
  onConfirm: () => void;
}

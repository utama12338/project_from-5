export interface CSVValidationResult {
  row: number;
  data: any;
  status: 'invalid' | 'incomplete' | 'update' | 'create';
  errors: string[];
  systemName: string;
}

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CSVValidationResult[];
  onConfirm: () => void;
}

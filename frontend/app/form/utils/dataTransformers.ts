import { SystemData } from '@/types/inputform';

type PrimitiveTypes = string | number | boolean | null | undefined;
type AllowedTypes = PrimitiveTypes | PrimitiveTypes[] | Record<string, PrimitiveTypes>;
type ObjectValue = Record<string, PrimitiveTypes> | IndexableSystemData;
type IndexableSystemData = SystemData & {
  [key: string]: AllowedTypes;
};
type Row = { [key: string]: string };

export const transformDataForCSV = (data: SystemData[], selectedItems: string[], keysToRemove: string[]) => {
  const dataToDownload = data.filter(item => selectedItems.includes(item.id));
  const transformedData: { [key: string]: string }[] = [];
  
  dataToDownload.forEach(item => {
    // Add type assertion here to treat item as IndexableSystemData
    const processArrays = (obj: IndexableSystemData, prefix = '', baseRow: { [key: string]: string } = {}) => {
      let rows: { [key: string]: string }[] = [{ ...baseRow }];
      
      for (const key in obj) {
        if (!obj.hasOwnProperty(key) || keysToRemove.includes(key)) continue;
        
        const newKey = prefix ? `${key}` : key;
        const value = obj[key];
        
        if (Array.isArray(value)) {
          const newRows = handleArrayData(value, rows, newKey, processArrays);
          if (newRows.length > 0) rows = newRows;
        } else if (typeof value === 'object' && value !== null) {
          rows = handleObjectData(value, rows, newKey, processArrays);
        } else {
          handlePrimitiveData(rows, newKey, value);
        }
      }
      
      return rows;
    };
    
    const itemRows = processArrays(item as IndexableSystemData);
    transformedData.push(...itemRows);
  });
  
  return transformedData;
};

// Helper functions
const handleArrayData = (
  value: PrimitiveTypes[] | IndexableSystemData[],
  rows: Row[],
  newKey: string,
  processArrays: (obj: IndexableSystemData, prefix: string, baseRow: Row) => Row[]
): Row[] => {
  const newRows: Row[] = [];
  value.forEach(arrayItem => {
    if (typeof arrayItem === 'object' && arrayItem !== null) {
      rows.forEach(existingRow => {
        const arrayRows = processArrays(arrayItem as IndexableSystemData, newKey, { ...existingRow });
        newRows.push(...arrayRows);
      });
    } else {
      rows.forEach(existingRow => {
        newRows.push({
          ...existingRow,
          [newKey]: String(arrayItem)
        });
      });
    }
  });
  return newRows;
};

const handleObjectData = (
  value: ObjectValue,
  rows: Row[],
  newKey: string,
  processArrays: (obj: IndexableSystemData, prefix: string, baseRow: Row) => Row[]
): Row[] => {
  return rows.map(existingRow => {
    // Handle both types of objects
    const processableObject = value as IndexableSystemData;
    const nestedRows = processArrays(processableObject, newKey, existingRow);
    return nestedRows[0];
  });
};

const handlePrimitiveData = (
  rows: Row[],
  newKey: string,
  value: PrimitiveTypes
): void => {
  rows.forEach(row => {
    row[newKey] = String(value);
  });
};

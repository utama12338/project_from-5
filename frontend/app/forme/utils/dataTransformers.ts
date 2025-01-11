export const transformDataForCSV = (data: any[], selectedItems: number[], keysToRemove: string[]) => {
  const dataToDownload = data.filter(item => selectedItems.includes(item.id));
  const transformedData: { [key: string]: string }[] = [];
  
  dataToDownload.forEach(item => {
    const processArrays = (obj: any, prefix = '', baseRow: { [key: string]: string } = {}) => {
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
    
    const itemRows = processArrays(item);
    transformedData.push(...itemRows);
  });
  
  return transformedData;
};

// Helper functions
const handleArrayData = (value: any[], rows: any[], newKey: string, processArrays: Function) => {
  const newRows: { [key: string]: string }[] = [];
  value.forEach(arrayItem => {
    if (typeof arrayItem === 'object' && arrayItem !== null) {
      rows.forEach(existingRow => {
        const arrayRows = processArrays(arrayItem, newKey, { ...existingRow });
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

const handleObjectData = (value: any, rows: any[], newKey: string, processArrays: Function) => {
  return rows.map(existingRow => {
    const nestedRows = processArrays(value, newKey, existingRow);
    return nestedRows[0];
  });
};

const handlePrimitiveData = (rows: any[], newKey: string, value: any) => {
  rows.forEach(row => {
    row[newKey] = String(value);
  });
};



// ลบ key ที่มีค่าว่างออกจาก object api
export const removeEmptyValues = (obj: any): any => {
    const newObj: any = {};
    
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nested = removeEmptyValues(obj[key]);
        if (Object.keys(nested).length > 0) {
          newObj[key] = nested;
        }
      } else if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    });
    
    return newObj;
  };
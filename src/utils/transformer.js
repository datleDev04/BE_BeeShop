export class Transformer {
    static transformObjectTypeSnakeToCamel(object) {
      const newObject = {};
  
      for (const key in object) {
        let newKey = key.replace(/([-_][a-z])/gi, ($1) =>
          $1.toUpperCase()
        );
  
        // Loại bỏ dấu gạch dưới và dấu gạch ngang
        newKey = newKey.replace(/[-_]/g, '');
  
        // Xử lý trường hợp đặc biệt với '_id'
        if (newKey === 'Id') {
          newKey = 'id';
        }
  
        newObject[newKey] = object[key];
      }
  
      return newObject;
    }
  }
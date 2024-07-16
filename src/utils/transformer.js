class Transformer {
  static snakeToCamel(s) {
    return s.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
  }

  static transformObjectTypeSnakeToCamel(obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => Transformer.transformObjectTypeSnakeToCamel(item));
    } else if (obj !== null && obj.constructor === Object) {
      const newObj = {};
      Object.keys(obj).forEach((key) => {
        let newKey = Transformer.snakeToCamel(key);
        if (key === 'createdAt' || key === 'updatedAt') {
          return;
        }
        // Trường hợp đặc biệt cho _id thành id
        if (key === '_id') {
          newKey = 'id';
        }
        newObj[newKey] = Transformer.transformObjectTypeSnakeToCamel(obj[key]);
      });
      return newObj;
    }
    return obj;
  }

  static removeDeletedField(obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => Transformer.removeDeletedField(item));
    } else if (obj !== null && obj.constructor === Object) {
      const { deleted, ...rest } = obj;
      Object.keys(rest).forEach((key) => {
        rest[key] = Transformer.removeDeletedField(rest[key]);
      });
      return rest;
    }
    return obj;
  }
}

export { Transformer };

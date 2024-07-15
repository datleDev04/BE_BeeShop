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
}

export { Transformer };

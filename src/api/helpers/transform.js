import lodash from 'lodash';
import { TypeCheck } from './typeCheck.js';

export const toCamelCase = (obj) => {
  const output = {};
  for (const [key, value] of Object.entries(obj)) {
    if (TypeCheck.isArray(value)) {
      const transformedValue = value.map((v) => {
        if (TypeCheck.isObjectId(v)) return v.toString();
        if (TypeCheck.isPlainObject(v)) return toCamelCase(v);
        if (TypeCheck.isMongooseModel(v)) return toCamelCase(v._doc);
        return v;
      });
      output[lodash.camelCase(key)] = transformedValue;
    } else if (TypeCheck.isObjectId(value)) {
      output[lodash.camelCase(key)] = value.toString();
    } else if (TypeCheck.isPlainObject(value)) {
      output[lodash.camelCase(key)] = toCamelCase(value);
    } else if (TypeCheck.isMongooseModel(value)) {
      output[lodash.camelCase(key)] = toCamelCase(value._doc);
    } else {
      output[lodash.camelCase(key)] = TypeCheck.isObjectId(value) ? value.toString() : value;
    }
  }

  return output;
};

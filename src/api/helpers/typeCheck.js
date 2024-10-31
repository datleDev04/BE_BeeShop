import { ObjectId } from 'mongodb';
import lodash from 'lodash';

export const TypeCheck = {
  isPlainObject: (data) => lodash.isPlainObject(data),
  isArray: (data) => Array.isArray(data),
  isObjectId: (data) => data instanceof ObjectId,
  isMongooseModel: (data) => {
    return (
      data &&
      typeof data === 'object' &&
      data._id &&
      data.constructor &&
      data.constructor.name === 'model'
    );
  },
};

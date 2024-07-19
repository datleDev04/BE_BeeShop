import { StatusCodes } from 'http-status-codes';
import Gender from '../models/Gender.js';
import ApiError from '../utils/ApiError.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';

export default class GenderService {
  static createNewGender = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Gender, 'name', name, false);

    const newGender = await Gender.create({ name });
    return Transformer.transformObjectTypeSnakeToCamel(newGender.toObject());
  };

  static getAllGender = async (req) => {
    const genders = await Gender.find().sort({ createdAt: -1 }).exec();
    const returnData = genders.map((gender) => {
      return Transformer.transformObjectTypeSnakeToCamel(gender.toObject());
    });
    return returnData;
  };

  static getOneGender = async (req) => {
    await checkRecordByField(Gender, '_id', req.params.id, true);
    const gender = await Gender.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(gender.toObject());
  };

  static updateGenderById = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Gender, 'name', name, false);
    await checkRecordByField(Gender, '_id', req.params.id, true);

    const updatedGender = await Gender.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedGender.toObject());
  };

  static deleteGenderById = async (req) => {
    await checkRecordByField(Gender, '_id', req.params.id, true);
    return await Gender.findByIdAndDelete(req.params.id);
  };
}

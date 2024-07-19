import Color from '../models/Color.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class ColorService {
  static createNewColor = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Color, 'name', name, false);

    const newColor = await Color.create({ name });

    return Transformer.transformObjectTypeSnakeToCamel(newColor.toObject());
  };

  static getAllColor = async (req) => {
    const colors = await Color.find().sort({ createdAt: -1 }).exec();
    const returnData = colors.map((color) => {
      return Transformer.transformObjectTypeSnakeToCamel(color.toObject());
    });
    return returnData;
  };

  static getOneColor = async (req) => {
    await checkRecordByField(Color, '_id', req.params.id, true);
    const color = await Color.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(color.toObject());
  };

  static updateColorById = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Color, 'name', name, false, req.params.id);
    await checkRecordByField(Color, '_id', req.params.id, true);

    const updatedColor = await Color.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedColor.toObject());
  };

  static deleteColorById = async (req) => {
    await checkRecordByField(Color, '_id', req.params.id, true);
    return await Color.findByIdAndDelete(req.params.id);
  };
}

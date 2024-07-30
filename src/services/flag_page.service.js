import Flag_Page from '../models/Flag_Page.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';

export default class FlagPageService {
  static createFlagPage = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Flag_Page, 'name', name, false);

    const newFlagPages = await Flag_Page.create({ name });

    return Transformer.transformObjectTypeSnakeToCamel(newFlagPages.toObject());
  };

  static getAllFlagPage = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedFlags = await Flag_Page.paginate(filter, options);

    const { docs, ...otherFields } = paginatedFlags;

    const transformedFlags = docs.map((flag) =>
      Transformer.transformObjectTypeSnakeToCamel(flag.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedFlags),
      others,
    };
  };

  static getOneFlagPage = async (req) => {
    await checkRecordByField(Flag_Page, '_id', req.params.id, true);
    const flag = await Flag_Page.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(flag.toObject());
  };

  static updateFlagPage = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Flag_Page, 'name', name, false, req.params.id);

    await checkRecordByField(Flag_Page, '_id', req.params.id, true);

    const updatedFlag = await Flag_Page.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedFlag.toObject());
  };

  static deleteFlagPage = async (req) => {
    await checkRecordByField(Flag_Page, '_id', req.params.id, true);
    return await Flag_Page.findByIdAndDelete(req.params.id);
  };
}

import Banner from '../models/Banner.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { generateSlug } from '../utils/GenerateSlug.js';

export default class BannerService {
  static createNewBanner = async (req) => {
    const { title, description, image_url, path } = req.body;

    const newBanner = await Banner.create({ title, description, image_url, path });
    return Transformer.transformObjectTypeSnakeToCamel(newBanner.toObject());
  };

  static getAllBanners = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['title']);

    const paginatedBanners = await Banner.paginate(filter, options);

    const { docs, ...otherFields } = paginatedBanners;

    const transformedBanners = docs.map((banner) =>
      Transformer.transformObjectTypeSnakeToCamel(banner.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedBanners),
      others,
    };
  };

  static getOneBanner = async (req) => {
    await checkRecordByField(Banner, '_id', req.params.id, true);
    const banner = await Banner.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(banner.toObject());
  };

  static updateBannerById = async (req) => {
    const { title, description, image_url, path } = req.body;

    await checkRecordByField(Banner, '_id', req.params.id, true);

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image_url,
        path,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedBanner.toObject());
  };

  static deleteBannerById = async (req) => {
    await checkRecordByField(Banner, '_id', req.params.id, true);
    return await Banner.findByIdAndDelete(req.params.id);
  };
}

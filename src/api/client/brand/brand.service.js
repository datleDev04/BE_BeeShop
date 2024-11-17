import Brand from '../../../models/Brand.js';

export const brandService = {
  getAllBrands: async (req) => {
    const { _page = 1, _limit = 10, _pagination = true } = req.query;

    const paginationOptions = _pagination ? { page: _page, limit: _limit } : {};

    const brands = await Brand.find({}, null, paginationOptions);
    return brands;
  },
};

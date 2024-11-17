import Label from '../../../models/Label.js'

export const labelService = {
  getAllLabels: async (req) => {
    const { _page = 1, _limit = 10, _pagination = true } = req.query;

    const paginationOptions = _pagination ? { page: _page, limit: _limit } : {};

    const labels = await Label.find({}, null, paginationOptions);
    return labels;
  },
};

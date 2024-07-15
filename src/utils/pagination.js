const getPaginationOptions = (req) => {
  let {
    _page = 1,
    _limit = 10,
    _order = 'asc',
    _sort = 'createdAt',
    _pagination = true,
  } = req.query;

  const options = {
    page: parseInt(_page, 10),
    limit: parseInt(_limit, 10),
    sort: {
      [_sort]: _order === 'desc' ? -1 : 1,
    },
    pagination: _pagination !== 'false',
  };

  return options;
};

const getFilterOptions = (req, filterFields = []) => {
  const filter = {};
  filterFields.forEach((field) => {
    if (req.body[field]) {
      filter[field] = { $regex: `.*${req.body[field]}.*`, $options: 'i' };
    }
  });

  return filter;
};

export { getPaginationOptions, getFilterOptions };

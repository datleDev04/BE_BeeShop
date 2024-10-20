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
      [_sort]: _order === 'desc' ? 1 : -1,
    },
    pagination: _pagination !== 'false',
    customLabels: {
      pagingCounter: false,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: false,
      nextPage: false,
    },
  };

  return options;
};

const getFilterOptions = (req, filterFields = []) => {

  const filter = {  };
  filterFields.forEach((field) => {
    if (req.query[field]) {
      if (field === 'name') {
        filter[field] = { $regex: `.*${req.query[field]}.*`, $options: 'i' };
      } else if (Array.isArray(req.query[field]) || typeof req.query[field] === 'string' && req.query[field].includes(',')) {
        // Tách chuỗi thành array nếu là chuỗi phân cách bằng dấu phẩy
        const values = Array.isArray(req.query[field])
          ? req.query[field]
          : req.query[field].split(',');
        filter[field] = { $all: values };
      }  else if( req.query[field] === 'null' ) {
        filter[field] = null;
      } else {
        filter[field] = req.query[field];
      }
    }
  });

  return filter;
};

export { getPaginationOptions, getFilterOptions };

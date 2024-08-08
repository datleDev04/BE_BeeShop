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
  const filter = {};

  filterFields.forEach((field) => {
    const queryValue = req.query[field];
    if (queryValue) {
      if (queryValue === 'null') {
        filter[field] = null;
      } else {
        const flexibleRegex = createFlexibleRegex(queryValue);
        filter[field] = { $regex: `.*${flexibleRegex}.*`, $options: 'i' };
      }
    }
  });

  return filter;
};

const createFlexibleRegex = (str) => {
  const charMap = {
    a: '[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬ]',
    b: '[bB]',
    c: '[cC]',
    d: '[dDđĐ]',
    e: '[eEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ]',
    f: '[fF]',
    g: '[gG]',
    h: '[hH]',
    i: '[iIìÌỉỈĩĨíÍịỊ]',
    j: '[jJ]',
    k: '[kK]',
    l: '[lL]',
    m: '[mM]',
    n: '[nN]',
    o: '[oOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢ]',
    p: '[pP]',
    q: '[qQ]',
    r: '[rR]',
    s: '[sS]',
    t: '[tT]',
    u: '[uUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰ]',
    v: '[vV]',
    w: '[wW]',
    x: '[xX]',
    y: '[yYỳỲỷỶỹỸýÝỵỴ]',
    z: '[zZ]',
  };

  return str
    .split('')
    .map((char) => charMap[char.toLowerCase()] || char)
    .join('');
};

export { getPaginationOptions, getFilterOptions };

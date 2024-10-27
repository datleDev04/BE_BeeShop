import { StatusCodes } from 'http-status-codes';
import Wishlist from '../../models/Wishlist.js';
import ApiError from '../../utils/ApiError.js';
import { Transformer } from '../../utils/transformer.js';

export default class WishListService {
  static getallItems = async (req) => {
    const userID = req.user._id;

    let { _page = 1, _limit = 10 } = req.query;

    const wishlist = await Wishlist.findOne({ user: userID }).populate([
      {
        path: 'products',
        populate: [
          { path: 'variants', populate: ['color', 'size'] },
          { path: 'tags' },
          { path: 'gender' },
          { path: 'labels' },
          { path: 'brand' },
          { path: 'product_colors', populate: { path: 'color_id' } },
          { path: 'product_sizes' },
          { path: 'product_type' },
        ],
      },
    ]);

    if (!wishlist || !wishlist.products) {
      return [];
    }

    const { products } = wishlist;
    const totalProducts = products.length;

    const transformedItems = products.map((product) =>
      Transformer.transformObjectTypeSnakeToCamel(product.toObject())
    );

    const others = {
      totalDocs: totalProducts,
      limit: _limit,
      page: _page,
      totalPages: Math.ceil(totalProducts / _limit),
    };

    const data = Transformer.removeDeletedField(transformedItems);

    return {
      metaData: data,
      others,
    };
  };

  static updateItemsAdd = async (req) => {
    const userID = req.user._id;
    const productID = req.params.id;

    const wishList = await Wishlist.findOneAndUpdate(
      { user: userID },
      { $addToSet: { products: productID } },
      { new: true, upsert: true }
    ).populate('products');

    if (!wishList)
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        product: 'wishlist does not have this product',
      });

    return this.getallItems(req);
  };

  static updateItemsRemove = async (req) => {
    const userID = req.user._id;
    const productID = req.params.id;

    const wishList = await Wishlist.findOneAndUpdate(
      { user: userID },
      { $pull: { products: productID } },
      { new: true, upsert: true }
    ).populate('products');

    if (!wishList)
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        product: 'wishlist does not have this product',
      });
    return this.getallItems(req);
  };

  static removeAll = async (req) => {
    const userID = req.user._id;

    return await Wishlist.findOneAndUpdate(
      { user: userID },
      { $set: { products: [] } },
      { new: true, upsert: true }
    ).populate('products');
  };
}

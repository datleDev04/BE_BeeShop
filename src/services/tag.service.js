import Tags from '../models/Tags.js';

export class TagService {
  static getAllTags = async (req) => {
    return await Tags.find().sort({ createdAt: -1 });
  };

  static getOneTag = async (req) => {
    return await Tags.findById(req.params.id);
  };

  static createTag = async (req) => {
    const { name, description } = req.body;

    // check existed tag name
    const existedTagName = await Tags.findOne({ name });
    if (existedTagName) {
      throw new ApiError(StatusCodes.CONFLICT, 'Tag name already exists');
    }
    

    const newTag = await Tags.create({
      name,
      description,
    });
    return newTag;
  };

  static updateTagById = async (req) => {
    const { name, description } = req.body;

    // check existed tag name
    const existedTagName = await Tags.findOne({ name });
    if (existedTagName) {
      throw new ApiError(StatusCodes.CONFLICT, 'Tag name already exists');
    }

    const updatedTag = await Tags.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      { new: true }
    );
    return updatedTag;
  };

  static deleteTagBydId = async (req) => {
    return await Tags.findByIdAndDelete(req.params.id);
  };
}

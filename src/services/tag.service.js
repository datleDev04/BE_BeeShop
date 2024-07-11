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
    const newTag = await Tags.create({
      name,
      description,
    });
    return newTag;
  };

  static updateTagById = async (req) => {
    const { name, description } = req.body;
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

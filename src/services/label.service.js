import Label from '../models/Label.js';

export class LabelService {
  static getAllLabel = async (req) => {
    return await Label.find().sort({ createdAt: -1 });
  };

  static getOneLabel = async (req) => {
    return await Label.findById(req.params.id);
  };

  static createLabel = async (req) => {
    const { name, description } = req.body;

    // check existed Label name
    const existedLabelName = await Label.findOne({ name });
    if (existedLabelName) {
      throw new ApiError(StatusCodes.CONFLICT, 'Label name already exists');
    }

    const newLabel = await Label.create({
      name,
      description,
    });
    return newLabel;
  };

  static updateLabelById = async (req) => {
    const { name, description } = req.body;

    // check existed Label name
    const existedLabelName = await Label.findOne({ name });
    if (existedLabelName) {
      throw new ApiError(StatusCodes.CONFLICT, 'Label name already exists');
    }

    const updatedLabel = await Label.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      {
        new: true,
      }
    );
    return updatedLabel;
  };

  static deleteLabelBydId = async (req) => {
    return await Label.findByIdAndDelete(req.params.id);
  };
}

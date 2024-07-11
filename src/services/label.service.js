import Labels from '../models/Labels.js';

export class LabelService {
  static getAllLabel = async (req) => {
    return await Labels.find().sort({ createdAt: -1 });
  };

  static getOneLabel = async (req) => {
    return await Labels.findById(req.params.id);
  };

  static createLabel = async (req) => {
    const { name, description } = req.body;
    const newLabel = await Labels.create({
      name,
      description,
    });
    return newLabel;
  };

  static updateLabelById = async (req) => {
    const { name, description } = req.body;
    const updatedLabel = await Labels.findByIdAndUpdate(
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
    return await Labels.findByIdAndDelete(req.params.id);
  };
}

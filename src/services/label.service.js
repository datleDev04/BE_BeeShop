import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import Label from '../models/Label.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { generateSlug } from '../utils/GenerateSlug.js';

export class LabelService {
  static getAllLabel = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name', 'status']);

    const paginatedLabels = await Label.paginate(filter, options);

    const { docs, ...otherFields } = paginatedLabels;

    const transformedLabels = docs.map((label) =>
      Transformer.transformObjectTypeSnakeToCamel(label.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedLabels),
      others,
    };
  };

  static getOneLabel = async (req) => {
    await checkRecordByField(Label, '_id', req.params.id, true);
    const label = await Label.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(label.toObject());
  };

  static createLabel = async (req) => {
    const { name, description } = req.body;

    await checkRecordByField(Label, 'name', name, false);

    const slug = await generateSlug(Label, name);

    const newLabel = await Label.create({
      name,
      description,
      slug,
    });
    return Transformer.transformObjectTypeSnakeToCamel(newLabel.toObject());
  };

  static updateLabelById = async (req) => {
    const { name, description, status } = req.body;

    await checkRecordByField(Label, '_id', req.params.id, true);

    const currentLabel = await Label.findById(req.params.id);

    let slug = currentLabel.slug;

    if (name && name !== currentLabel.name) {
      await checkRecordByField(Label, 'name', name, false, req.params.id);
      slug = await generateSlug(Label, name);
    }

    const updatedLabel = await Label.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        slug,
        status,
      },
      {
        new: true,
      }
    );
    return Transformer.transformObjectTypeSnakeToCamel(updatedLabel.toObject());
  };

  static deleteLabelBydId = async (req) => {
    await checkRecordByField(Label, '_id', req.params.id, true);
    await Label.findByIdAndDelete(req.params.id);
  };
}

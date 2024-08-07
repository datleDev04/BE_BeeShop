import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import Role from './Role.js';
import { STATUS } from '../utils/constants.js';

// schema User variables
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      minlength: 3,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    google_id: {
      type: String,
      sparse: true,
    },
    avatar_url: {
      type: String,
    },
    birth_day: {
      type: Date,
    },
    status: {
      type: Number,
      enum: [STATUS.ACTIVE, STATUS.INACTIVE],
      default: STATUS.ACTIVE,
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User_Gender',
    },
    vouchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
      },
    ],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

userSchema.pre('save', async function (next) {
  if (this.roles.length == 0) {
    const customerRole = await Role.findOne({ name: 'Customer' });
    if (customerRole) {
      const id = customerRole._id;
      this.roles[0] = id;
    }
  }
  next();
});

const plugins = [MongooseDelete, mongoosePaginate];

plugins.forEach((plugin) => {
  userSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model(DOCUMENT_NAME, userSchema);

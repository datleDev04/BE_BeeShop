import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

// schema User variables
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

export const UserStatus = {
  ACTIVE: 0,
  INACTIVE: 1,
};

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
      enum: [UserStatus.ACTIVE, UserStatus.INACTIVE],
      default: UserStatus.ACTIVE,
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

userSchema.pre('save', function (next) {
  if (this.roles.length == 0) {
    this.roles[0] = '66a793dc9b68efd4c2a8e58e';
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

import { Schema, model, Document, ObjectId } from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

export interface ProductModel extends Document {
  name: string;
  state: boolean;
  user: ObjectId;
  category: ObjectId;
  price: number;
  description: string;
  inStock: boolean;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required!'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    state: {
      type: Boolean,
      default: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      autopopulate: true,
    },
    description: {
      type: String,
      maxlength: 250,
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProductSchema.methods.toJSON = function (): ProductModel {
  const product = this.toObject();
  delete product.state;

  return product;
};

ProductSchema.plugin(mongooseAutoPopulate);

export default model('Product', ProductSchema);

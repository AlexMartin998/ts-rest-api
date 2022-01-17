import { Schema, model, Document, ObjectId } from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

export interface CategoryModel extends Document {
  name: string;
  state: boolean;
  user: ObjectId;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required!'],
      trim: true,
      uppercase: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Autopopulate Plugun
CategorySchema.plugin(mongooseAutoPopulate);

export default model('Category', CategorySchema);

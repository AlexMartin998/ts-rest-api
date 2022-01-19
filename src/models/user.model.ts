import { Schema, model, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

// NameSchema No tiene type  |||  Si:  model<Type>(...)

export interface UserModel extends Document {
  name: string;
  email: string;
  password: string;
  state: boolean;
  role: string;
  google: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  encryptNewPassword: (newPassword: string) => Promise<string>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
    },
    img: {
      type: String,
    },
    state: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
      default: 'USER_ROLE', // <- google sign up / social sign up
      enum: ['ADMIN_ROLE', 'USER_ROLE', 'ANY_OTHER_ROLE'],
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre<UserModel>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const hash = await bcryptjs.hash(this.password, 12);
  this.password = hash;
  next();
});

UserSchema.methods.encryptNewPassword = async (
  newPassword: string
): Promise<string> => await bcryptjs.hash(newPassword, 12);

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcryptjs.compare(password, this.password);
};

UserSchema.methods.toJSON = function (): UserModel {
  const user = this.toObject();
  user.uid = user._id;
  delete user.password;
  delete user.state;
  delete user._id;

  return user;
};

export default model('User', UserSchema);

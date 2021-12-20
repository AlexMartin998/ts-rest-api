import { Schema, model } from 'mongoose';

export interface RoleModel {
  role: string;
}	

const RoleSchema: Schema = new Schema({
  role: {
    type: String,
    required: [true, 'Role is required!'],
    unique: true,
    uppercase: true,
    trim: true,
  },
});

export default model<RoleModel>('Role', RoleSchema);

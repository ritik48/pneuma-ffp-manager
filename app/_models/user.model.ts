import { Schema, model, Document, models } from "mongoose";
import { USER_COLLECTION } from "./collections";

export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>(USER_COLLECTION, userSchema);

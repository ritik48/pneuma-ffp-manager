import mongoose, { Schema, Document, models, model } from "mongoose";
import { CREDIT_CARD_COLLECTION } from "./collections";

export interface CreditCardDocument extends Document {
  name: string;
  bankName: string;
  archived: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

// to be used in the client
export type ClientCreditCard = Omit<CreditCardDocument, "_id"> & {
  _id: string;
  createdAt: string;
  modifiedAt: string;
};

const CreditCardSchema = new Schema<CreditCardDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "modifiedAt",
    },
  }
);

export const CreditCard =
  models.CreditCard ||
  model<CreditCardDocument>(CREDIT_CARD_COLLECTION, CreditCardSchema);

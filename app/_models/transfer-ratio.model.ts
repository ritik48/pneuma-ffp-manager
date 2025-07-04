import mongoose, { Schema, Document, models, model } from "mongoose";
import { CREDIT_CARD_COLLECTION, FPP_COLLECTION } from "./collections";

export interface TransferRatioDocument extends Document {
  programId: mongoose.Types.ObjectId;
  creditCardId: mongoose.Types.ObjectId;
  ratio: number;
  archived: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

const TransferRatioSchema = new Schema<TransferRatioDocument>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: FPP_COLLECTION,
      required: true,
    },
    creditCardId: {
      type: Schema.Types.ObjectId,
      ref: CREDIT_CARD_COLLECTION,
      required: true,
    },
    ratio: {
      type: Number,
      required: true,
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

export const TransferRatio =
  models.TransferRatio ||
  model<TransferRatioDocument>("TransferRatio", TransferRatioSchema);

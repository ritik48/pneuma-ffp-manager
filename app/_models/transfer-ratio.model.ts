import mongoose, { Schema, Document, models, model, Types } from "mongoose";
import { CREDIT_CARD_COLLECTION, FPP_COLLECTION } from "./collections";

// to be used in the client
export interface ClientTransferRatio {
  _id: string;
  programId: string;
  creditCardId: string;
  createdAt: string;
  modifiedAt: string;
  ratio: number;
  archived: boolean;
}

export interface TransferRatioDocument
  extends Omit<
      ClientTransferRatio,
      "_id" | "createdAt" | "modifiedAt" | "programId" | "creditCardId"
    >,
    Document {
  _id: Types.ObjectId;
  programId: mongoose.Types.ObjectId;
  creditCardId: mongoose.Types.ObjectId;
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

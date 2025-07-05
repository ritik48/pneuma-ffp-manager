import { Schema, Document, models, model, Types } from "mongoose";
import { FPP_COLLECTION } from "./collections";

export interface ClientFrequentFlyerProgram {
  _id: string;
  name: string;
  assetName: string;
  enabled: boolean;
  archived: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface FrequentFlyerProgramDocument
  extends Omit<ClientFrequentFlyerProgram, "_id" | "createdAt" | "modifiedAt">,
    Document {
  _id: Types.ObjectId;
  createdAt: Date;
  modifiedAt: Date;
}

// to be used in the client

const FrequentFlyerProgramSchema = new Schema<FrequentFlyerProgramDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    assetName: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
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

export const FrequentFlyerProgram =
  models.FrequentFlyerProgram ||
  model<FrequentFlyerProgramDocument>(
    FPP_COLLECTION,
    FrequentFlyerProgramSchema
  );

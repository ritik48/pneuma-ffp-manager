import { Schema, Document, models, model } from "mongoose";
import { FPP_COLLECTION } from "./collections";

export interface FrequentFlyerProgramDocument extends Document {
  name: string;
  assetName: string;
  enabled: boolean;
  archived: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

// to be used in the client
export type ClientFrequentFlyerProgram = Omit<
  FrequentFlyerProgramDocument,
  "_id"
> & {
  _id: string;
  createdAt: string;
  modifiedAt: string;
};

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

"use server";

import { SortOrder, Types } from "mongoose";
import {
  ClientFrequentFlyerProgram,
  FrequentFlyerProgram,
  FrequentFlyerProgramDocument,
} from "./app/_models/frequent-flyer-program.model";
import { connectDB } from "./lib/db";
import { TransferRatio } from "./app/_models/transfer-ratio.model";
import { CREDIT_CARD_COLLECTION } from "./app/_models/collections";
import {
  ClientCreditCard,
  CreditCard,
  CreditCardDocument,
} from "./app/_models/credit-card.model";
import { FFPFormSchema } from "./components/frequent-flyer-form";

export async function fetchFrequentFlyerPrograms({
  page,
  sortField,
  sortOrder,
  items_per_page,
}: {
  page: number;
  sortField: string;
  sortOrder: "asc" | "desc";
  items_per_page: number;
}) {
  await connectDB();
  const skip = (page - 1) * items_per_page;

  const [programs, total] = await Promise.all([
    FrequentFlyerProgram.find({ archived: false })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(items_per_page)
      .lean<FrequentFlyerProgramDocument[]>(),
    FrequentFlyerProgram.countDocuments({ archived: false }),
  ]);

  // serialize to JSON
  const serializedPrograms = programs.map((program) => ({
    ...program,
    createdAt: program.createdAt.toISOString(),
    modifiedAt: program.modifiedAt.toISOString(),
    _id: (program._id as Types.ObjectId).toString(),
  })) as ClientFrequentFlyerProgram[];

  console.log({ serializedPrograms });

  return { programs: serializedPrograms, total };
}

export async function deleteFrequentFlyerProgram(id: string) {
  await connectDB();
  const ffp = await FrequentFlyerProgram.findById(id);
  if (!ffp) {
    return { success: false, message: "Frequent Flyer Program not found" };
  }

  await FrequentFlyerProgram.findByIdAndDelete(id);

  return { success: true };
}

export async function fetchRatioData(id: string) {
  await connectDB();

  const rawRatios = await TransferRatio.find({ programId: id })
    .populate({
      path: "creditCardId",
      select: "name",
    })
    .lean();

  const ratios = rawRatios.map((r) => {
    return {
      _id: (r._id as Types.ObjectId).toString(),
      ratio: r.ratio,
      archived: r.archived,
      programId: r.programId.toString(),
      creditCardId: {
        _id: r.creditCardId._id.toString(),
        name: r.creditCardId.name,
        // Add any other properties you need from creditCardId
      },
      createdAt: r.createdAt.toISOString(),
      modifiedAt: r.modifiedAt.toISOString(),
    };
  });

  // Then make sure you're returning a plain object
  return JSON.parse(JSON.stringify(ratios));
}

export async function fetchCreditCards() {
  await connectDB();

  const rawCreditCards = await CreditCard.find(
    {},
    "name bankName archived createdAt modifiedAt"
  )
    .lean()
    .exec();

  const creditCards = rawCreditCards.map((cc) => ({
    _id: (cc._id as Types.ObjectId).toString(),
    name: cc.name,
    bankName: cc.bankName,
    archived: cc.archived,
    createdAt: cc.createdAt.toISOString(),
    modifiedAt: cc.modifiedAt.toISOString(),
  }));

  return creditCards;
}


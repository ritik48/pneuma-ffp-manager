"use server";

import { SortOrder, Types } from "mongoose";
import {
  ClientFrequentFlyerProgram,
  FrequentFlyerProgram,
  FrequentFlyerProgramDocument,
} from "./app/_models/frequent-flyer-program.model";
import { connectDB } from "./lib/db";

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

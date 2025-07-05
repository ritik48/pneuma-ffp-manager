import { seed } from "@/app/seed";
import { NextResponse } from "next/server";

export async function GET() {
  await seed();

  return NextResponse.json(
    { success: true, message: "Seeding complete" },
    { status: 201 }
  );
}

import { seed } from "@/app/seed";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authneticated.",
      },
      { status: 401 }
    );
  }
  await seed();

  return NextResponse.json(
    { success: true, message: "Seeding complete" },
    { status: 201 }
  );
}

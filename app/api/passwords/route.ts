import { NextResponse } from "next/server";
import Password from "@/models/Password";
import { connectDb } from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    console.log("Starting GET /api/passwords request");

    await connectDb();
    console.log("DB connected");

    const { userId } = await auth();
    console.log("Auth User ID:", userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const passwords = await Password.find({ userId });
    console.log("Passwords found:", passwords.length);

    return NextResponse.json(
      {
        success: true,
        data: passwords,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching passwords.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

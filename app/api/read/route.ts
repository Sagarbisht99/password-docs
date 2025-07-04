// app/api/read/route.ts
import { NextResponse } from "next/server";
import Password from "@/models/Password";
import { connectDb } from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// ✅ Support GET method instead of POST
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectDb();

    const passwords = await Password.find({ userId });

    return NextResponse.json(passwords, { status: 200 });
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

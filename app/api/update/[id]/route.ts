import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";
import Password from "@/models/Password";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  try {
    await connectDb();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Extract ID manually from URL
    const id = req.nextUrl.pathname.split("/").pop();

    const { url, username, password } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!url || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedPassword = await Password.findOneAndUpdate(
      { _id: id, userId },
      { url, username, password },
      { new: true }
    );

    if (!updatedPassword) {
      return NextResponse.json(
        { error: "Password not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: updatedPassword,
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

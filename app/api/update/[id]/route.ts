import { NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";
import Password from "@/models/Password";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const { userId } = await auth(); // Get userId from Clerk
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
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
      { _id: id, userId }, // Find by _id AND userId
      { url, username, password },
      { new: true }
    );

    if (!updatedPassword) {
      return NextResponse.json({ error: "Password not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(
      { 
        data: updatedPassword,
        message: "Password updated successfully" 
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
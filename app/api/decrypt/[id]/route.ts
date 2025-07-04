import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDb } from "@/lib/dbConnect";
import Password from "@/models/Password";
import { decrypt } from "@/lib/encryption";

// ✅ Corrected type — NOT a Promise!
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDb();

    const { userId } = await auth(); // ✅ No await needed

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const password = await Password.findOne({ _id: id, userId });

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password not found" },
        { status: 404 }
      );
    }

    const decryptedPassword = decrypt(password.password);

    return NextResponse.json(
      {
        success: true,
        data: { password: decryptedPassword },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error decrypting password",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

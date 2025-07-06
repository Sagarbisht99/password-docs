import { NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";
import Password from "@/models/Password";
import type { NextRequest } from "next/server";

// ✅ this is the correct signature
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDb();

    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedPassword = await Password.findByIdAndDelete(id);

    if (!deletedPassword) {
      return NextResponse.json({ error: "Password not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

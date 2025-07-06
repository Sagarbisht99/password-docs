import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/dbConnect";
import Password from "@/models/Password";

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // get 'id' from the path

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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

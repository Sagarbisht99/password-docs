import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDb } from "@/lib/dbConnect";
import Upload from "@/models/Upload";
import imagekit from "@/lib/imagekit";

export async function POST(req: Request) {
  try {
    if (
      !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
    ) {
      console.error("ImageKit configuration missing");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file type. Allowed types: JPEG, PNG, GIF, PDF, DOC, DOCX",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder: `/users/${userId}`,
      });

      await connectDb();

      const newUpload = new Upload({
        title: file.name,
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        userId: userId,
      });

      await newUpload.save();

      return NextResponse.json({
        success: true,
        data: {
          _id: newUpload._id,
          url: uploadResponse.url,
          title: file.name,
          fileId: uploadResponse.fileId,
          createdAt: newUpload.createdAt,
        },
      });
    } catch (uploadError) {
      console.error("ImageKit upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();

    const files = await Upload.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "File ID is required" },
        { status: 400 }
      );
    }

    await connectDb();

    const file = await Upload.findOne({ _id: fileId, userId });

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    try {
      await imagekit.deleteFile(file.fileId);

      await Upload.deleteOne({ _id: fileId });

      return NextResponse.json({ success: true });
    } catch (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fileId, newTitle } = body;

    if (!fileId || !newTitle) {
      return NextResponse.json(
        { success: false, error: "File ID and new title are required" },
        { status: 400 }
      );
    }

    await connectDb();

    const file = await Upload.findOneAndUpdate(
      { _id: fileId, userId },
      { title: newTitle },
      { new: true }
    );

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: file._id,
        url: file.url,
        title: file.title,
        fileId: file.fileId,
        createdAt: file.createdAt,
      },
    });
  } catch (error) {
    console.error("Rename error:", error);
    return NextResponse.json(
      { success: false, error: "Rename failed" },
      { status: 500 }
    );
  }
}
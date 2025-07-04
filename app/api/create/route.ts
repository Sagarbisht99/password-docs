import { NextResponse } from "next/server";
import Password from "@/models/Password";
import { connectDb } from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { encrypt } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    console.log("Starting password creation process...");

    // Connect to DB
    console.log("Connecting to database...");
    await connectDb();
    console.log("Database connected successfully");

    // Verify Clerk user session
    console.log("Verifying user session...");
    const { userId } = await auth();

    if (!userId) {
      console.log("No user ID found in session");
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }
    console.log("User authenticated successfully");

    // Parse request body
    console.log("Parsing request body...");
    const body = await req.json();
    const { url, username, password } = body;
    
    if (!body || typeof body !== 'object') {
      console.log("Invalid request body format");
      return NextResponse.json(
        { success: false, message: "Invalid request format" },
        { status: 400 }
      );
    }

    console.log("Request body parsed:", { url, username, password: "***" });

    // Validate inputs
    if (!url || !username || !password) {
      console.log("Missing required fields");
      return NextResponse.json(
        { 
          success: false, 
          message: "All fields are required.",
          receivedFields: { 
            hasUrl: !!url, 
            hasUsername: !!username, 
            hasPassword: !!password 
          }
        },
        { status: 400 }
      );
    }

    // Encrypt the password before saving
    console.log("Encrypting password...");
    const encryptedPassword = encrypt(password);
    console.log("Password encrypted successfully");

    // Create and save new Password document with userId from Clerk
    console.log("Creating new password document...");
    const newPassword = new Password({ 
      url, 
      username, 
      password: encryptedPassword,
      userId 
    });
    
    console.log("Saving password to database...");
    await newPassword.save();
    console.log("Password saved successfully");

    // Return response without the plain password
    const responseData = newPassword.toObject();
    delete responseData.password; // Remove the encrypted password from response

    return NextResponse.json(
      {
        success: true,
        message: "Password saved successfully.",
        data: responseData
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in password creation:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error while saving password.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

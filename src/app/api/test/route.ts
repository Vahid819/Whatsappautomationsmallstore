import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const doc = await adminDb.collection("test").add({
      message: "Firebase Connected Successfully",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: doc.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      {
        status: 500,
      }
    );
  }
}
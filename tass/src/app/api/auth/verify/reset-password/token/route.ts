import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    console.log("TOKEN:", token);
    console.log("BACKEND_URL:", process.env.BACKEND_URL);

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    if (!process.env.BACKEND_URL) {
      throw new Error("BACKEND_URL is not defined");
    }

    const backendRes = await fetch(
      `${process.env.BACKEND_URL}/auth/reset-password/verify?token=${token}`
    );

    const data = await backendRes.json();

    return NextResponse.json(data, {
      status: backendRes.status,
    });

  } catch (error: any) {
    console.error("RESET TOKEN VERIFY ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

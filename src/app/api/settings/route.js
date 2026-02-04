import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("RAW BODY:", body);
    const { name, email, regno } = body;

    if (!name || !email || !regno) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const input = await prisma.admin.create({
      data: {
        name,
        email,
        registrationNumber: regno,
      },
    });

    return NextResponse.json(input, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

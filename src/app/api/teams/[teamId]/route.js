import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET( request, { params }) {
  console.log("RAW PARAMS", params)
  const { teamId } = params;

  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        name: true,
        track: true,
        vitStudents: {
          select: {
            name: true,
            regNo: true,
          },
        },
        figmaLink: true,
        githubLink: true,
        pptLink: true,
        otherLinks: true
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    console.log(team);
    return NextResponse.json(team);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

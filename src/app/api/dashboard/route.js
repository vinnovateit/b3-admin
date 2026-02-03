import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const counter = await prisma.team.count();

        const sub_count = await prisma.team.count({
            where: {
                submitted: true
            }
        });

        const teams = await prisma.team.findMany();

        return NextResponse.json({
            teamcount: counter,
            subcount: sub_count,
            teamlist: teams
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch team data" },
            { status: 500 }
        );
    }
}

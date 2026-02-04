import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const counter = await prisma.team.count();

        const sub_count = await prisma.team.count({
            where: {
                submitted: true
            }
        });

        const teams = await prisma.team.findMany({
            select:{
                name:true,
                submitted:true,
                id: true,
                code: true
            }
        })

        return NextResponse.json({
            teamcount: counter,
            subcount: sub_count,
            teamlist: teams
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch team data" },
            { status: 500 }
        );
    }
}

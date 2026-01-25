import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    if (!params) {
      return new NextResponse(
        JSON.stringify({ error: "Missing parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { team_id } = await params;

    if (!team_id || !/^[a-f\d]{24}$/i.test(team_id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid team ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const reviewerId = req.nextUrl.searchParams.get("reviewerId");

    if (!reviewerId) {
      return new NextResponse(
        JSON.stringify({ error: "Missing reviewerId query parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!/^[a-f\d]{24}$/i.test(reviewerId)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid reviewerId format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const team = await prisma.team.findFirst({
      where: { id: team_id }
    });

    if (!team) {
      return new NextResponse(
        JSON.stringify({ error: "Team not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const review = await prisma.review.findFirst({
      where: { teamId: team_id, reviewerUserId: reviewerId }
    });

    if (!review) {
      return new NextResponse(
        JSON.stringify({ error: "Review not found for this team and reviewer" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (review.round !== "ONE" && review.round !== "TWO") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid round value in review" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const round = review.round === "ONE"
      ? await prisma.round_1.findFirst({ where: { id: review.round_id } })
      : await prisma.round_2.findFirst({ where: { id: review.round_id } });

    if (!round) {
      return new NextResponse(
        JSON.stringify({ error: `Round ${review.round} details not found` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        teamName: team.name,
        teamId: team.id,
        track: team.track,
        roundNum: review.round,
        roundDetails: round,
        remarks: review.remarks,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    if (error.code === "P2025") {
      return new NextResponse(
        JSON.stringify({ error: "Record not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P2023") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P1001" || error.code === "P1002") {
      return new NextResponse(
        JSON.stringify({ error: "Database connection failed" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Unexpected error in GET /api/team_remarks/[team_id]:", error);

    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  // REMOVED: finally block with $disconnect()
  // Reason: Prisma docs state not to disconnect after each request in long-running apps
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    if (!params) {
      return new NextResponse(
        JSON.stringify({ error: "Missing parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { team_id } = await params;

    if (!team_id || !/^[a-f\d]{24}$/i.test(team_id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid team ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let reqData;
    try {
      reqData = await req.json();
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { marks, remarks, reviewerId, roundNum } = reqData;

    if (!marks) {
      return new NextResponse(
        JSON.stringify({ error: "Missing marks in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (remarks === undefined || remarks === null) {
      return new NextResponse(
        JSON.stringify({ error: "Missing remarks in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!reviewerId) {
      return new NextResponse(
        JSON.stringify({ error: "Missing reviewerId in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!roundNum) {
      return new NextResponse(
        JSON.stringify({ error: "Missing roundNum in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!/^[a-f\d]{24}$/i.test(reviewerId)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid reviewerId format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (roundNum !== "ONE" && roundNum !== "TWO") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid roundNum. Must be 'ONE' or 'TWO'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (roundNum === "ONE") {
      const requiredFields = ["problemClarity", "UIUX", "feasibility", "TechStack", "pitch", "Total"];
      const missingFields = requiredFields.filter(field => marks[field] === undefined);

      if (missingFields.length > 0) {
        return new NextResponse(
          JSON.stringify({
            error: `Missing required fields for Round 1: ${missingFields.join(", ")}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const invalidFields = requiredFields.filter(field =>
        typeof marks[field] !== "number" || isNaN(marks[field])
      );

      if (invalidFields.length > 0) {
        return new NextResponse(
          JSON.stringify({
            error: `Invalid numeric values for fields: ${invalidFields.join(", ")}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      const requiredFields = ["designUX", "technicalExecution", "web3Integration", "impact", "completeness", "futureScope", "Total"];
      const missingFields = requiredFields.filter(field => marks[field] === undefined);

      if (missingFields.length > 0) {
        return new NextResponse(
          JSON.stringify({
            error: `Missing required fields for Round 2: ${missingFields.join(", ")}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const invalidFields = requiredFields.filter(field =>
        typeof marks[field] !== "number" || isNaN(marks[field])
      );

      if (invalidFields.length > 0) {
        return new NextResponse(
          JSON.stringify({
            error: `Invalid numeric values for fields: ${invalidFields.join(", ")}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const teamExists = await prisma.team.findFirst({
      where: { id: team_id }
    });

    if (!teamExists) {
      return new NextResponse(
        JSON.stringify({ error: "Team not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const reviewerExists = await prisma.admin.findFirst({
      where: { id: reviewerId }
    });

    if (!reviewerExists) {
      return new NextResponse(
        JSON.stringify({ error: "Reviewer not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    let round_id: string;
    try {
      const roundRecord = roundNum === "ONE"
        ? await prisma.round_1.create({ data: marks as any })
        : await prisma.round_2.create({ data: marks as any });

      round_id = roundRecord.id;
    } catch (error) {
      console.error("Error creating round record:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to create round record" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const dbData = {
      teamId: team_id,
      round: roundNum,
      round_id: round_id,
      remarks: remarks,
      reviewerUserId: reviewerId
    };

    try {
      const existingReview = await prisma.review.findFirst({
        where: { teamId: team_id, reviewerUserId: reviewerId }
      });

      if (existingReview) {
        await prisma.review.update({
          where: { id: existingReview.id },
          data: dbData
        });
      } else {
        await prisma.review.create({ data: dbData });
      }

      return new NextResponse(
        JSON.stringify({
          message: existingReview ? "Review updated successfully" : "Review created successfully",
          reviewId: existingReview?.id,
          roundId: round_id
        }),
        { status: existingReview ? 200 : 201, headers: { "Content-Type": "application/json" } }
      );

    } catch (error) {
      console.error("Error saving review:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to save review" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    if (error.code === "P2025") {
      return new NextResponse(
        JSON.stringify({ error: "Record not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P2023") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P2002") {
      return new NextResponse(
        JSON.stringify({ error: "Duplicate record - review already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P2003") {
      return new NextResponse(
        JSON.stringify({ error: "Foreign key constraint failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P1001" || error.code === "P1002") {
      return new NextResponse(
        JSON.stringify({ error: "Database connection failed" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Unexpected error in POST /api/team_remarks/[team_id]:", error);

    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  // REMOVED: finally block with $disconnect()
  // Reason: Prisma docs state not to disconnect after each request in long-running apps
}
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { report } from "@/db/schemas/schema";
import { eq } from "drizzle-orm";

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000;

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )
  );
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);

    const latitude = Number(
      searchParams.get("latitude"),
    );

    const longitude = Number(
      searchParams.get("longitude"),
    );

    const radius = Number(
      searchParams.get("radius") || 500,
    );

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 },
      );
    }

    const reports = await db
      .select({
        latitude: report.latitude,
        longitude: report.longitude,
      })
      .from(report);

    const count = reports.filter((item) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        Number(item.latitude),
        Number(item.longitude),
      );

      return distance <= radius;
    }).length;

    return NextResponse.json({
      count,
      radius,
    });
  } catch (error) {
    console.error(
      "REPORT COUNT ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Failed to calculate report count" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    console.log(
      "REPORT REQUEST BODY:",
      body,
    );

    const {
      latitude,
      longitude,
      damageType,
      confidence,
      riskScore,
      riskLevel,
      infrastructureRisk,
      gis,
      description,
      imageUrl,
    } = body;

    if (
      latitude === undefined ||
      latitude === null ||
      longitude === undefined ||
      longitude === null ||
      !damageType ||
      riskScore === undefined ||
      riskScore === null ||
      !riskLevel
    ) {
      return NextResponse.json(
        {
          error: "Missing required report fields",
        },
        { status: 400 },
      );
    }

    const reportId = `RD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const [newReport] = await db
      .insert(report)
      .values({
        id: reportId,

        userId: session.user.id,

        latitude: Number(latitude),
        longitude: Number(longitude),

        damageType: String(damageType),

        confidence:
          confidence !== undefined &&
          confidence !== null
            ? Number(confidence)
            : null,

        riskScore: Number(riskScore),
        riskLevel: String(riskLevel),

        infrastructureRisk:
          infrastructureRisk !== undefined &&
          infrastructureRisk !== null
            ? Number(infrastructureRisk)
            : null,

        infrastructureData:
          gis !== undefined &&
          gis !== null
            ? JSON.stringify(gis)
            : null,

        description:
          description
            ? String(description)
            : null,

        imageUrl:
          imageUrl
            ? String(imageUrl)
            : null,

        status: "UNDER_REVIEW",
      })
      .returning();

    console.log(
      "REPORT CREATED:",
      newReport,
    );

    return NextResponse.json(
      {
        message: "Report created successfully",
        report: newReport,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "CREATE REPORT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to create report",
      },
      { status: 500 },
    );
  }
}
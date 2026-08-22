import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

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
  let savedImagePath: string | null = null;

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

    const formData = await request.formData();

    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");
    const damageType = formData.get("damageType");
    const confidence = formData.get("confidence");
    const riskScore = formData.get("riskScore");
    const riskLevel = formData.get("riskLevel");
    const infrastructureRisk =
      formData.get("infrastructureRisk");
    const gis = formData.get("gis");
    const description = formData.get("description");
    const image = formData.get("image");

    if (
      latitude === null ||
      longitude === null ||
      !damageType ||
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

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error: "Report image is required",
        },
        { status: 400 },
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Invalid image file",
        },
        { status: 400 },
      );
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Image is too large",
        },
        { status: 400 },
      );
    }

    const reportId = `RD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const extension =
      image.type === "image/png"
        ? "png"
        : image.type === "image/webp"
          ? "webp"
          : "jpg";

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const fileName = `${reportId}.${extension}`;

    const absoluteImagePath = path.join(
      uploadDirectory,
      fileName,
    );

    const imageBuffer = Buffer.from(
      await image.arrayBuffer(),
    );

    await writeFile(
      absoluteImagePath,
      imageBuffer,
    );

    savedImagePath = absoluteImagePath;

    const gisData =
      typeof gis === "string" && gis
        ? gis
        : null;

    const [newReport] = await db
      .insert(report)
      .values({
        id: reportId,

        userId: session.user.id,

        latitude: Number(latitude),
        longitude: Number(longitude),

        damageType: String(damageType),

        confidence:
          confidence !== null
            ? Number(confidence)
            : null,

        riskScore: Number(riskScore),
        riskLevel: String(riskLevel),

        infrastructureRisk:
          infrastructureRisk !== null
            ? Number(infrastructureRisk)
            : null,

        infrastructureData: gisData,

        description:
          description
            ? String(description)
            : null,

        imageUrl: `/uploads/${fileName}`,

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
    if (savedImagePath) {
      try {
        await unlink(savedImagePath);
      } catch {}
    }

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
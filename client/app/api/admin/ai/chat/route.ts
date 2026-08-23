import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { report } from "@/db/schemas/schema";
import { desc } from "drizzle-orm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export async function POST(request: Request) {
  try {


    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }


    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }



    const body = await request.json();

    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim()
        : "";

    if (!prompt) {
      return NextResponse.json(
        {
          error: "Prompt is required",
        },
        {
          status: 400,
        },
      );
    }



    const reports = await db
      .select({
        id: report.id,
        latitude: report.latitude,
        longitude: report.longitude,
        damageType: report.damageType,
        confidence: report.confidence,
        riskScore: report.riskScore,
        riskLevel: report.riskLevel,
        infrastructureRisk:
          report.infrastructureRisk,
        infrastructureData:
          report.infrastructureData,
        description: report.description,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      })
      .from(report)
      .orderBy(desc(report.createdAt));



    const response = await fetch(
      `${API_URL}/api/ai/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt,
          reports: reports.map((item) => ({
            id: item.id,

            latitude: item.latitude,
            longitude: item.longitude,

            damageType: item.damageType,

            confidence:
              item.confidence,

            riskScore:
              item.riskScore,

            riskLevel:
              item.riskLevel,

            infrastructureRisk:
              item.infrastructureRisk,

            infrastructureData:
              item.infrastructureData,

            description:
              item.description,

            status:
              item.status,

            createdAt:
              item.createdAt.toISOString(),

            updatedAt:
              item.updatedAt.toISOString(),
          })),
        }),
      },
    );


    let data: {
      response?: string;
      error?: string;
    };

    try {
      data = await response.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "AI server returned an invalid response.",
        },
        {
          status: 502,
        },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error ||
            "AI server request failed.",
        },
        {
          status: response.status,
        },
      );
    }


    return NextResponse.json({
      response: data.response,
    });
  } catch (error) {
    console.error(
      "ADMIN AI CHAT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to process AI assistant request.",
      },
      {
        status: 500,
      },
    );
  }
}
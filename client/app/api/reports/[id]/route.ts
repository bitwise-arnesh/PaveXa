import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { unlink } from "fs/promises";
import path from "path";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { report } from "@/db/schemas/schema";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const VALID_STATUSES = ["UNDER_REVIEW", "IN_PROGRESS", "RESOLVED"] as const;

type ReportStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(request: Request, context: RouteContext) {
  try {
    // Check authentication
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

    // Only admins can change report status
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Report ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const status = body.status as ReportStatus;

    // Validate status
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid report status",
          allowedStatuses: VALID_STATUSES,
        },
        {
          status: 400,
        },
      );
    }

    // Make sure the report exists
    const [existingReport] = await db
      .select({
        id: report.id,
      })
      .from(report)
      .where(eq(report.id, id))
      .limit(1);

    if (!existingReport) {
      return NextResponse.json(
        {
          error: "Report not found",
        },
        {
          status: 404,
        },
      );
    }

    // Update report status
    const [updatedReport] = await db
      .update(report)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(report.id, id))
      .returning({
        id: report.id,
        status: report.status,
        updatedAt: report.updatedAt,
      });

    if (!updatedReport) {
      return NextResponse.json(
        {
          error: "Failed to update report",
        },
        {
          status: 500,
        },
      );
    }

    console.log(
      "REPORT STATUS UPDATED:",
      updatedReport.id,
      "→",
      updatedReport.status,
    );

    return NextResponse.json({
      message: "Report status updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("UPDATE REPORT STATUS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update report status",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    // Check authentication
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Report ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const [existingReport] = await db
      .select({
        id: report.id,
        userId: report.userId,
        imageUrl: report.imageUrl,
        status: report.status,
      })
      .from(report)
      .where(and(eq(report.id, id), eq(report.userId, session.user.id)))
      .limit(1);

    if (!existingReport) {
      return NextResponse.json(
        {
          error: "Report not found",
        },
        {
          status: 404,
        },
      );
    }

    if (existingReport.status !== "UNDER_REVIEW") {
      return NextResponse.json(
        {
          error:
            "This report cannot be deleted because it is already in progress or resolved.",
        },
        {
          status: 403,
        },
      );
    }

    await db
      .delete(report)
      .where(and(eq(report.id, id), eq(report.userId, session.user.id)));

    if (existingReport.imageUrl) {
      try {
        const imagePath = path.join(
          process.cwd(),
          "public",
          existingReport.imageUrl.replace(/^\/+/, ""),
        );

        await unlink(imagePath);
      } catch (error) {
        console.warn("REPORT IMAGE DELETE WARNING:", error);
      }
    }

    console.log("REPORT DELETED:", existingReport.id);

    return NextResponse.json({
      message: "Report deleted successfully",
      reportId: existingReport.id,
    });
  } catch (error) {
    console.error("DELETE REPORT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete report",
      },
      {
        status: 500,
      },
    );
  }
}

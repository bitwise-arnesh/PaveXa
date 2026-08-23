import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { unlink } from "fs/promises";
import path from "path";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { report } from "@/db/schemas/schema";
import { and, eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
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
      })
      .from(report)
      .where(
        and(
          eq(report.id, id),
          eq(report.userId, session.user.id),
        ),
      )
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

    /*
     * Delete the database record.
     *
     * userId has already been checked above, so
     * this can only delete the authenticated user's report.
     */
    await db
      .delete(report)
      .where(
        and(
          eq(report.id, id),
          eq(report.userId, session.user.id),
        ),
      );

    /*
     * Delete the uploaded image from:
     *
     * public/uploads/<filename>
     *
     * Do this after deleting the database record.
     */
    if (existingReport.imageUrl) {
      try {
        const imagePath = path.join(
          process.cwd(),
          "public",
          existingReport.imageUrl.replace(/^\/+/, ""),
        );

        await unlink(imagePath);
      } catch (error) {
        /*
         * If the image is already missing, don't fail
         * the whole deletion.
         */
        console.warn(
          "REPORT IMAGE DELETE WARNING:",
          error,
        );
      }
    }

    console.log(
      "REPORT DELETED:",
      existingReport.id,
    );

    return NextResponse.json({
      message: "Report deleted successfully",
      reportId: existingReport.id,
    });
  } catch (error) {
    console.error(
      "DELETE REPORT ERROR:",
      error,
    );

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
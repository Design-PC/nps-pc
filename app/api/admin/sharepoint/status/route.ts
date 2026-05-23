import { isSharePointExcelConfigured, resolveSharePointWorkbookTarget } from "@/lib/sharepoint-excel";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSharePointExcelConfigured()) {
    return Response.json({
      configured: false,
      message: "SharePoint Excel integration is not configured.",
    });
  }

  try {
    const target = await resolveSharePointWorkbookTarget();
    return Response.json({
      configured: true,
      connected: true,
      tableName: target.tableName,
      driveId: target.driveId,
      itemId: target.itemId,
    });
  } catch (error) {
    return Response.json(
      {
        configured: true,
        connected: false,
        message: error instanceof Error ? error.message : "Unknown SharePoint connection error.",
      },
      { status: 502 },
    );
  }
}

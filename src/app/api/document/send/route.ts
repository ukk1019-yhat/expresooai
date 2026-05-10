import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  sendToSlack,
  sendToNotion,
  sendEmailReport,
  type DocumentReport,
} from "@/lib/integrations";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      destination,
      report,
      fileName,
      // destination-specific config
      slackWebhookUrl,
      notionApiKey,
      notionDatabaseId,
      emailAddress,
    } = body as {
      destination: "slack" | "notion" | "email";
      report: DocumentReport;
      fileName: string;
      slackWebhookUrl?: string;
      notionApiKey?: string;
      notionDatabaseId?: string;
      emailAddress?: string;
    };

    if (!destination || !report || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields: destination, report, fileName" },
        { status: 400 }
      );
    }

    switch (destination) {
      case "slack": {
        const webhookUrl =
          slackWebhookUrl || process.env.SLACK_WEBHOOK_URL;
        if (!webhookUrl) {
          return NextResponse.json(
            { error: "Slack webhook URL is required. Provide it in the request or set SLACK_WEBHOOK_URL env var." },
            { status: 400 }
          );
        }
        await sendToSlack(webhookUrl, report, fileName);
        return NextResponse.json({ success: true, message: "Report sent to Slack" });
      }

      case "notion": {
        const apiKey = notionApiKey || process.env.NOTION_API_KEY;
        const dbId = notionDatabaseId || process.env.NOTION_DATABASE_ID;
        if (!apiKey || !dbId) {
          return NextResponse.json(
            {
              error:
                "Notion API key and database ID are required. Provide them in the request or set NOTION_API_KEY and NOTION_DATABASE_ID env vars.",
            },
            { status: 400 }
          );
        }
        await sendToNotion(apiKey, dbId, report, fileName);
        return NextResponse.json({ success: true, message: "Report saved to Notion" });
      }

      case "email": {
        if (!emailAddress) {
          return NextResponse.json(
            { error: "Email address is required" },
            { status: 400 }
          );
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
          return NextResponse.json(
            { error: "Invalid email address" },
            { status: 400 }
          );
        }
        await sendEmailReport(emailAddress, report, fileName);
        return NextResponse.json({ success: true, message: `Report emailed to ${emailAddress}` });
      }

      default:
        return NextResponse.json(
          { error: `Unknown destination: ${destination}` },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Document send error:", error);
    return NextResponse.json(
      { error: `Failed to send report: ${message}` },
      { status: 500 }
    );
  }
}

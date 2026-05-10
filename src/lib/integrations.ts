import "server-only";

export interface DocumentReport {
  title: string;
  summary: string;
  issues: Array<{ title: string; description: string; severity: "high" | "medium" | "low" }>;
  solutions: Array<{ issue: string; solution: string }>;
  recommendations: string[];
  score: number; // 1-10 overall document health
}

// ─── Slack ────────────────────────────────────────────────────────────────────

export async function sendToSlack(
  webhookUrl: string,
  report: DocumentReport,
  fileName: string
): Promise<void> {
  const severityEmoji = { high: "🔴", medium: "🟡", low: "🟢" };

  const issueBlocks = report.issues.slice(0, 5).map((issue) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `${severityEmoji[issue.severity]} *${issue.title}*\n${issue.description}`,
    },
  }));

  const solutionText = report.solutions
    .slice(0, 3)
    .map((s, i) => `${i + 1}. *${s.issue}*: ${s.solution}`)
    .join("\n");

  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📄 Document Analysis: ${fileName}`,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Health Score:* ${report.score}/10` },
          { type: "mrkdwn", text: `*Issues Found:* ${report.issues.length}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Summary:*\n${report.summary}` },
      },
      { type: "divider" },
      {
        type: "section",
        text: { type: "mrkdwn", text: "*Issues Identified:*" },
      },
      ...issueBlocks,
      { type: "divider" },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Top Solutions:*\n${solutionText}` },
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Slack webhook failed: ${res.status} ${await res.text()}`);
  }
}

// ─── Notion ───────────────────────────────────────────────────────────────────

export async function sendToNotion(
  apiKey: string,
  databaseId: string,
  report: DocumentReport,
  fileName: string
): Promise<void> {
  const severityColor = { high: "red", medium: "yellow", low: "green" } as const;

  const issueBlocks = report.issues.flatMap((issue) => [
    {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [
          {
            type: "text",
            text: { content: `[${issue.severity.toUpperCase()}] ${issue.title}: ${issue.description}` },
          },
        ],
        color: `${severityColor[issue.severity]}_background` as string,
      },
    },
  ]);

  const solutionBlocks = report.solutions.map((s) => ({
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: `${s.issue}: ${s.solution}` },
        },
      ],
    },
  }));

  const body = {
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: `Document Analysis: ${fileName}` } }],
      },
      Score: { number: report.score },
      "Issues Count": { number: report.issues.length },
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Summary" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: report.summary } }],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Issues Found" } }],
        },
      },
      ...issueBlocks,
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Solutions" } }],
        },
      },
      ...solutionBlocks,
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Recommendations" } }],
        },
      },
      ...report.recommendations.map((rec) => ({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: rec } }],
        },
      })),
    ],
  };

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Notion API failed: ${res.status} ${await res.text()}`);
  }
}

// ─── Email (via Resend) ───────────────────────────────────────────────────────

export async function sendEmailReport(
  toEmail: string,
  report: DocumentReport,
  fileName: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured. Add it to your .env.local file."
    );
  }

  const scoreColor =
    report.score >= 8 ? "#22c55e" : report.score >= 6 ? "#c47d3b" : "#ef4444";

  const issueRows = report.issues
    .map(
      (issue) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #27272a;color:${
            issue.severity === "high"
              ? "#ef4444"
              : issue.severity === "medium"
              ? "#f59e0b"
              : "#22c55e"
          };font-size:11px;font-weight:700;text-transform:uppercase;white-space:nowrap">${issue.severity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #27272a;color:#e4e4e7;font-weight:600">${issue.title}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #27272a;color:#a1a1aa;font-size:13px">${issue.description}</td>
        </tr>`
    )
    .join("");

  const solutionItems = report.solutions
    .map(
      (s, i) =>
        `<div style="display:flex;gap:12px;margin-bottom:12px">
          <div style="min-width:24px;height:24px;border-radius:50%;background:#c47d3b22;border:1px solid #c47d3b44;display:flex;align-items:center;justify-content:center;color:#c47d3b;font-size:11px;font-weight:700;flex-shrink:0;text-align:center;line-height:24px">${i + 1}</div>
          <div>
            <div style="color:#c47d3b;font-size:12px;font-weight:600;margin-bottom:2px">${s.issue}</div>
            <div style="color:#d4d4d8;font-size:13px;line-height:1.5">${s.solution}</div>
          </div>
        </div>`
    )
    .join("");

  const recItems = report.recommendations
    .map(
      (r, i) =>
        `<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start">
          <span style="color:#c47d3b;font-weight:700;font-size:13px;flex-shrink:0">${i + 1}.</span>
          <span style="color:#d4d4d8;font-size:13px;line-height:1.5">${r}</span>
        </div>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:680px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px">
      <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px">
        EXPRESSO<span style="color:#c47d3b">AI</span>
      </div>
      <div style="color:#71717a;font-size:13px;margin-top:4px">Document Intelligence Report</div>
    </div>

    <!-- Title card -->
    <div style="background:#111118;border:1px solid #27272a;border-radius:16px;padding:24px;margin-bottom:20px">
      <div style="color:#71717a;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">Analyzed File</div>
      <div style="color:#fff;font-size:18px;font-weight:700;margin-bottom:4px">${report.title}</div>
      <div style="color:#52525b;font-size:12px">${fileName}</div>
    </div>

    <!-- Score + summary -->
    <div style="background:#111118;border:1px solid #27272a;border-radius:16px;padding:24px;margin-bottom:20px;display:flex;gap:24px;align-items:center">
      <div style="text-align:center;flex-shrink:0">
        <div style="font-size:52px;font-weight:800;color:${scoreColor};line-height:1">${report.score}</div>
        <div style="font-size:18px;color:#52525b;margin-top:-4px">/10</div>
        <div style="color:#71717a;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px">Health Score</div>
      </div>
      <div style="flex:1;border-left:1px solid #27272a;padding-left:24px">
        <div style="color:#71717a;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Summary</div>
        <div style="color:#d4d4d8;font-size:14px;line-height:1.6">${report.summary}</div>
      </div>
    </div>

    <!-- Issues -->
    <div style="background:#111118;border:1px solid #27272a;border-radius:16px;overflow:hidden;margin-bottom:20px">
      <div style="padding:16px 20px;border-bottom:1px solid #27272a">
        <div style="color:#71717a;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em">
          Issues Found (${report.issues.length})
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#0d0d14">
            <th style="padding:8px 12px;text-align:left;color:#52525b;font-size:11px;font-weight:600;text-transform:uppercase">Severity</th>
            <th style="padding:8px 12px;text-align:left;color:#52525b;font-size:11px;font-weight:600;text-transform:uppercase">Issue</th>
            <th style="padding:8px 12px;text-align:left;color:#52525b;font-size:11px;font-weight:600;text-transform:uppercase">Description</th>
          </tr>
        </thead>
        <tbody>${issueRows}</tbody>
      </table>
    </div>

    <!-- Solutions -->
    <div style="background:#111118;border:1px solid #27272a;border-radius:16px;padding:20px;margin-bottom:20px">
      <div style="color:#71717a;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px">
        Solutions (${report.solutions.length})
      </div>
      ${solutionItems}
    </div>

    <!-- Recommendations -->
    <div style="background:#111118;border:1px solid #27272a;border-radius:16px;padding:20px;margin-bottom:32px">
      <div style="color:#71717a;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px">
        Recommendations
      </div>
      ${recItems}
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:#3f3f46;font-size:11px;border-top:1px solid #18181b;padding-top:20px">
      Generated by EXPRESSO AI · Document Intelligence<br>
      <span style="color:#27272a">·</span>
    </div>

  </div>
</body>
</html>`;

  // Call Resend API directly (no SDK needed, keeps bundle small)
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "EXPRESSO AI <onboarding@resend.dev>",
      to: [toEmail],
      subject: `Document Analysis Report: ${fileName}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Resend API error ${res.status}: ${JSON.stringify(err)}`
    );
  }
}

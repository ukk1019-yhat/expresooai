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

// ─── Email (via SMTP / Google Script fallback) ────────────────────────────────

export async function sendEmailReport(
  toEmail: string,
  report: DocumentReport,
  fileName: string
): Promise<void> {
  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!googleScriptUrl) {
    throw new Error("GOOGLE_SCRIPT_URL is not configured");
  }

  const issueRows = report.issues
    .map(
      (issue) =>
        `<tr>
          <td style="padding:8px;border:1px solid #333;color:${issue.severity === "high" ? "#ef4444" : issue.severity === "medium" ? "#f59e0b" : "#22c55e"}">${issue.severity.toUpperCase()}</td>
          <td style="padding:8px;border:1px solid #333;color:#e4e4e7">${issue.title}</td>
          <td style="padding:8px;border:1px solid #333;color:#a1a1aa">${issue.description}</td>
        </tr>`
    )
    .join("");

  const solutionRows = report.solutions
    .map(
      (s) =>
        `<tr>
          <td style="padding:8px;border:1px solid #333;color:#e4e4e7">${s.issue}</td>
          <td style="padding:8px;border:1px solid #333;color:#a1a1aa">${s.solution}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;background:#0a0a0f;color:#e4e4e7;padding:32px;max-width:700px;margin:0 auto">
      <h1 style="color:#c47d3b;margin-bottom:4px">Document Analysis Report</h1>
      <p style="color:#71717a;margin-top:0">File: ${fileName}</p>

      <div style="background:#111118;border:1px solid #27272a;border-radius:12px;padding:20px;margin:24px 0">
        <div style="font-size:48px;font-weight:bold;color:${report.score >= 8 ? "#22c55e" : report.score >= 6 ? "#c47d3b" : "#ef4444"}">${report.score}<span style="font-size:24px;color:#52525b">/10</span></div>
        <div style="color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Health Score</div>
      </div>

      <h2 style="color:#c47d3b">Summary</h2>
      <p style="color:#a1a1aa;line-height:1.6">${report.summary}</p>

      <h2 style="color:#c47d3b">Issues Found (${report.issues.length})</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="background:#1c1c27">
            <th style="padding:8px;border:1px solid #333;text-align:left;color:#71717a">Severity</th>
            <th style="padding:8px;border:1px solid #333;text-align:left;color:#71717a">Issue</th>
            <th style="padding:8px;border:1px solid #333;text-align:left;color:#71717a">Description</th>
          </tr>
        </thead>
        <tbody>${issueRows}</tbody>
      </table>

      <h2 style="color:#c47d3b">Solutions</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="background:#1c1c27">
            <th style="padding:8px;border:1px solid #333;text-align:left;color:#71717a">Issue</th>
            <th style="padding:8px;border:1px solid #333;text-align:left;color:#71717a">Solution</th>
          </tr>
        </thead>
        <tbody>${solutionRows}</tbody>
      </table>

      <h2 style="color:#c47d3b">Recommendations</h2>
      <ul style="color:#a1a1aa;line-height:2">
        ${report.recommendations.map((r) => `<li>${r}</li>`).join("")}
      </ul>

      <p style="color:#52525b;font-size:12px;margin-top:32px;border-top:1px solid #27272a;padding-top:16px">
        Generated by EXPRESSO AI · Document Intelligence
      </p>
    </div>
  `;

  const res = await fetch(googleScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: toEmail,
      subject: `Document Analysis Report: ${fileName}`,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Email send failed: ${res.status}`);
  }
}

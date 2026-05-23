const graphBaseUrl = "https://graph.microsoft.com/v1.0";

type GraphDriveItem = {
  id: string;
  parentReference?: {
    driveId?: string;
  };
};

type MicrosoftGraphTokenResponse = {
  access_token: string;
};

export type SharePointWorkbookTarget = {
  driveId: string;
  itemId: string;
  tableName: string;
};

export function isSharePointExcelConfigured() {
  return Boolean(
    process.env.MICROSOFT_TENANT_ID &&
      process.env.MICROSOFT_CLIENT_ID &&
      process.env.MICROSOFT_CLIENT_SECRET &&
      process.env.SHAREPOINT_WORKBOOK_URL &&
      process.env.SHAREPOINT_TABLE_NAME,
  );
}

function encodeSharingUrl(url: string) {
  const base64 = Buffer.from(url, "utf-8").toString("base64");
  const encoded = base64.replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `u!${encoded}`;
}

async function getGraphAccessToken() {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Microsoft Graph credentials are not configured.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Microsoft Graph token failed: ${response.status} ${await response.text()}`);
  }

  const payload = (await response.json()) as MicrosoftGraphTokenResponse;
  return payload.access_token;
}

async function graphRequest<T>(path: string, init: RequestInit = {}) {
  const accessToken = await getGraphAccessToken();
  const response = await fetch(`${graphBaseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Microsoft Graph request failed: ${response.status} ${await response.text()}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function resolveSharePointWorkbookTarget(): Promise<SharePointWorkbookTarget> {
  const workbookUrl = process.env.SHAREPOINT_WORKBOOK_URL;
  const tableName = process.env.SHAREPOINT_TABLE_NAME ?? "TabelaRespostasNPS";

  if (!workbookUrl) {
    throw new Error("SHAREPOINT_WORKBOOK_URL is not configured.");
  }

  const shareId = encodeSharingUrl(workbookUrl);
  const item = await graphRequest<GraphDriveItem>(
    `/shares/${encodeURIComponent(shareId)}/driveItem?$select=id,parentReference`,
  );
  const driveId = item.parentReference?.driveId;

  if (!driveId || !item.id) {
    throw new Error("Could not resolve SharePoint workbook driveId/itemId.");
  }

  return {
    driveId,
    itemId: item.id,
    tableName,
  };
}

export async function appendRowsToSharePointTable(rows: unknown[][]) {
  if (!rows.length) {
    return null;
  }

  const target = await resolveSharePointWorkbookTarget();
  return graphRequest(
    `/drives/${encodeURIComponent(target.driveId)}/items/${encodeURIComponent(
      target.itemId,
    )}/workbook/tables/${encodeURIComponent(target.tableName)}/rows/add`,
    {
      method: "POST",
      body: JSON.stringify({
        values: rows,
      }),
    },
  );
}

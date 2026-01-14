// API client for Campaign Intelligence Platform
// Wired to FastAPI backend (no mock data)

export interface CampaignParameters {
  points: number;
  duration_days: number;
  target_size: number;
  expected_avg_order_value?: number;
}

export interface RoiEstimation {
  estimated_participation_rate: number;
  estimated_participants?: number;
  estimated_campaign_cost: number;
  estimated_incremental_revenue: number;
  estimated_roi: number;
}

export interface Campaign {
  campaign_id: string;
  segment_id?: string;
  segment: string;
  campaign_type: string;
  channel: string;
  priority: "low" | "medium" | "high";
  reason: string;
  insight: string;
  message: string;
  parameters: CampaignParameters;
  roi_estimation: RoiEstimation;
  status: "AI_RECOMMENDED" | "DRAFT" | "LAUNCHED";
}

export interface CampaignMeta {
  total_campaigns: number;
  generated_at: string | null;
  source: string;
}

export interface CampaignResponse {
  meta: CampaignMeta;
  campaigns: Campaign[];
}

/**
 * Base URL
 * Example:
 *   VITE_API_BASE_URL=http://localhost:8000
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

/* ------------------------------------------------------------------ */
/* Campaign Intelligence APIs                                          */
/* ------------------------------------------------------------------ */

export async function getCampaignRecommendations(): Promise<CampaignResponse> {
  const res = await fetch(`${API_BASE_URL}/ai/campaign-recommendations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch campaigns (${res.status})`);
  }

  return res.json();
}

/* ------------------------------------------------------------------ */
/* Campaign Actions (used by DetailPanel buttons)                       */
/* ------------------------------------------------------------------ */

export async function approveCampaign(campaign: Campaign): Promise<Campaign> {
  const res = await fetch(`${API_BASE_URL}/campaigns/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(campaign),
  });

  if (!res.ok) {
    throw new Error(`Approve failed (${res.status})`);
  }

  return res.json();
}

export async function launchCampaign(campaignId: string): Promise<Campaign> {
  const res = await fetch(
    `${API_BASE_URL}/campaigns/launch/${campaignId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Launch failed (${res.status})`);
  }

  return res.json();
}

export async function ingestCustomers(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/ingest/customers`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Customer ingestion failed");
  return res.json();
}

export async function ingestPurchases(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/ingest/purchases`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Purchase ingestion failed");
  return res.json();
}

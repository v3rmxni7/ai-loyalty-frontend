// Main Dashboard - Campaign Intelligence Platform
// Orchestrates KPI Strip, Campaign Grid, and Detail Panel

import { useState, useEffect } from 'react';
import {
  getCampaignRecommendations,
  Campaign,
  CampaignResponse,
} from '@/api/client';

import KpiStrip from '@/components/KpiStrip';
import CampaignCard from '@/components/CampaignCard';
import DetailPanel from '@/components/DetailPanel';
import DataIngestionPanel from "@/components/DataIngestionPanel";

import { Loader2, RefreshCw, Sparkles } from 'lucide-react';

function Dashboard() {
  const [data, setData] = useState<CampaignResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCampaignRecommendations();

      // Defensive safety
      if (!result || !Array.isArray(result.campaigns)) {
        throw new Error('Invalid API response');
      }

      setData(result);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load campaign recommendations');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedCampaign(null), 200);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading recommendations…</span>
        </div>
      </div>
    );
  }

  /* ---------------- Error ---------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={fetchData} className="btn-secondary inline-flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Data ---------------- */

  const meta = data?.meta ?? {
    total_campaigns: 0,
    generated_at: null,
    source: '',
  };

  const campaigns = data?.campaigns ?? [];

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Campaign Intelligence
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-Powered Recommendations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Generated: {formatDate(meta.generated_at)}
              </span>
              <button onClick={fetchData} className="btn-ghost">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <section className="mb-8">
          <DataIngestionPanel onSuccess={fetchData} />
        </section>

        {/* KPI Strip */}
        <section className="mb-8">
          <KpiStrip campaigns={campaigns} />
        </section>

        {/* Campaign Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">
              Recommended Campaigns
            </h2>
            <span className="text-xs text-muted-foreground">
              {campaigns.length} campaigns • Source: {meta.source || 'AI Engine'}
            </span>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No campaign recommendations available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.campaign_id}
                  campaign={campaign}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Slide-over Detail Panel */}
      <DetailPanel
        campaign={selectedCampaign}
        isOpen={panelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
}

export default Dashboard;

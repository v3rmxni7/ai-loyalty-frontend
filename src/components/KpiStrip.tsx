// Level 1: Executive KPI Overview
// Displays Total Campaigns, Estimated Total Cost, Average ROI

import { TrendingUp, DollarSign, BarChart3, LucideIcon } from 'lucide-react';
import { Campaign } from '@/api/client';

interface KpiStripProps {
  campaigns: Campaign[];
}

interface KpiItem {
  label: string;
  value: string;
  icon: LucideIcon;
  highlight?: boolean;
}

function KpiStrip({ campaigns }: KpiStripProps) {
  const totalCampaigns = campaigns.length;
  
  const totalCost = campaigns.reduce(
    (sum, c) => sum + (c.roi_estimation?.estimated_campaign_cost || 0),
    0
  );
  
  const avgRoi = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + (c.roi_estimation?.estimated_roi || 0), 0) / campaigns.length
    : 0;

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatRoi = (value: number): string => {
    return `${value.toFixed(2)}x`;
  };

  const kpis: KpiItem[] = [
    {
      label: 'Total Campaigns',
      value: totalCampaigns.toString(),
      icon: BarChart3,
    },
    {
      label: 'Estimated Total Cost',
      value: formatCurrency(totalCost),
      icon: DollarSign,
    },
    {
      label: 'Average Estimated ROI',
      value: formatRoi(avgRoi),
      icon: TrendingUp,
      highlight: avgRoi >= 2,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="kpi-card">
          <div className="flex items-center justify-between">
            <span className="kpi-label">{kpi.label}</span>
            <kpi.icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className={`kpi-value ${kpi.highlight ? 'roi-positive' : ''}`}>
            {kpi.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default KpiStrip;

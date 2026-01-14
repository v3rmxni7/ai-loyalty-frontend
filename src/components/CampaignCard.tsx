// Level 2: Campaign Summary Card
// Displays segment, type, channel, priority, message preview, ROI, and CTA

import { ArrowRight } from 'lucide-react';
import { Campaign } from '@/api/client';

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails: (campaign: Campaign) => void;
}

function CampaignCard({ campaign, onViewDetails }: CampaignCardProps) {
  const {
    segment,
    campaign_type,
    channel,
    priority,
    message,
    roi_estimation,
    status,
  } = campaign;

  const roi = roi_estimation?.estimated_roi || 0;

  const getPriorityClass = (): string => {
    switch (priority) {
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      case 'low':
        return 'badge-low';
      default:
        return 'badge-low';
    }
  };

  const getRoiClass = (): string => {
    if (roi >= 3) return 'roi-positive';
    if (roi >= 1.5) return 'roi-neutral';
    return 'roi-negative';
  };

  const getStatusLabel = (): string => {
    switch (status) {
      case 'AI_RECOMMENDED':
        return 'AI Recommended';
      case 'DRAFT':
        return 'Draft';
      case 'LAUNCHED':
        return 'Launched';
      default:
        return status;
    }
  };

  const truncateMessage = (text: string, maxLength = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="campaign-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{segment}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {campaign_type} • {channel}
          </p>
        </div>
        <span className={`badge-priority ${getPriorityClass()} capitalize shrink-0`}>
          {priority}
        </span>
      </div>

      {/* Message Preview */}
      <p className="text-sm text-muted-foreground mt-3 flex-1 leading-relaxed">
        {truncateMessage(message)}
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Est. ROI</p>
          <p className={`roi-value ${getRoiClass()}`}>
            {roi.toFixed(2)}x
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {getStatusLabel()}
          </span>
          <button
            onClick={() => onViewDetails(campaign)}
            className="btn-ghost group"
          >
            View details
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;

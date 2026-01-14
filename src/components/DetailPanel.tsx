// Level 3: Slide-over Detail Panel
// Full campaign intelligence view with AI insight, strategy, parameters, ROI breakdown

import { useState } from 'react';
import {
  X,
  Sparkles,
  Users,
  Clock,
  Target,
  TrendingUp,
  DollarSign,
  Percent,
} from 'lucide-react';

import { Campaign } from '@/api/client';

interface DetailPanelProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

function DetailPanel({ campaign, isOpen, onClose }: DetailPanelProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!campaign || !isOpen) return null;

  const {
    segment,
    campaign_type,
    channel,
    priority,
    reason,
    insight,
    message,
    parameters,
    roi_estimation,
    status,
    campaign_id,
  } = campaign;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getPriorityClass = () => {
    switch (priority) {
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      case 'low':
      default:
        return 'badge-low';
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US').format(value);

  const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;

  /* ---------------- Backend Actions ---------------- */

  const handleSaveDraft = async () => {
    setActionLoading(true);
    try {
      await fetch(`/ai/campaigns/${campaign_id}/save-draft`, {
        method: 'POST',
      });
      handleClose();
    } catch (err) {
      console.error('Save draft failed', err);
      alert('Failed to save draft');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await fetch(`/ai/campaigns/${campaign_id}/approve`, {
        method: 'POST',
      });
      handleClose();
    } catch (err) {
      console.error('Approve failed', err);
      alert('Failed to approve campaign');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`panel-overlay ${isClosing ? 'fade-out' : 'fade-in'}`}
        onClick={handleOverlayClick}
      />

      {/* Panel */}
      <div
        className={`detail-panel ${
          isClosing ? 'slide-out-right' : 'slide-in-right'
        }`}
      >
        {/* Header */}
        <div className="detail-section flex items-start justify-between sticky top-0 bg-card z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-foreground">{segment}</h2>
              <span className={`badge-priority ${getPriorityClass()} capitalize`}>
                {priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {campaign_type} • {channel}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Insight */}
        <div className="detail-section">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-medium">AI Insight</h3>
          </div>
          <div className="insight-box">
            <p className="text-sm leading-relaxed">{insight}</p>
          </div>
        </div>

        {/* Strategy */}
        <div className="detail-section">
          <h3 className="text-sm font-medium mb-3">Strategy Reason</h3>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>

        {/* Message */}
        <div className="detail-section">
          <h3 className="text-sm font-medium mb-3">Campaign Message</h3>
          <div className="bg-secondary rounded-lg p-4 border">
            <p className="italic text-sm">"{message}"</p>
          </div>
        </div>

        {/* Parameters */}
        <div className="detail-section grid grid-cols-3 gap-3">
          <div className="bg-secondary p-3 rounded text-center">
            <Target className="mx-auto mb-1" />
            <p className="font-semibold">{parameters?.points ?? 0}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          <div className="bg-secondary p-3 rounded text-center">
            <Clock className="mx-auto mb-1" />
            <p className="font-semibold">{parameters?.duration_days ?? 0}</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </div>
          <div className="bg-secondary p-3 rounded text-center">
            <Users className="mx-auto mb-1" />
            <p className="font-semibold">
              {formatNumber(parameters?.target_size ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground">Audience</p>
          </div>
        </div>

        {/* ROI */}
        <div className="detail-section">
          <h3 className="text-sm font-medium mb-3">ROI Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Participation</span>
              <span>{formatPercent(roi_estimation.estimated_participation_rate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cost</span>
              <span>{formatCurrency(roi_estimation.estimated_campaign_cost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue</span>
              <span>{formatCurrency(roi_estimation.estimated_incremental_revenue)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>ROI</span>
              <span>{roi_estimation.estimated_roi.toFixed(2)}x</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="detail-section border-t bg-card sticky bottom-0 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Status: {status.replace('_', ' ')}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              className="btn-secondary"
              disabled={actionLoading}
            >
              Save Draft
            </button>
            <button
              onClick={handleApprove}
              className="btn-primary"
              disabled={actionLoading}
            >
              Approve & Launch
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailPanel;

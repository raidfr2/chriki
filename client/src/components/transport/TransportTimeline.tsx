import React from 'react';
import { RoutePlan, RouteSegment, TransitSegment, WalkSegment, PointSegment } from '@/lib/transportTypes';

const MODE_COLORS: Record<string, string> = {
  bus: '#f97316',
  tram: '#7c3aed',
  walk: '#9ca3af',
};

function StartOrEnd({ seg }: { seg: PointSegment }) {
  return (
    <div className="flex items-center">
      <div className="relative flex w-8 shrink-0 flex-col items-center justify-start mr-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: seg.color || '#6b7280' }}
        >
          {seg.icon ?? '📍'}
        </div>
      </div>
      <div className="flex-1">
        <div className="font-bold text-sm">{seg.title}</div>
        {seg.subtitle && <div className="text-xs text-muted-foreground">{seg.subtitle}</div>}
      </div>
    </div>
  );
}

function WalkCard({ seg }: { seg: WalkSegment }) {
  return (
    <div className="bg-muted rounded-lg p-3 cursor-pointer hover:bg-muted/80 transition-colors">
      <div className="flex items-center justify-start">
        <div className="flex items-center">
          <div
            className="w-1 h-8 bg-muted-foreground/30 mr-6"
            style={{
              background:
                'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, var(--muted-foreground) 3px, var(--muted-foreground) 6px)',
            }}
          />
          <div className="text-sm text-foreground">
            <span className="font-medium">{seg.minutes} min</span> • Marche • {seg.distanceMeters} mètres
          </div>
        </div>
      </div>
    </div>
  );
}

function TransitCard({ seg }: { seg: TransitSegment }) {
  const color = MODE_COLORS[seg.mode];
  return (
    <div className="rounded-xl border bg-card p-3 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Left colored rail with icon */}
        <div className="relative flex w-8 shrink-0 flex-col items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: color }}
          >
            {seg.mode === 'bus' ? '🚌' : '🚊'}
          </div>
          <div className="absolute left-[14px] top-8 bottom-3 w-[4px] rounded" style={{ backgroundColor: color }} />
          <div className="absolute bottom-2 left-[12px] w-2 h-2 rounded-full bg-card border" style={{ borderColor: color }} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-start">
            <div>
              <div className="font-bold text-foreground">{seg.fromTitle}</div>
              {seg.fromSubtitle && <div className="text-xs text-muted-foreground">{seg.fromSubtitle}</div>}
            </div>
          </div>

          <div className="mt-3 space-y-1 text-sm text-foreground">
            <div>
              <span className="font-medium">{seg.minutes} min</span> • {seg.mode === 'bus' ? 'Bus' : 'Tram'}
              {seg.headwayMinutes ? ` • Toutes les ${seg.headwayMinutes} minutes` : ''}
            </div>
            <div className="flex items-center gap-2">
              {seg.lineLabel && (
                <span
                  className={`${seg.mode === 'bus' ? 'bg-orange-500' : 'bg-purple-600'} text-white px-2 py-0.5 rounded text-xs font-bold`}
                >
                  {seg.lineLabel}
                </span>
              )}
              {seg.priceLabel && <span className="text-xs text-muted-foreground">{seg.priceLabel}</span>}
            </div>
          </div>

          <div className="mt-4">
            <div className="font-semibold text-sm text-foreground">{seg.toTitle}</div>
            {seg.toSubtitle && <div className="text-xs text-muted-foreground">{seg.toSubtitle}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransportTimeline({ plan }: { plan: RoutePlan }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden">
        <div className="bg-foreground text-background p-4 font-mono font-bold flex items-center justify-between">
          <span>{plan.meta.title}</span>
          <span className="text-sm">{plan.meta.durationLabel}</span>
        </div>

        <div className="p-4 space-y-4">
          {plan.segments.map((seg: RouteSegment, idx: number) => {
            if (seg.type === 'point') return <StartOrEnd key={idx} seg={seg} />;
            if (seg.type === 'walk') return <WalkCard key={idx} seg={seg} />;
            return <TransitCard key={idx} seg={seg} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default TransportTimeline;
